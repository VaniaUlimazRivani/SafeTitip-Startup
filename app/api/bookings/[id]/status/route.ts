import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateStatusBooking } from '@/lib/repository/bookingRepo';
import { STATUS_FLOW } from '@/lib/constants/status';

const ALLOWED_STATUSES = [...STATUS_FLOW, 'DISPUTE', 'MENUNGGU', 'DIKONFIRMASI', 'SELESAI'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, catatan } = await req.json();
    const bookingId = id;

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }

    // Normalisasi status jika dikirim dalam istilah bahasa Indonesia
    let normalizedStatus = status;
    if (status === 'MENUNGGU') normalizedStatus = 'LEAD';
    if (status === 'DIKONFIRMASI') normalizedStatus = 'APPROVED';
    if (status === 'SELESAI') normalizedStatus = 'CLOSED';

    if (!ALLOWED_STATUSES.includes(normalizedStatus) && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status ${status} tidak valid` },
        { status: 400 }
      );
    }

    const updated = await updateStatusBooking(
      bookingId,
      normalizedStatus,
      catatan || `Status diubah menjadi ${normalizedStatus} oleh Admin`
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
