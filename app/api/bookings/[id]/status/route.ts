import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { statusBerikutnya } from '@/lib/constants/status';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, catatan } = await req.json();
    const bookingId = Number(params.id);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }

    const next = statusBerikutnya(booking.status);
    if (next !== status && status !== 'DISPUTE') {
      return NextResponse.json(
        { error: `Status harus ${next} atau DISPUTE` },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        statusLogs: {
          create: {
            statusLama: booking.status,
            statusBaru: status,
            diubahOleh: 'ADMIN',
            catatan,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
