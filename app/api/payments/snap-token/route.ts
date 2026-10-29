import { NextRequest, NextResponse } from 'next/server';
import { createXenditInvoice } from '@/lib/xendit';
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

    const suffix = Date.now().toString().slice(-4);
    const orderId = `ST-${booking.kodeBooking}-${suffix}`;

    // Siapkan item details
    const items: any[] = [];
    if (booking.items && booking.items.length > 0) {
      booking.items.forEach((item: any, idx: number) => {
        items.push({
          name: (item.namaBarang || `Barang ${idx + 1}`).substring(0, 50),
          price: Math.round(grossAmount / booking.items.length),
          quantity: item.jumlah || 1,
        });
      });
    } else {
      items.push({
        name: `Penitipan SafeTitip (${booking.kodeBooking})`,
        price: grossAmount,
        quantity: 1,
      });
    }

    // Buat invoice checkout Xendit
    const invoice = await createXenditInvoice({
      externalId: orderId,
      amount: grossAmount,
      payerEmail: booking.user?.email || 'customer@kosinaja.id',
      description: `Pembayaran Penitipan SafeTitip - ${booking.kodeBooking}`,
      customer: {
        given_names: booking.user?.nama || 'Mahasiswa SafeTitip',
        email: booking.user?.email || 'customer@kosinaja.id',
        mobile_number: booking.user?.noWa || '081234567890',
        addresses: [
          {
            street_line1: booking.lokasiPickup || booking.user?.alamat || 'Kota Padang',
            city: 'Padang',
            country: 'Indonesia',
          },
        ],
      },
      items,
    });

    const token = invoice.id;
    const redirectUrl = invoice.invoice_url;

    // Simpan ke database MongoDB
    await upsertPayment({
      bookingId: booking.id,
      orderId,
      amount: grossAmount,
      status: 'PENDING',
      snapToken: token,
      snapRedirectUrl: redirectUrl,
      paymentType: 'XENDIT_INVOICE',
      rawResponse: JSON.stringify(invoice),
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice pembayaran Xendit berhasil dibuat.',
      data: {
        token,
        redirectUrl,
        invoiceUrl: redirectUrl,
        invoiceId: token,
        paymentProvider: 'XENDIT',
        orderId,
        grossAmount,
        bookingId: booking.id,
        kodeBooking: booking.kodeBooking,
      },
    });
  } catch (error: any) {
    console.error('Error saat membuat invoice Xendit:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
