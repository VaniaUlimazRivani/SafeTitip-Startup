import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, picKurir, fotoBefore, fotoAfter, fotoWrapping, items } =
      await req.json();

    const cr = await prisma.conditionReport.create({
      data: {
        bookingId,
        status: 'MENUNGGU_VERIFIKASI',
        picKurir,
        fotoBefore,
        fotoAfter,
        fotoWrapping,
        items: {
          create: items.map((i: any) => ({
            namaBarang: i.namaBarang,
            kondisiAwal: i.kondisiAwal,
            catatanCacat: i.catatanCacat,
            fotoBefore: i.fotoBefore,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(cr, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const crs = await prisma.conditionReport.findMany({
    include: { items: true, booking: true },
  });
  return NextResponse.json(crs);
}
