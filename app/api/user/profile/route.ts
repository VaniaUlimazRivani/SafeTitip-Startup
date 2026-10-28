import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/lib/repository/userRepo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Parameter userId atau header x-user-id diperlukan.' },
        { status: 400 }
      );
    }

    const profileData = await getUserProfile(userId);

    if (!profileData) {
      return NextResponse.json(
        { success: false, error: 'Pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diambil',
      ...profileData,
    });
  } catch (error: any) {
    console.error('Error saat mengambil profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId diperlukan untuk memperbarui profil.' },
        { status: 400 }
      );
    }

    const { nama, noWa, alamat, currentPassword, newPassword } = body;

    if (newPassword && (!currentPassword || newPassword.length < 6)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Untuk mengubah kata sandi, masukkan kata sandi lama dan kata sandi baru (min 6 karakter).',
        },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserProfile(userId, {
      nama,
      noWa,
      alamat,
      currentPassword,
      newPassword,
    });

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error saat update profile:', error);
    const status = error.message.includes('salah') ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui profil' },
      { status }
    );
  }
}
