import { NextRequest, NextResponse } from 'next/server';
import { verifyXenditWebhook } from '@/lib/xendit';
import { getBookingByOrderId, upsertPayment } from '@/lib/repository/bookingRepo';

export async function POST(req: NextRequest) {
  try {
    const callbackTokenHeader = req.headers.get('x-callback-token');

    if (!verifyXenditWebhook(callbackTokenHeader)) {
      console.warn('[Webhook] Callback token Xendit tidak valid.');
      return NextResponse.json({ error: 'Unauthorized callback token' }, { status: 401 });
    }

    const notification = await req.json();

    const externalId = notification.external_id || notification.externalId;
    const status = (notification.status || '').toUpperCase();
    const paidAmount = notification.paid_amount || notification.amount || 0;
    const paymentMethod = notification.payment_method || 'XENDIT';
    const paymentChannel = notification.payment_channel || '';
    const paidAt = notification.paid_at ? new Date(notification.paid_at) : undefined;

    if (!externalId) {
      return NextResponse.json(
        { error: 'Format webhook tidak valid (external_id hilang)' },
        { status: 400 }
      );
    }

    const booking = await getBookingByOrderId(externalId);
    if (!booking) {
      console.warn(`[Webhook Xendit] Booking external_id ${externalId} tidak ditemukan.`);
      return NextResponse.json({ message: 'Order tidak ditemukan tetapi webhook diterima' });
    }

    let finalStatus = 'PENDING';
    if (status === 'PAID' || status === 'SETTLED') {
      finalStatus = 'SETTLEMENT';
    } else if (status === 'EXPIRED') {
      finalStatus = 'EXPIRE';
    } else if (status === 'FAILED') {
      finalStatus = 'DENY';
    }

    await upsertPayment({
      bookingId: booking.id,
      orderId: externalId,
      amount: Math.round(Number(paidAmount) || booking.totalHarga),
      status: finalStatus,
      paymentType: paymentChannel ? `${paymentMethod}_${paymentChannel}` : paymentMethod,
      transactionTime: new Date(),
      settlementTime: (status === 'PAID' || status === 'SETTLED') ? (paidAt || new Date()) : undefined,
      rawResponse: JSON.stringify(notification),
    });

    console.log(
      `[Webhook Xendit] Berhasil memproses webhook untuk order ${externalId} -> Status: ${status} (Final: ${finalStatus})`
    );

    return NextResponse.json({
      status: 'OK',
      message: 'Webhook Xendit berhasil diproses',
      orderId: externalId,
      finalStatus,
    });
  } catch (error: any) {
    console.error('Error saat memproses webhook Xendit:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat webhook' },
      { status: 500 }
    );
  }
}
