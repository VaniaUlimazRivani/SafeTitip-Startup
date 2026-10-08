import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, mingguKe, foto, keterangan, adminId } = await req.json();

    const update = await prisma.weeklyUpdate.create({
      data: {
        bookingId,
        mingguKe,
        tanggalUpdate: new Date(),
        foto,
        keterangan,
        adminId,
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get('bookingId');

  const updates = await prisma.weeklyUpdate.findMany({
    where: bookingId ? { bookingId } : undefined,
    orderBy: { tanggalUpdate: 'desc' },
  });
  return NextResponse.json(updates);
}
