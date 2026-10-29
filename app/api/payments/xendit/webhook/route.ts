import { NextRequest, NextResponse } from 'next/server';
import { verifyXenditWebhook } from '@/lib/xendit';
import { getBookingByOrderId, upsertPayment } from '@/lib/repository/bookingRepo';

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi callback token dari header Xendit
    const callbackTokenHeader = req.headers.get('x-callback-token');
    if (!verifyXenditWebhook(callbackTokenHeader)) {
      console.warn('[Xendit Webhook] Callback token tidak valid atau ditolak.');
      return NextResponse.json({ error: 'Unauthorized callback token' }, { status: 401 });
    }

    const payload = await req.json();

    // Xendit Invoice Callback Payload format:
    // {
    //   id: "644...",
    //   external_id: "ST-STP-1234-5678",
    //   user_id: "...",
    //   status: "PAID" | "SETTLED" | "EXPIRED" | "PENDING",
    //   merchant_name: "...",
    //   amount: 150000,
    //   paid_amount: 150000,
    //   payment_method: "QRIS" | "BANK_TRANSFER" | "EWALLET",
    //   payment_channel: "BCA" | "OVO" | "DANA" | "QRIS",
    //   paid_at: "2026-10-29T...",
    //   ...
    // }

    const externalId = payload.external_id || payload.externalId;
    const status = (payload.status || '').toUpperCase();
    const paidAmount = payload.paid_amount || payload.amount || 0;
    const paymentMethod = payload.payment_method || payload.paymentMethod || 'XENDIT';
    const paymentChannel = payload.payment_channel || payload.paymentChannel || '';
    const paidAt = payload.paid_at ? new Date(payload.paid_at) : undefined;

    if (!externalId) {
      return NextResponse.json(
        { error: 'Format notifikasi tidak valid (external_id hilang)' },
        { status: 400 }
      );
    }

    // 2. Cari booking berdasarkan external_id / order_id
    const booking = await getBookingByOrderId(externalId);
    if (!booking) {
      console.warn(`[Xendit Webhook] Booking dengan external_id ${externalId} tidak ditemukan.`);
      // Kembalikan 200 agar webhook tidak di-retry terus oleh Xendit
      return NextResponse.json({ message: 'Order tidak ditemukan tetapi webhook diterima' });
    }

    // 3. Tentukan status pembayaran akhir
    let finalStatus = 'PENDING';
    if (status === 'PAID' || status === 'SETTLED') {
      finalStatus = 'SETTLEMENT'; // mapping internal SafeTitip / PAID
    } else if (status === 'EXPIRED') {
      finalStatus = 'EXPIRE';
    } else if (status === 'FAILED') {
      finalStatus = 'DENY';
    }

    const paymentTypeLabel = paymentChannel ? `${paymentMethod}_${paymentChannel}` : paymentMethod;

    // 4. Update data payment & booking di database MongoDB
    await upsertPayment({
      bookingId: booking.id,
      orderId: externalId,
      amount: Math.round(Number(paidAmount) || booking.totalHarga),
      status: finalStatus,
      paymentType: paymentTypeLabel,
      transactionTime: new Date(),
      settlementTime: (status === 'PAID' || status === 'SETTLED') ? (paidAt || new Date()) : undefined,
      rawResponse: JSON.stringify(payload),
    });

    console.log(
      `[Xendit Webhook] Sukses memproses webhook untuk order ${externalId} -> Status: ${status} (Mapped: ${finalStatus})`
    );

    return NextResponse.json({
      status: 'OK',
      message: 'Webhook Xendit berhasil diproses',
      externalId,
      finalStatus,
    });
  } catch (error: any) {
    console.error('[Xendit Webhook Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat memproses webhook Xendit' },
      { status: 500 }
    );
  }
}

