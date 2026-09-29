import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';
import { bookingSchema } from '@/lib/validators/bookingValidator';
import { generateKodeBooking } from '@/lib/utils/kodeBooking';

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
    const klasifikasi = klasifikasiBarang(data.items);

    if (klasifikasi.kategori === 'REJECT') {
      return NextResponse.json({ error: klasifikasi.alasan }, { status: 422 });
    }

    const user = await prisma.user.create({
      data: {
        nama: data.nama,
        noWa: data.noWa,
        persona: data.persona,
        alamat: data.alamat,
      },
    });

    if (klasifikasi.kategori === 'CUSTOM') {
      const booking = await prisma.booking.create({
        data: {
          kodeBooking: generateKodeBooking(),
          userId: user.id,
          kategori: 'CUSTOM',
          durasiBulan: data.durasiBulan,
          totalHarga: 0,
          status: 'LEAD',
          tanggalPickup: new Date(data.tanggalPickup),
          lokasiPickup: data.lokasiPickup,
          items: {
            create: data.items.map((i: any) => ({
              namaBarang: i.nama,
              tipe: 'CUSTOM',
              jumlah: i.jumlah,
            })),
          },
          statusLogs: {
            create: {
              statusBaru: 'LEAD',
              diubahOleh: 'SYSTEM',
              catatan: 'Booking CUSTOM, tunggu admin',
            },
          },
        },
      });
      return NextResponse.json(
        { message: 'Booking CUSTOM - admin akan follow-up', booking, klasifikasi },
        { status: 201 }
      );
    }

    const quotation = hitungQuotation(
      klasifikasi.kategori as 'A' | 'B',
      data.durasiBulan
    )!;

    const booking = await prisma.booking.create({
      data: {
        kodeBooking: generateKodeBooking(),
        userId: user.id,
        kategori: klasifikasi.kategori,
        durasiBulan: data.durasiBulan,
        totalHarga: quotation.totalHarga,
        status: 'APPROVED',
        tanggalPickup: new Date(data.tanggalPickup),
        lokasiPickup: data.lokasiPickup,
        items: {
          create: data.items.map((i: any) => ({
            namaBarang: i.nama,
            tipe: 'KECIL',
            jumlah: i.jumlah,
          })),
        },
        quotation: {
          create: {
            kategori: klasifikasi.kategori,
            hargaPerBulan: quotation.hargaPerBulan,
            totalHarga: quotation.totalHarga,
            status: 'APPROVED',
            approvedAt: new Date(),
          },
        },
        statusLogs: {
          create: {
            statusBaru: 'APPROVED',
            diubahOleh: 'SYSTEM',
            catatan: 'Booking dibuat via form',
          },
        },
      },
      include: {
        user: true,
        items: true,
        quotation: true,
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
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      items: true,
      quotation: true,
      conditionReport: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(bookings);
}
