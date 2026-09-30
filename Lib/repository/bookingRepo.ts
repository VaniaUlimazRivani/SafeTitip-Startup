import fs from 'fs';
import path from 'path';
import { prisma } from '../db';
import { generateKodeBooking } from '../utils/kodeBooking';

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalBookings(): any[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca data lokal JSON:', e);
    return [];
  }
}

function writeLocalBookings(bookings: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (e) {
    console.error('Gagal menulis data lokal JSON:', e);
  }
}

export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        items: true,
        quotation: true,
        conditionReport: true,
        statusLogs: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookings;
  } catch (dbErr: any) {
    // Fallback gracefully ke file lokal jika database MySQL offline
    console.warn('[Storage] Menggunakan fallback penyimpanan lokal JSON (MySQL offline).');
    const local = readLocalBookings();
    return local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function getBookingById(id: number) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
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
    if (booking) return booking;
  } catch (dbErr: any) {
    console.warn('[Storage] Fallback mencari booking di penyimpanan lokal.');
  }

  const local = readLocalBookings();
  return local.find((b) => Number(b.id) === Number(id)) || null;
}

export async function createNewBooking(payload: {
  nama: string;
  noWa: string;
  persona?: string;
  alamat?: string;
  lokasiPickup?: string;
  tanggalPickup: string;
  durasiBulan: number;
  kategori: string;
  totalHarga: number;
  status: string;
  items: Array<{ nama: string; jumlah: number }>;
  quotation?: {
    hargaPerBulan: number;
    totalHarga: number;
    isCustom?: boolean;
  };
}) {
  const kode = generateKodeBooking();
  const now = new Date();

  try {
    const user = await prisma.user.create({
      data: {
        nama: payload.nama,
        noWa: payload.noWa,
        persona: payload.persona || 'Mahasiswa',
        alamat: payload.lokasiPickup || '',
      },
    });

    const isCustom = payload.kategori === 'CUSTOM';

    const booking = await prisma.booking.create({
      data: {
        kodeBooking: kode,
        userId: user.id,
        kategori: payload.kategori,
        durasiBulan: payload.durasiBulan,
        totalHarga: payload.totalHarga,
        status: payload.status,
        tanggalPickup: new Date(payload.tanggalPickup),
        lokasiPickup: payload.lokasiPickup,
        items: {
          create: payload.items.map((i) => ({
            namaBarang: i.nama,
            tipe: isCustom ? 'CUSTOM' : payload.kategori === 'B' ? 'BESAR' : 'KECIL',
            jumlah: Number(i.jumlah) || 1,
          })),
        },
        quotation: payload.quotation
          ? {
              create: {
                kategori: payload.kategori,
                hargaPerBulan: payload.quotation.hargaPerBulan,
                totalHarga: payload.quotation.totalHarga,
                status: isCustom ? 'PENDING' : 'APPROVED',
                approvedAt: isCustom ? null : now,
              },
            }
          : undefined,
        statusLogs: {
          create: {
            statusBaru: payload.status,
            diubahOleh: 'SYSTEM',
            catatan: isCustom ? 'Booking CUSTOM, menunggu admin' : 'Booking dibuat via web',
          },
        },
      },
      include: {
        user: true,
        items: true,
        quotation: true,
        statusLogs: true,
      },
    });

    return booking;
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - Menyimpan booking baru ke local JSON file.');
    const local = readLocalBookings();
    const newId = local.length > 0 ? Math.max(...local.map((b) => Number(b.id) || 0)) + 1 : 1;

    const newBooking = {
      id: newId,
      kodeBooking: kode,
      userId: newId,
      kategori: payload.kategori,
      durasiBulan: payload.durasiBulan,
      totalHarga: payload.totalHarga,
      status: payload.status,
      tanggalPickup: new Date(payload.tanggalPickup).toISOString(),
      lokasiPickup: payload.lokasiPickup,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      user: {
        id: newId,
        nama: payload.nama,
        noWa: payload.noWa,
        persona: payload.persona || 'Mahasiswa',
        alamat: payload.lokasiPickup || '',
      },
      items: payload.items.map((it, idx) => ({
        id: idx + 1,
        bookingId: newId,
        namaBarang: it.nama,
        tipe: payload.kategori === 'CUSTOM' ? 'CUSTOM' : payload.kategori === 'B' ? 'BESAR' : 'KECIL',
        jumlah: Number(it.jumlah) || 1,
      })),
      quotation: payload.quotation
        ? {
            id: newId,
            bookingId: newId,
            kategori: payload.kategori,
            hargaPerBulan: payload.quotation.hargaPerBulan,
            totalHarga: payload.quotation.totalHarga,
            status: payload.kategori === 'CUSTOM' ? 'PENDING' : 'APPROVED',
            isCustom: payload.kategori === 'CUSTOM',
            approvedAt: payload.kategori === 'CUSTOM' ? null : now.toISOString(),
          }
        : null,
      statusLogs: [
        {
          id: 1,
          bookingId: newId,
          statusLama: null,
          statusBaru: payload.status,
          diubahOleh: 'SYSTEM',
          catatan: payload.kategori === 'CUSTOM' ? 'Booking CUSTOM, menunggu admin' : 'Booking dibuat via web',
          createdAt: now.toISOString(),
        },
      ],
    };

    local.unshift(newBooking);
    writeLocalBookings(local);
    return newBooking;
  }
}

export async function updateStatusBooking(id: number, statusBaru: string, catatan?: string) {
  const now = new Date();

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (booking) {
      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: statusBaru,
          statusLogs: {
            create: {
              statusLama: booking.status,
              statusBaru,
              diubahOleh: 'ADMIN',
              catatan: catatan || `Status diubah ke ${statusBaru}`,
            },
          },
        },
        include: {
          user: true,
          items: true,
          quotation: true,
          statusLogs: { orderBy: { createdAt: 'asc' } },
        },
      });
      return updated;
    }
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - Mengupdate status di local JSON file.');
  }

  const local = readLocalBookings();
  const idx = local.findIndex((b) => Number(b.id) === Number(id));
  if (idx === -1) return null;

  const current = local[idx];
  const oldStatus = current.status;
  current.status = statusBaru;
  current.updatedAt = now.toISOString();

  if (!current.statusLogs) current.statusLogs = [];
  current.statusLogs.push({
    id: current.statusLogs.length + 1,
    bookingId: id,
    statusLama: oldStatus,
    statusBaru,
    diubahOleh: 'ADMIN',
    catatan: catatan || `Status diubah ke ${statusBaru}`,
    createdAt: now.toISOString(),
  });

  local[idx] = current;
  writeLocalBookings(local);
  return current;
}
