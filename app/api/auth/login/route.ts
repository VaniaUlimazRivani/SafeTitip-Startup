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

    // Mode 1: Login Admin / Petugas (jika accountType === 'ADMIN')
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

    // Mode 2: Login Mahasiswa (User)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Email atau password akun mahasiswa salah.' },
        { status: 401 }
      );
    }

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
  } catch (error: any) {
    console.error('Error saat login:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server saat login' },
      { status: 500 }
    );
  }
}
