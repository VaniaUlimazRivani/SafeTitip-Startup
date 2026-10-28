import { NextRequest, NextResponse } from 'next/server';
import { verifyMidtransSignature, serverKey } from '@/lib/midtrans';
import { getBookingByOrderId, upsertPayment } from '@/lib/repository/bookingRepo';

export async function POST(req: NextRequest) {
  try {
    const notification = await req.json();

    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;
    const transactionTime = notification.transaction_time ? new Date(notification.transaction_time) : undefined;
    const settlementTime = notification.settlement_time ? new Date(notification.settlement_time) : undefined;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Format notifikasi tidak valid (order_id hilang)' },
        { status: 400 }
      );
    }

    // Validasi signature kecuali dalam mode mock / testing internal
    const isMockMode = !serverKey || serverKey.includes('placeholder') || serverKey.includes('demo');
    if (!isMockMode && signatureKey) {
      const isValid = verifyMidtransSignature(orderId, statusCode, grossAmount, signatureKey);
      if (!isValid) {
        console.warn(`[Midtrans Webhook] Invalid signature key for order ${orderId}`);
        return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
      }
    }

    // Cari booking berdasarkan orderId
    const booking = await getBookingByOrderId(orderId);
    if (!booking) {
      console.warn(`[Midtrans Webhook] Booking dengan orderId ${orderId} tidak ditemukan.`);
      // Tetap kembalikan 200 agar Midtrans tidak retry berulang
      return NextResponse.json({ message: 'Order tidak ditemukan tetapi notifikasi diterima' });
    }

    // Tentukan status pembayaran akhir
    let finalStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        finalStatus = 'CHALLENGE';
      } else if (fraudStatus === 'accept') {
        finalStatus = 'SETTLEMENT';
      }
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'SETTLEMENT';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
      finalStatus = 'CANCEL';
    } else if (transactionStatus === 'expire') {
      finalStatus = 'EXPIRE';
    } else if (transactionStatus === 'pending') {
      finalStatus = 'PENDING';
    }

    // Simpan ke database
    await upsertPayment({
      bookingId: booking.id,
      orderId,
      amount: Math.round(Number(grossAmount) || booking.totalHarga),
      status: finalStatus,
      paymentType: paymentType || 'UNKNOWN',
      transactionTime,
      settlementTime: finalStatus === 'SETTLEMENT' ? settlementTime || new Date() : undefined,
      rawResponse: JSON.stringify(notification),
    });

    console.log(
      `[Midtrans Webhook] Berhasil memproses notifikasi order ${orderId} -> ${finalStatus}`
    );

    return NextResponse.json({
      status: 'OK',
      message: 'Notifikasi berhasil diproses',
      orderId,
      finalStatus,
    });
  } catch (error: any) {
    console.error('Error saat memproses Midtrans notification:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat webhook Midtrans' },
      { status: 500 }
    );
  }
}
