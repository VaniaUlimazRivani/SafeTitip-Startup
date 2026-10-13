import { NextRequest, NextResponse } from 'next/server';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';
import { bookingSchema } from '@/lib/validators/bookingValidator';
import { getAllBookings, createNewBooking } from '@/lib/repository/bookingRepo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const tipeDurasi = data.tipeDurasi || 'BULAN';
    const durasiNilai = data.durasiNilai || data.durasiBulan || 1;
    const klasifikasi = klasifikasiBarang(data.items);

    if (klasifikasi.kategori === 'REJECT') {
      return NextResponse.json({ error: klasifikasi.alasan }, { status: 422 });
    }

    const labelDurasi = `${durasiNilai} ${tipeDurasi === 'HARI' ? 'Hari' : tipeDurasi === 'MINGGU' ? 'Minggu' : 'Bulan'}`;

    if (klasifikasi.kategori === 'CUSTOM') {
      const booking = await createNewBooking({
        userId: data.userId,
        nama: data.nama,
        noWa: data.noWa,
        alamat: data.alamat,
        lokasiPickup: data.lokasiPickup,
        tanggalPickup: data.tanggalPickup,
        durasiBulan: data.durasiBulan,
        tipeDurasi,
        durasiNilai,
        labelDurasi,
        kategori: 'CUSTOM',
        totalHarga: 0,
        status: 'LEAD',
        items: data.items,
        quotation: {
          hargaPerBulan: 0,
          totalHarga: 0,
          isCustom: true,
          labelDurasi,
        },
      });

      return NextResponse.json(
        { message: 'Booking CUSTOM - admin akan follow-up', booking, klasifikasi },
        { status: 201 }
      );
    }

    const quotation = hitungQuotation(
      klasifikasi.kategori as 'A' | 'B',
      durasiNilai,
      tipeDurasi
    )!;

    const booking = await createNewBooking({
      userId: data.userId,
      nama: data.nama,
      noWa: data.noWa,
      alamat: data.alamat,
      lokasiPickup: data.lokasiPickup,
      tanggalPickup: data.tanggalPickup,
      durasiBulan: quotation.durasiBulan,
      tipeDurasi,
      durasiNilai,
      labelDurasi: quotation.labelDurasi,
      kategori: klasifikasi.kategori,
      totalHarga: quotation.totalHarga,
      status: 'APPROVED',
      items: data.items,
      quotation: {
        hargaPerBulan: quotation.hargaPerSatuan,
        totalHarga: quotation.totalHarga,
        isCustom: false,
        labelDurasi: quotation.labelDurasi,
      },
    });

    return NextResponse.json(
      { message: 'Booking tersimpan', booking, quotation, klasifikasi },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
