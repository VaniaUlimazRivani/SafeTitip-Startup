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

export async function getAllBookings(filters?: { userId?: string; status?: string }) {
  try {
    const whereClause: any = {};
    if (filters?.userId) {
      whereClause.userId = filters.userId;
    }
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const bookings = await prisma.booking.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        user: true,
        items: true,
        quotation: true,
        conditionReport: true,
        payment: true,
        statusLogs: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookings;
  } catch (dbErr: any) {
    // Fallback gracefully ke file lokal jika database MongoDB offline
    console.warn('[Storage] Menggunakan fallback penyimpanan lokal JSON (MongoDB offline).');
    let local = readLocalBookings();
    if (filters?.userId) {
      local = local.filter((b) => b.userId === filters.userId);
    }
    if (filters?.status) {
      local = local.filter((b) => b.status === filters.status);
    }
    return local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function getBookingById(id: string) {
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
        payment: true,
        statusLogs: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (booking) return booking;
  } catch (dbErr: any) {
    console.warn('[Storage] Fallback mencari booking di penyimpanan lokal.');
  }

  const local = readLocalBookings();
  return local.find((b) => b.id === id) || null;
}

export async function createNewBooking(payload: {
  userId?: string;
  nama: string;
  noWa: string;
  alamat?: string;
  lokasiPickup?: string;
  tanggalPickup: string;
  durasiBulan: number;
  tipeDurasi?: string;
  durasiNilai?: number;
  labelDurasi?: string;
  kategori: string;
  totalHarga: number;
  status: string;
  items: Array<{ nama: string; jumlah: number }>;
  metodePickup?: string;
  metodeDelivery?: string;
  jarakKm?: number;
  ongkirPickup?: number;
  ongkirDelivery?: number;
  totalOngkir?: number;
  surchargeKategori?: number;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
  quotation?: {
    hargaPerBulan: number;
    totalHarga: number;
    isCustom?: boolean;
    labelDurasi?: string;
  };
}) {
  const kode = generateKodeBooking();
  const now = new Date();

  try {
    let finalUserId = payload.userId;

    if (finalUserId) {
      // Pastikan user memang ada di MongoDB
      const existingUser = await prisma.user.findUnique({ where: { id: finalUserId } });
      if (!existingUser) {
        finalUserId = undefined;
      }
    }

    if (!finalUserId) {
      const user = await prisma.user.create({
        data: {
          nama: payload.nama,
          noWa: payload.noWa,
          alamat: payload.lokasiPickup || '',
        },
      });
      finalUserId = user.id;
    }

    const isCustom = payload.kategori === 'CUSTOM';

    const booking = await prisma.booking.create({
      data: {
        kodeBooking: kode,
        userId: finalUserId,
        kategori: payload.kategori,
        durasiBulan: payload.durasiBulan,
        totalHarga: payload.totalHarga,
        status: payload.status,
        paymentStatus: 'UNPAID',
        tanggalPickup: new Date(payload.tanggalPickup),
        lokasiPickup: payload.lokasiPickup,
        metodePickup: payload.metodePickup || 'PICKUP',
        metodeDelivery: payload.metodeDelivery || 'DELIVERY',
        jarakKm: payload.jarakKm ?? null,
        ongkirPickup: payload.ongkirPickup ?? 0,
        ongkirDelivery: payload.ongkirDelivery ?? 0,
        totalOngkir: payload.totalOngkir ?? 0,
        surchargeKategori: payload.surchargeKategori ?? 0,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        mapsUrl: payload.mapsUrl ?? null,
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
      } as any,
      include: {
        user: true,
        items: true,
        quotation: true,
        payment: true,
        statusLogs: true,
      },
    });

    return booking;
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - Menyimpan booking baru ke local JSON file.');
    const local = readLocalBookings();
    const newId = `local_${Date.now()}`;

    const newBooking = {
      id: newId,
      kodeBooking: kode,
      userId: newId,
      kategori: payload.kategori,
      durasiBulan: payload.durasiBulan,
      tipeDurasi: payload.tipeDurasi || 'BULAN',
      durasiNilai: payload.durasiNilai || payload.durasiBulan,
      labelDurasi: payload.labelDurasi || `${payload.durasiBulan} Bulan`,
      totalHarga: payload.totalHarga,
      status: payload.status,
      paymentStatus: 'UNPAID',
      payment: null,
      tanggalPickup: new Date(payload.tanggalPickup).toISOString(),
      lokasiPickup: payload.lokasiPickup,
      metodePickup: payload.metodePickup || 'PICKUP',
      metodeDelivery: payload.metodeDelivery || 'DELIVERY',
      jarakKm: payload.jarakKm ?? null,
      ongkirPickup: payload.ongkirPickup ?? 0,
      ongkirDelivery: payload.ongkirDelivery ?? 0,
      totalOngkir: payload.totalOngkir ?? 0,
      surchargeKategori: payload.surchargeKategori ?? 0,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      mapsUrl: payload.mapsUrl ?? null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      user: {
        id: newId,
        nama: payload.nama,
        noWa: payload.noWa,
        alamat: payload.lokasiPickup || '',
      },
      items: payload.items.map((it, idx) => ({
        id: `${newId}_item_${idx}`,
        bookingId: newId,
        namaBarang: it.nama,
        tipe: payload.kategori === 'CUSTOM' ? 'CUSTOM' : payload.kategori === 'B' ? 'BESAR' : 'KECIL',
        jumlah: Number(it.jumlah) || 1,
      })),
      quotation: payload.quotation
        ? {
            id: `${newId}_q`,
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
          id: `${newId}_sl`,
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

export async function updateStatusBooking(id: string, statusBaru: string, catatan?: string) {
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
  const idx = local.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const current = local[idx];
  const oldStatus = current.status;
  current.status = statusBaru;
  current.updatedAt = now.toISOString();

  if (!current.statusLogs) current.statusLogs = [];
  current.statusLogs.push({
    id: `${id}_sl_${Date.now()}`,
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

export async function getBookingByOrderId(orderId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: {
        booking: {
          include: {
            user: true,
            items: true,
            quotation: true,
            payment: true,
          },
        },
      },
    });

    if (payment?.booking) {
      return payment.booking;
    }
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - mencari orderId di local JSON.');
  }

  const local = readLocalBookings();
  const found = local.find(
    (b) => b.payment?.orderId === orderId || b.kodeBooking === orderId || b.id === orderId
  );
  return found || null;
}

export async function upsertPayment(payload: {
  bookingId: string;
  orderId: string;
  amount: number;
  status: string; // PENDING, SETTLEMENT, EXPIRE, CANCEL, DENY
  snapToken?: string;
  snapRedirectUrl?: string;
  paymentType?: string;
  transactionTime?: Date;
  settlementTime?: Date;
  rawResponse?: string;
}) {
  const now = new Date();
  const paymentStatusMap: Record<string, string> = {
    settlement: 'PAID',
    capture: 'PAID',
    pending: 'PENDING',
    deny: 'FAILED',
    expire: 'EXPIRED',
    cancel: 'CANCELLED',
  };

  const bookingPaymentStatus = paymentStatusMap[payload.status.toLowerCase()] || payload.status;

  try {
    // 1. Simpan atau update payment di Prisma
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId: payload.bookingId },
    });

    let payment;
    if (existingPayment) {
      payment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          orderId: payload.orderId,
          amount: payload.amount,
          status: payload.status,
          snapToken: payload.snapToken ?? existingPayment.snapToken,
          snapRedirectUrl: payload.snapRedirectUrl ?? existingPayment.snapRedirectUrl,
          paymentType: payload.paymentType ?? existingPayment.paymentType,
          transactionTime: payload.transactionTime ?? existingPayment.transactionTime,
          settlementTime: payload.settlementTime ?? existingPayment.settlementTime,
          rawResponse: payload.rawResponse ?? existingPayment.rawResponse,
        },
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          bookingId: payload.bookingId,
          orderId: payload.orderId,
          amount: payload.amount,
          status: payload.status,
          snapToken: payload.snapToken,
          snapRedirectUrl: payload.snapRedirectUrl,
          paymentType: payload.paymentType,
          transactionTime: payload.transactionTime,
          settlementTime: payload.settlementTime,
          rawResponse: payload.rawResponse,
        },
      });
    }

    // 2. Update status pembayaran di Booking
    const updateData: any = {
      paymentStatus: bookingPaymentStatus,
    };

    // Jika pembayaran sukses, update juga status log booking
    if (bookingPaymentStatus === 'PAID') {
      updateData.statusLogs = {
        create: {
          statusBaru: 'PAID',
          diubahOleh: 'MIDTRANS_GATEWAY',
          catatan: `Pembayaran sukses diverifikasi via Midtrans (${payload.paymentType || 'ONLINE'})`,
        },
      };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: payload.bookingId },
      data: updateData,
      include: {
        user: true,
        items: true,
        quotation: true,
        payment: true,
        statusLogs: { orderBy: { createdAt: 'desc' } },
      },
    });

    return { payment, booking: updatedBooking };
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - Upsert payment ke local JSON.');
    const local = readLocalBookings();
    const idx = local.findIndex((b) => b.id === payload.bookingId);
    if (idx !== -1) {
      const current = local[idx];
      current.paymentStatus = bookingPaymentStatus;
      current.payment = {
        id: current.payment?.id || `pay_${Date.now()}`,
        bookingId: payload.bookingId,
        orderId: payload.orderId,
        amount: payload.amount,
        status: payload.status,
        snapToken: payload.snapToken || current.payment?.snapToken,
        snapRedirectUrl: payload.snapRedirectUrl || current.payment?.snapRedirectUrl,
        paymentType: payload.paymentType || current.payment?.paymentType,
        transactionTime: payload.transactionTime?.toISOString() || current.payment?.transactionTime,
        settlementTime: payload.settlementTime?.toISOString() || current.payment?.settlementTime,
        createdAt: current.payment?.createdAt || now.toISOString(),
        updatedAt: now.toISOString(),
      };

      if (bookingPaymentStatus === 'PAID') {
        if (!current.statusLogs) current.statusLogs = [];
        current.statusLogs.push({
          id: `sl_${Date.now()}`,
          bookingId: current.id,
          statusLama: current.status,
          statusBaru: 'PAID',
          diubahOleh: 'MIDTRANS_GATEWAY',
          catatan: `Pembayaran sukses diverifikasi via Midtrans (${payload.paymentType || 'ONLINE'})`,
          createdAt: now.toISOString(),
        });
      }

      local[idx] = current;
      writeLocalBookings(local);
      return { payment: current.payment, booking: current };
    }

    return null;
  }
}

