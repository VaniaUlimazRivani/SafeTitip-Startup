'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  // State Form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'GUDANG' | 'KURIR'>('ADMIN');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Submit Login Admin ke MongoDB Atlas
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setError('Harap masukkan Username/Email dan Kata Sandi admin.');
      return;
    }

    setLoading(true);

    try {
      const email = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@safetitip.com`;
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: cleanPassword,
          accountType: 'ADMIN',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Kredensial admin salah.');
      }

      const adminSession = {
        id: data.user?.id,
        nama: data.user?.nama,
        role: data.user?.role || selectedRole,
        email: data.user?.email,
        loginAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('safetitip_admin_session', JSON.stringify(adminSession));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickPreset = (role: 'ADMIN' | 'GUDANG' | 'KURIR') => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setIdentifier('admin@safetitip.com');
      setPassword('admin123');
    } else if (role === 'GUDANG') {
      setIdentifier('gudang@safetitip.com');
      setPassword('gudang123');
    } else {
      setIdentifier('kurir@safetitip.com');
      setPassword('kurir123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B14] flex flex-col justify-between selection:bg-[#B86B35] selection:text-white font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER ATAS MINIMALIS                                                  */}
      {/* ========================================================================= */}
      <header className="border-b border-[#E8DDD3] bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] flex items-center justify-center text-white shadow-md shadow-[#B86B35]/25 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#2A1B14] leading-none group-hover:text-[#B86B35] transition-colors">
                Kos<span className="text-[#B86B35]">inaja</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#7E3F18] mt-1">
                Portal Petugas & Admin
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#705E54] hover:text-[#B86B35] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT                                                            */}
      {/* ========================================================================= */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* ======================================================================= */}
          {/* SISI KIRI: PANEL INFORMASI OPERASIONAL (BACKGROUND KRAFT BOX)           */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 bg-[#F6ECE1] border border-[#E8DDD3] rounded-[32px] p-7 sm:p-9 flex flex-col justify-between shadow-xs">
            <div>
              {/* Badge Pill Top */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#7E3F18] text-[11px] font-extrabold shadow-2xs border border-[#E8DDD3]">
                <span className="w-2 h-2 rounded-full bg-[#B86B35] animate-pulse"></span>
                <span>INTERNAL MANAGEMENT PORTAL</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#2A1B14] tracking-tight leading-tight mt-6">
                Kelola Titipan Aman,<br />
                <span className="text-[#B86B35]">Cepat & Terpadu.</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#705E54] leading-relaxed mt-3 font-normal">
                Sistem kendali operasional Kosinaja untuk monitoring barang titipan mahasiswa, alokasi rak gudang, dan koordinasi armada penjemputan di Padang.
              </p>

              {/* 3 Kartu Keunggulan Operasional */}
              <div className="space-y-3.5 mt-7">
                {/* 1. Manajemen Booking Terpusat */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DDD3] flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#B86B35] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">checklist</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#2A1B14]">
                      Verifikasi Booking Cepat
                    </h3>
                    <p className="text-[11px] text-[#705E54] leading-relaxed mt-0.5">
                      Tinjau rincian barang, estimasi biaya, dan jadwal penjemputan mahasiswa secara langsung.
                    </p>
                  </div>
                </div>

                {/* 2. Standar Keamanan & Gudang */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DDD3] flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#E69526] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">warehouse</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#2A1B14]">
                      Alokasi Rak & Segel Gudang
                    </h3>
                    <p className="text-[11px] text-[#705E54] leading-relaxed mt-0.5">
                      Catat nomor rak penyimpanan dan pembaruan berkala kondisi barang selama liburan.
                    </p>
                  </div>
                </div>

                {/* 3. Koordinasi Penjemputan Kurir */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E8DDD3] flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#7E3F18] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#2A1B14]">
                      Status Logistik Real-Time
                    </h3>
                    <p className="text-[11px] text-[#705E54] leading-relaxed mt-0.5">
                      Ubah status pesanan dari Menunggu, Disimpan di Gudang, hingga Selesai dengan 1-klik.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Badge Info */}
            <div className="mt-7 w-full py-3.5 px-4 rounded-2xl bg-[#B86B35] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-[#B86B35]/25">
              <span className="material-symbols-outlined text-[20px] text-white">admin_panel_settings</span>
              <span>Akses Khusus Tim Operasional Kosinaja</span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SISI KANAN: FORM MASUK ADMIN                                            */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 bg-white border border-[#E8DDD3] rounded-[32px] p-7 sm:p-10 shadow-xl shadow-stone-200/40 flex flex-col justify-between">
            <div>
              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Akses Terverifikasi! Mengalihkan ke Dashboard Admin...</span>
                </div>
              )}

              {/* Logo Di Atas Form */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] flex items-center justify-center text-white shadow-md shadow-[#B86B35]/25">
                  <span className="material-symbols-outlined text-[22px]">shield_person</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-[#2A1B14] leading-none">
                    Kos<span className="text-[#B86B35]">inaja</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#7E3F18] mt-1">
                    Internal Dashboard
                  </span>
                </div>
              </div>

              {/* Judul & Deskripsi Header Form */}
              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B14] tracking-tight">
                  Portal Masuk Admin
                </h1>
                <p className="text-xs sm:text-sm text-[#705E54] mt-1.5 leading-relaxed">
                  Masukkan kredensial resmi untuk mengelola operasional penitipan Kosinaja.
                </p>
              </div>

              {/* Role Switcher */}
              <div className="mt-6 space-y-1.5">
                <label className="block text-xs font-extrabold text-[#2A1B14]">
                  Pilih Peran Petugas:
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => fillQuickPreset('ADMIN')}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedRole === 'ADMIN'
                        ? 'border-[#B86B35] bg-[#F6ECE1] text-[#7E3F18] font-extrabold shadow-2xs ring-2 ring-[#B86B35]/20'
                        : 'border-[#E8DDD3] bg-white text-[#705E54] hover:bg-[#FAF6F0] font-semibold text-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    <span className="text-xs">Super Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickPreset('GUDANG')}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedRole === 'GUDANG'
                        ? 'border-[#B86B35] bg-[#F6ECE1] text-[#7E3F18] font-extrabold shadow-2xs ring-2 ring-[#B86B35]/20'
                        : 'border-[#E8DDD3] bg-white text-[#705E54] hover:bg-[#FAF6F0] font-semibold text-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">warehouse</span>
                    <span className="text-xs">Staf Gudang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickPreset('KURIR')}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedRole === 'KURIR'
                        ? 'border-[#B86B35] bg-[#F6ECE1] text-[#7E3F18] font-extrabold shadow-2xs ring-2 ring-[#B86B35]/20'
                        : 'border-[#E8DDD3] bg-white text-[#705E54] hover:bg-[#FAF6F0] font-semibold text-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    <span className="text-xs">Kurir Jemput</span>
                  </button>
                </div>
              </div>

              {/* Form Masuk Petugas */}
              <form onSubmit={handleAdminLogin} className="mt-5 space-y-4">
                {/* Field: Alamat Email / Username */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2A1B14] mb-1.5">
                    Email atau Username Petugas
                  </label>
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8DDD3] hover:border-[#B86B35]/40 focus-within:border-[#B86B35] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B86B35]/15 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#705E54]">
                      <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@safetitip.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-semibold text-[#2A1B14] placeholder:text-stone-400 outline-hidden"
                    />
                  </div>
                </div>

                {/* Field: Kata Sandi + Toggle Mata */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2A1B14] mb-1.5">
                    Kata Sandi Petugas
                  </label>
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8DDD3] hover:border-[#B86B35]/40 focus-within:border-[#B86B35] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B86B35]/15 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#705E54]">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-11 py-3 bg-transparent text-sm font-semibold text-[#2A1B14] placeholder:text-stone-400 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle Password Visibility"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#705E54] hover:text-[#B86B35] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Row: Ingat Saya & Lupa Kata Sandi */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[#705E54] font-semibold hover:text-[#2A1B14]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B86B35] border-[#E8DDD3] focus:ring-[#B86B35] cursor-pointer"
                    />
                    <span>Ingat Saya</span>
                  </label>
                  <span className="text-[#705E54]">
                    Akses Khusus Terdaftar
                  </span>
                </div>

                {/* Tombol Utama: Masuk Dashboard */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#B86B35] hover:bg-[#9B5424] active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-[#B86B35]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Memverifikasi Akses Internal...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">login</span>
                      <span>Masuk ke Dashboard Admin</span>
                    </>
                  )}
                </button>
              </form>

              {/* Preset Info Hint */}
              <div className="mt-5 p-3 rounded-2xl bg-[#F6ECE1] border border-[#E8DDD3] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-[#B86B35] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                </div>
                <div className="text-[11px] text-[#705E54] leading-snug">
                  <span className="font-extrabold text-[#2A1B14] block">Kredensial Pengujian Otomatis</span>
                  <span>Email: <strong className="text-[#2A1B14]">admin@safetitip.com</strong> • Sandi: <strong className="text-[#2A1B14]">admin123</strong></span>
                </div>
              </div>

            </div>

            {/* Bottom Trust Badge */}
            <div className="mt-6 pt-4 border-t border-[#E8DDD3] text-center text-xs text-[#705E54] flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>Koneksi Aman & Terotentikasi ke Database Kosinaja</span>
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER MINIMALIS                                                       */}
      {/* ========================================================================= */}
      <footer className="py-4 text-center text-xs text-[#705E54] border-t border-[#E8DDD3] bg-white">
        <p>© 2026 Kosinaja Padang (kosinaja.id) • Portal Operasional & Admin Internal.</p>
      </footer>
    </div>
  );
}
