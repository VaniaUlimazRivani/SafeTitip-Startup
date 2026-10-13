import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, email, noWa, password, alamat } = body;

    // Validasi input dasar
    if (!nama || typeof nama !== 'string' || !nama.trim()) {
      return NextResponse.json({ error: 'Nama lengkap wajib diisi' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    if (!noWa || typeof noWa !== 'string' || noWa.trim().length < 8) {
      return NextResponse.json({ error: 'Nomor WhatsApp wajib diisi (minimal 8 digit)' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.' },
        { status: 409 }
      );
    }

    // Buat user mahasiswa baru di MongoDB Atlas
    const newUser = await prisma.user.create({
      data: {
        nama: nama.trim(),
        email: normalizedEmail,
        noWa: noWa.trim(),
        password: password,
        alamat: alamat ? alamat.trim() : null,
      },
    });

    return NextResponse.json(
      {
        message: 'Registrasi akun berhasil!',
        user: {
          id: newUser.id,
          nama: newUser.nama,
          email: newUser.email,
          noWa: newUser.noWa,
          role: 'USER',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saat registrasi user:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server saat mendaftar' },
      { status: 500 }
    );
  }
}
