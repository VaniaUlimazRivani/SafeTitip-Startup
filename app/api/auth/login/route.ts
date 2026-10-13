import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, accountType } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Jika secara spesifik meminta login ADMIN
    if (accountType === 'ADMIN') {
      const admin = await prisma.adminUser.findUnique({
        where: { email: normalizedEmail },
      });

      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { error: 'Email atau password akun petugas/admin salah.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        message: 'Login petugas berhasil!',
        accountType: 'ADMIN',
        user: {
          id: admin.id,
          nama: admin.nama,
          email: admin.email,
          role: admin.role,
          noWa: admin.noWa,
        },
      });
    }

    // 2. Cek apakah ada di tabel User (Mahasiswa)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user && user.password === password) {
      return NextResponse.json({
        message: 'Login mahasiswa berhasil!',
        accountType: 'USER',
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          noWa: user.noWa,
          role: 'USER',
        },
      });
    }

    // 3. Fallback: Cek apakah akun ini adalah Admin / Petugas (jika login dari halaman umum)
    const adminFallback = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (adminFallback && adminFallback.password === password) {
      return NextResponse.json({
        message: 'Login petugas berhasil!',
        accountType: 'ADMIN',
        user: {
          id: adminFallback.id,
          nama: adminFallback.nama,
          email: adminFallback.email,
          role: adminFallback.role,
          noWa: adminFallback.noWa,
        },
      });
    }

    return NextResponse.json(
      { error: 'Email atau kata sandi yang Anda masukkan salah.' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error saat login:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server saat login' },
      { status: 500 }
    );
  }
}
