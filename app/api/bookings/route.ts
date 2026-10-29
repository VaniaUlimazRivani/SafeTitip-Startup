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

    // Validasi ulang Ongkir & Jarak di sisi server agar tidak bisa dimanipulasi dari browser
    if (data.metodePickup === 'PICKUP' || data.metodeDelivery === 'DELIVERY') {
      if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        return NextResponse.json(
          { error: 'Koordinat lokasi penjemputan/pengantaran wajib dipilih.' },
          { status: 400 }
        );
      }

      const { kalkulasiOngkirLengkap } = await import('@/lib/services/ongkirService');
      const serverCalc = kalkulasiOngkirLengkap(
        { lat: data.latitude, lng: data.longitude },
        klasifikasi.kategori,
        data.metodePickup,
        data.metodeDelivery,
        data.jarakKm
      );

      if (serverCalc.isOutOfRange) {
        return NextResponse.json(
          {
            error: `Lokasi (${serverCalc.jarakKm} km) berada di luar batas jangkauan layanan kurir Kosinaja (Maksimal ${serverCalc.maxDistanceKm} km).`,
          },
          { status: 422 }
        );
      }

      // Terapkan nilai terverifikasi server
      data.jarakKm = serverCalc.jarakKm;
      data.ongkirPickup = serverCalc.ongkirPickup;
      data.ongkirDelivery = serverCalc.ongkirDelivery;
      data.totalOngkir = serverCalc.totalOngkir;
      data.surchargeKategori = serverCalc.surchargeKategori;
      data.mapsUrl = serverCalc.mapsUrl;
    } else {
      data.ongkirPickup = 0;
      data.ongkirDelivery = 0;
      data.totalOngkir = 0;
      data.surchargeKategori = 0;
    }

    const labelDurasi = `${durasiNilai} ${tipeDurasi === 'HARI' ? 'Hari' : tipeDurasi === 'MINGGU' ? 'Minggu' : 'Bulan'}`;

    if (klasifikasi.kategori === 'CUSTOM') {
      const booking = await createNewBooking({
        userId: data.userId,
        nama: data.nama,
        noWa: data.noWa,
        alamat: data.alamat,
        lokasiPickup: data.lokasiPickup,
        metodePickup: data.metodePickup,
        metodeDelivery: data.metodeDelivery,
        jarakKm: data.jarakKm,
        ongkirPickup: data.ongkirPickup,
        ongkirDelivery: data.ongkirDelivery,
        totalOngkir: data.totalOngkir,
        surchargeKategori: data.surchargeKategori,
        latitude: data.latitude,
        longitude: data.longitude,
        mapsUrl: data.mapsUrl,
        tanggalPickup: data.tanggalPickup,
        durasiBulan: data.durasiBulan,
        tipeDurasi,
        durasiNilai,
        labelDurasi,
        kategori: 'CUSTOM',
        totalHarga: (data.totalOngkir || 0),
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

    const totalHargaKeseluruhan = quotation.totalHarga + (data.totalOngkir || 0);

    const booking = await createNewBooking({
      userId: data.userId,
      nama: data.nama,
      noWa: data.noWa,
      alamat: data.alamat,
      lokasiPickup: data.lokasiPickup,
      metodePickup: data.metodePickup,
      metodeDelivery: data.metodeDelivery,
      jarakKm: data.jarakKm,
      ongkirPickup: data.ongkirPickup,
      ongkirDelivery: data.ongkirDelivery,
      totalOngkir: data.totalOngkir,
      surchargeKategori: data.surchargeKategori,
      latitude: data.latitude,
      longitude: data.longitude,
      mapsUrl: data.mapsUrl,
      tanggalPickup: data.tanggalPickup,
      durasiBulan: quotation.durasiBulan,
      tipeDurasi,
      durasiNilai,
      labelDurasi: quotation.labelDurasi,
      kategori: klasifikasi.kategori,
      totalHarga: totalHargaKeseluruhan,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const status = searchParams.get('status') || undefined;

    const bookings = await getAllBookings({ userId, status });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
