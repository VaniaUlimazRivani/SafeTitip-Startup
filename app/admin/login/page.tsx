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
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER ATAS MINIMALIS                                                  */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                Safe<span className="text-blue-600">Titip</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600 mt-1">
                Portal Petugas & Admin
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT: DUA KARTU SEPERTI HALAMAN LOGIN PENGGUNA                  */}
      {/* ========================================================================= */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* ======================================================================= */}
          {/* SISI KIRI: PANEL INFORMASI OPERASIONAL (HANYA DITAMPILKAN DI DESKTOP)   */}
          {/* ======================================================================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#edf2fe] border border-blue-100/80 rounded-[32px] p-7 sm:p-9 flex-col justify-between shadow-xs">
            <div>
              {/* Badge Pill Top */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-indigo-700 text-[11px] font-extrabold shadow-2xs border border-indigo-100">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>INTERNAL MANAGEMENT PORTAL</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight mt-6">
                Kelola Titipan Aman,<br />
                <span className="text-indigo-600">Cepat & Terpadu.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 font-normal">
                Sistem kendali operasional SafeTitip untuk monitoring barang titipan, alokasi rak penyimpanan, dan koordinasi armada penjemputan.
              </p>

              {/* 3 Kartu Keunggulan Operasional (Murni Desain UI Tanpa Gambar Apapun) */}
              <div className="space-y-3.5 mt-7">
                {/* 1. Manajemen Booking Terpusat */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-blue-50/80 flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">checklist</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Verifikasi Booking Cepat
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Tinjau rincian barang, estimasi biaya, dan jadwal penjemputan mahasiswa secara langsung.
                    </p>
                  </div>
                </div>

                {/* 2. Standar Keamanan & Gudang */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-blue-50/80 flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">warehouse</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Alokasi Rak & Segel Gudang
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Catat nomor rak penyimpanan dan pembaruan berkala kondisi barang selama liburan.
                    </p>
                  </div>
                </div>

                {/* 3. Koordinasi Penjemputan Kurir */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-blue-50/80 flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Status Logistik Real-Time
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Ubah status pesanan dari Menunggu, Disimpan di Gudang, hingga Selesai dengan 1-klik.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Badge Info */}
            <div className="mt-7 w-full py-3.5 px-4 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/25">
              <span className="material-symbols-outlined text-[20px] text-white">admin_panel_settings</span>
              <span>Akses Khusus Tim Operasional SafeTitip</span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SISI KANAN: FORM MASUK ADMIN (PERSIS DENGAN KARTU LOGIN PENGGUNA)       */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-[32px] p-7 sm:p-10 shadow-xl shadow-slate-200/40 flex flex-col justify-between">
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
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                  <span className="material-symbols-outlined text-[22px]">shield_person</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                    Safe<span className="text-blue-600">Titip</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600 mt-1">
                    Internal Dashboard
                  </span>
                </div>
              </div>

              {/* Judul & Deskripsi Header Form */}
              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Portal Masuk Admin
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Masukkan kredensial resmi untuk mengelola operasional penitipan SafeTitip.
                </p>
              </div>

              {/* Role Switcher */}
              <div className="mt-6 space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">
                  Pilih Peran Petugas:
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => fillQuickPreset('ADMIN')}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedRole === 'ADMIN'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-extrabold shadow-2xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-[#f8faff] text-slate-600 hover:bg-slate-100 font-semibold text-xs'
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
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-extrabold shadow-2xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-[#f8faff] text-slate-600 hover:bg-slate-100 font-semibold text-xs'
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
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-extrabold shadow-2xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-[#f8faff] text-slate-600 hover:bg-slate-100 font-semibold text-xs'
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
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Email atau Username Petugas
                  </label>
                  <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                      <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@safetitip.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                    />
                  </div>
                </div>

                {/* Field: Kata Sandi + Toggle Mata */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Kata Sandi Petugas
                  </label>
                  <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-11 py-3 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle Password Visibility"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Row: Ingat Saya & Lupa Kata Sandi */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-semibold hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Ingat Saya</span>
                  </label>
                  <span className="text-slate-500">
                    Akses Khusus Terdaftar
                  </span>
                </div>

                {/* Tombol Utama: Masuk Dashboard */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
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
              <div className="mt-5 p-3 rounded-2xl bg-[#edf2fe] border border-blue-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-snug">
                  <span className="font-extrabold text-slate-900 block">Kredensial Pengujian Otomatis</span>
                  <span>Email: <strong className="text-slate-800">admin@safetitip.com</strong> • Sandi: <strong className="text-slate-800">admin123</strong></span>
                </div>
              </div>

            </div>

            {/* Bottom Trust Badge */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>Koneksi Aman & Terotentikasi ke Database SafeTitip</span>
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER MINIMALIS                                                       */}
      {/* ========================================================================= */}
      <footer className="py-4 text-center text-xs text-slate-600 border-t border-slate-200/60 bg-white">
        <p>© 2026 SafeTitip Padang • Portal Operasional & Admin Internal.</p>
      </footer>
    </div>
  );
}
