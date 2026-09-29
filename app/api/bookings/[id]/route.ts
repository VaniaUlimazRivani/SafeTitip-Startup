import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
    include: {
      user: true,
      items: true,
      quotation: true,
      conditionReport: { include: { items: true } },
      weeklyUpdates: true,
      agreement: true,
      statusLogs: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json(booking);
}
