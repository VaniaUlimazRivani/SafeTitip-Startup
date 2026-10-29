import { NextRequest, NextResponse } from 'next/server';
import { snap, serverKey } from '@/lib/midtrans';
import { getBookingById, upsertPayment } from '@/lib/repository/bookingRepo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'bookingId wajib disertakan.' },
        { status: 400 }
      );
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Cek jika sudah lunas
    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json(
        {
          success: false,
          error: 'Tagihan penitipan ini sudah lunas.',
          paymentStatus: 'PAID',
        },
        { status: 400 }
      );
    }

    const grossAmount = Math.round(Number(booking.totalHarga) || 0);
    if (grossAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Total tagihan harus lebih besar dari 0.' },
        { status: 400 }
      );
    }

    // Format unique order_id untuk Midtrans (orderId tidak boleh duplicate di Midtrans)
    const suffix = Date.now().toString().slice(-4);
    const orderId = `ST-${booking.kodeBooking}-${suffix}`;

    // Siapkan item details
    const itemDetails: any[] = [];
    if (booking.items && booking.items.length > 0) {
      booking.items.forEach((item: any, idx: number) => {
        itemDetails.push({
          id: `ITEM-${idx + 1}`,
          price: Math.round(grossAmount / booking.items.length),
          quantity: 1,
          name: (item.namaBarang || `Barang ${idx + 1}`).substring(0, 50),
        });
      });
    }

    // Pastikan total itemDetails sama dengan gross_amount jika itemDetails disertakan
    const itemsTotal = itemDetails.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const diff = grossAmount - itemsTotal;
    if (diff !== 0 && itemDetails.length > 0) {
      itemDetails[0].price += diff;
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: booking.user?.nama || 'Pengguna SafeTitip',
        email: booking.user?.email || 'customer@safetitip.com',
        phone: booking.user?.noWa || '081234567890',
        shipping_address: {
          address: booking.lokasiPickup || booking.user?.alamat || 'Alamat Penjemputan',
        },
      },
      item_details: itemDetails.length > 0 ? itemDetails : undefined,
    };

    let token = '';
    let redirectUrl = '';

    // Cek apakah serverKey masih placeholder atau sudah diisi kredensial Midtrans asli
    const isMockMode = !serverKey || serverKey.includes('placeholder') || serverKey.includes('demo');

    if (isMockMode) {
      console.warn(
        '[Midtrans] Menggunakan mode simulasi / mock token karena MIDTRANS_SERVER_KEY belum diisi kunci riil.'
      );
      token = `mock_snap_token_${orderId}_${Date.now()}`;
      redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`;
    } else {
      try {
        const transaction = await snap.createTransaction(parameter);
        token = transaction.token;
        redirectUrl = transaction.redirect_url;
      } catch (snapError: any) {
        console.error('[Midtrans Error]', snapError);
        return NextResponse.json(
          {
            success: false,
            error: snapError.message || 'Gagal membuat transaksi di Midtrans',
            detail: snapError.ApiResponse || null,
          },
          { status: 502 }
        );
      }
    }

    // Simpan ke database
    await upsertPayment({
      bookingId: booking.id,
      orderId,
      amount: grossAmount,
      status: 'PENDING',
      snapToken: token,
      snapRedirectUrl: redirectUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Token pembayaran Midtrans berhasil dibuat.',
      data: {
        token,
        redirectUrl,
        orderId,
        grossAmount,
        bookingId: booking.id,
        kodeBooking: booking.kodeBooking,
      },
    });
  } catch (error: any) {
    console.error('Error saat membuat Snap Token:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
