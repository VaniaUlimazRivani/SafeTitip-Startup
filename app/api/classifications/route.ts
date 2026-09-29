import { NextRequest, NextResponse } from 'next/server';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';

export async function POST(req: NextRequest) {
  try {
    const { items, durasiBulan } = await req.json();
    const klasifikasi = klasifikasiBarang(items);

    if (klasifikasi.kategori === 'REJECT') {
      return NextResponse.json(
        { error: klasifikasi.alasan, kategori: 'REJECT' },
        { status: 422 }
      );
    }

    if (klasifikasi.kategori === 'CUSTOM') {
      return NextResponse.json({
        kategori: 'CUSTOM',
        alasan: klasifikasi.alasan,
        quotation: null,
      });
    }

    const quotation = hitungQuotation(
      klasifikasi.kategori as 'A' | 'B',
      durasiBulan
    );

    return NextResponse.json({
      kategori: klasifikasi.kategori,
      alasan: klasifikasi.alasan,
      quotation,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
