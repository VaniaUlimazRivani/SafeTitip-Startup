import fs from 'fs';
import path from 'path';
import { prisma } from '../db';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalUsers(): any[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca data lokal users JSON:', e);
    return [];
  }
}

function writeLocalUsers(users: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Gagal menulis data lokal users JSON:', e);
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        email: true,
        noWa: true,
        alamat: true,
        createdAt: true,
      },
    });

    if (user) {
      // Hitung ringkasan aktivitas penitipan untuk mobile profile
      const totalBookings = await prisma.booking.count({ where: { userId } });
      const activeBookings = await prisma.booking.count({
        where: {
          userId,
          status: { in: ['LEAD', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_STORAGE'] },
        },
      });
      const completedBookings = await prisma.booking.count({
        where: {
          userId,
          status: { in: ['DELIVERED', 'COMPLETED'] },
        },
      });

      return {
        user,
        stats: {
          totalBookings,
          activeBookings,
          completedBookings,
        },
      };
    }
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - Membaca profile dari local JSON.');
  }

  // Fallback lokal jika MongoDB offline
  const localUsers = readLocalUsers();
  const localUser = localUsers.find((u) => u.id === userId);

  if (!localUser) return null;

  const { password, ...safeUser } = localUser;
  return {
    user: safeUser,
    stats: {
      totalBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
    },
  };
}

export async function updateUserProfile(
  userId: string,
  data: {
    nama?: string;
    noWa?: string;
    alamat?: string;
    currentPassword?: string;
    newPassword?: string;
  }
) {
  try {
    // Jika ingin update password, verifikasi password lama terlebih dahulu
    if (data.newPassword) {
      const existing = await prisma.user.findUnique({ where: { id: userId } });
      if (!existing) {
        throw new Error('User tidak ditemukan');
      }
      if (existing.password && existing.password !== data.currentPassword) {
        throw new Error('Kata sandi lama salah');
      }
    }

    const updatePayload: any = {};
    if (data.nama) updatePayload.nama = data.nama.trim();
    if (data.noWa) updatePayload.noWa = data.noWa.trim();
    if (data.alamat !== undefined) updatePayload.alamat = data.alamat?.trim() || null;
    if (data.newPassword) updatePayload.password = data.newPassword;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
      select: {
        id: true,
        nama: true,
        email: true,
        noWa: true,
        alamat: true,
        createdAt: true,
      },
    });

    return updated;
  } catch (dbErr: any) {
    console.warn('[Storage] DB Offline - Update profile di local JSON.', dbErr.message);
    if (dbErr.message === 'Kata sandi lama salah' || dbErr.message === 'User tidak ditemukan') {
      throw dbErr;
    }

    const localUsers = readLocalUsers();
    const idx = localUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User tidak ditemukan di database lokal');

    const currentUser = localUsers[idx];
    if (data.newPassword) {
      if (currentUser.password && currentUser.password !== data.currentPassword) {
        throw new Error('Kata sandi lama salah');
      }
      currentUser.password = data.newPassword;
    }

    if (data.nama) currentUser.nama = data.nama.trim();
    if (data.noWa) currentUser.noWa = data.noWa.trim();
    if (data.alamat !== undefined) currentUser.alamat = data.alamat?.trim() || null;

    localUsers[idx] = currentUser;
    writeLocalUsers(localUsers);

    const { password, ...safeUser } = currentUser;
    return safeUser;
  }
}
