import { NextRequest, NextResponse } from 'next/server';
import { getBookingById } from '@/lib/repository/bookingRepo';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      kodeBooking: booking.kodeBooking,
      totalHarga: booking.totalHarga,
      paymentStatus: booking.paymentStatus || 'UNPAID',
      payment: (booking as any).payment || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
