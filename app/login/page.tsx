'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();

  // Mode Akun: 'USER' (Mahasiswa yang booking) vs 'ADMIN' (Petugas/Admin)
  const [accountType, setAccountType] = useState<'USER' | 'ADMIN'>('USER');

  // Sub-mode untuk Mahasiswa: 'LOGIN' vs 'REGISTER'
  const [userAuthMode, setUserAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form State Pengguna (Mahasiswa)
  const [userForm, setUserForm] = useState({
    nama: 'Budi Santoso',
    email: 'budi@student.unand.ac.id',
    noWa: '081234567890',
    kampus: 'limau_manis',
    password: 'password123',
  });

  // Form State Admin/Petugas
  const [adminRole, setAdminRole] = useState<'ADMIN' | 'GUDANG' | 'KURIR'>('ADMIN');
  const [adminEmail, setAdminEmail] = useState('admin@safetitip.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Quick Demo Helper untuk Mahasiswa
  const handleUserDemoFill = (preset: 'unand' | 'unp' | 'upi') => {
    if (preset === 'unand') {
      setUserForm({
        nama: 'Budi Santoso (UNAND)',
        email: 'budi@student.unand.ac.id',
        noWa: '081234567890',
        kampus: 'limau_manis',
        password: 'password123',
      });
    } else if (preset === 'unp') {
      setUserForm({
        nama: 'Rina Permata (UNP)',
        email: 'rina@student.unp.ac.id',
        noWa: '081298765432',
        kampus: 'air_tawar',
        password: 'password123',
      });
    } else {
      setUserForm({
        nama: 'Fajar Pratama (UPI YPTK)',
        email: 'fajar@student.upiyptk.ac.id',
        noWa: '082165432109',
        kampus: 'lubuk_begalung',
        password: 'password123',
      });
    }
    setError('');
  };

  // Quick Demo Helper untuk Admin
  const handleAdminDemoFill = (selectedRole: 'ADMIN' | 'GUDANG' | 'KURIR') => {
    setAdminRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setAdminEmail('admin@safetitip.com');
      setAdminPassword('admin123');
    } else if (selectedRole === 'GUDANG') {
      setAdminEmail('gudang@safetitip.com');
      setAdminPassword('gudang123');
    } else {
      setAdminEmail('kurir@safetitip.com');
      setAdminPassword('kurir123');
    }
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      if (accountType === 'USER') {
        // Simpan Sesi Pengguna / Mahasiswa
        const userSession = {
          role: 'USER',
          nama: userForm.nama,
          email: userForm.email,
          noWa: userForm.noWa,
          kampus: userForm.kampus,
          loginAt: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('safetitip_user_session', JSON.stringify(userSession));
        }

        // Langsung arahkan ke halaman booking
        setTimeout(() => {
          router.push('/booking');
        }, 700);
      } else {
        // Simpan Sesi Admin / Petugas
        const adminSession = {
          role: adminRole,
          email: adminEmail,
          nama:
            adminRole === 'ADMIN'
              ? 'Vania (Super Admin)'
              : adminRole === 'GUDANG'
              ? 'Bambang (Petugas Gudang)'
              : 'Rahmat (Kurir Penjemputan)',
          loginAt: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('safetitip_admin_session', JSON.stringify(adminSession));
        }

        // Langsung arahkan ke halaman admin
        setTimeout(() => {
          router.push('/admin');
        }, 700);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex items-center justify-center flex-1">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* ========================================================================= */}
          {/* SISI KIRI: GAMBAR VISUAL SESUAI PERAN YANG DIPILIH                        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-8 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-blue-100 text-xs font-extrabold border border-white/20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {accountType === 'USER' ? 'Area Mahasiswa Kos' : 'Portal Operasional & Staf'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                {accountType === 'USER' ? (
                  <>
                    Akun Pengguna <br />
                    <span className="text-sky-300">Penitipan Kamar Kos</span>
                  </>
                ) : (
                  <>
                    Sistem Internal <br />
                    <span className="text-amber-300">SafeTitip Admin</span>
                  </>
                )}
              </h2>

              <p className="text-xs text-blue-100/90 leading-relaxed">
                {accountType === 'USER'
                  ? 'Daftar dan masuk sebagai pengguna untuk booking penjemputan barang, cek estimasi tarif otomatis, dan pantau status barang Anda.'
                  : 'Kelola pemesanan masuk, update laporan kondisi foto 360°, dan kelola inventaris gudang Kota Padang.'}
              </p>
            </div>

            {/* Gambar Pendukung Beresolusi Tinggi */}
            <div className="relative z-10 my-6 rounded-2xl overflow-hidden border border-white/20 shadow-lg group">
              <img
                src={accountType === 'USER' ? '/images/hero.jpg' : '/images/warehouse.jpg'}
                alt="SafeTitip Akses"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {accountType === 'USER' ? 'Mudik Aman Tanpa Cemas' : 'CCTV & Gudang Aktif'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                  Padang Area
                </span>
              </div>
            </div>

            <div className="relative z-10 text-[11px] text-blue-200 flex items-center justify-between pt-2 border-t border-white/15">
              <span>{accountType === 'USER' ? 'Layanan Mahasiswa' : 'Akses Khusus Staf'}</span>
              <span className="font-bold text-white">SafeTitip v0.1</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SISI KANAN: FORMULIR DUA MODE (PENGGUNA MAHASISWA VS PETUGAS ADMIN)       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-7 sm:p-10 space-y-6">
            
            {/* 1. TAB UTAMA: PENGGUNA (MAHASISWA) VS ADMIN/PETUGAS */}
            <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200/90 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setAccountType('USER');
                  setError('');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  accountType === 'USER'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">school</span>
                <span>Pengguna / Mahasiswa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType('ADMIN');
                  setError('');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  accountType === 'ADMIN'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">shield_person</span>
                <span>Petugas & Admin</span>
              </button>
            </div>

            {/* Error / Success Feedback */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>
                  {accountType === 'USER'
                    ? 'Berhasil Masuk! Mengalihkan ke Halaman Booking...'
                    : 'Login Berhasil! Mengalihkan ke Dashboard Admin...'}
                </span>
              </div>
            )}

            {/* ===================================================================== */}
            {/* KONTEN JIKA MODE: PENGGUNA / MAHASISWA                                */}
            {/* ===================================================================== */}
            {accountType === 'USER' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{userAuthMode === 'LOGIN' ? 'Masuk Mahasiswa' : 'Daftar Akun Mahasiswa'}</span>
                      <span className="material-symbols-outlined text-blue-600 text-[24px]">account_circle</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {userAuthMode === 'LOGIN'
                        ? 'Masuk dengan akun terdaftar untuk melakukan booking.'
                        : 'Lengkapi data mahasiswa Anda untuk mulai booking penjemputan.'}
                    </p>
                  </div>

                  {/* Switcher Masuk vs Daftar */}
                  <div className="flex items-center gap-1 bg-blue-50/70 p-1 rounded-xl border border-blue-200">
                    <button
                      type="button"
                      onClick={() => setUserAuthMode('LOGIN')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                        userAuthMode === 'LOGIN'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-blue-700'
                      }`}
                    >
                      Masuk
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserAuthMode('REGISTER')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                        userAuthMode === 'REGISTER'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-blue-700'
                      }`}
                    >
                      Daftar
                    </button>
                  </div>
                </div>

                {/* Tombol Demo Cepat Mahasiswa (1-Klik untuk Dosen / Reviewer) */}
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-600 text-[16px]">touch_app</span>
                      Pilihan Akun Demo Mahasiswa (1-Klik):
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Auto-Fill
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleUserDemoFill('unand')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-700 text-xs font-extrabold border border-blue-200 transition-colors shadow-2xs"
                    >
                      🎓 Budi (UNAND)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUserDemoFill('unp')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-700 text-xs font-extrabold border border-blue-200 transition-colors shadow-2xs"
                    >
                      🎓 Rina (UNP)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUserDemoFill('upi')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-700 text-xs font-extrabold border border-blue-200 transition-colors shadow-2xs"
                    >
                      🎓 Fajar (UPI YPTK)
                    </button>
                  </div>
                </div>

                {/* Form Mahasiswa */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {userAuthMode === 'REGISTER' && (
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                        Nama Lengkap Mahasiswa
                      </label>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                          <span className="material-symbols-outlined text-[20px]">badge</span>
                        </div>
                        <input
                          type="text"
                          value={userForm.nama}
                          onChange={(e) => setUserForm({ ...userForm, nama: e.target.value })}
                          placeholder="Masukkan nama lengkap Anda"
                          required
                          className="w-full pl-11 pr-4 py-2.5 bg-blue-50/20 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                        Email Kampus / Pribadi
                      </label>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </div>
                        <input
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="nama@student.ac.id"
                          required
                          className="w-full pl-11 pr-4 py-2.5 bg-blue-50/20 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                        Nomor WhatsApp
                      </label>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                          <span className="material-symbols-outlined text-[20px]">call</span>
                        </div>
                        <input
                          type="tel"
                          value={userForm.noWa}
                          onChange={(e) => setUserForm({ ...userForm, noWa: e.target.value })}
                          placeholder="0812xxxxxxxx"
                          required
                          className="w-full pl-11 pr-4 py-2.5 bg-blue-50/20 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {userAuthMode === 'REGISTER' && (
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                        Asal Kampus di Kota Padang
                      </label>
                      <select
                        value={userForm.kampus}
                        onChange={(e) => setUserForm({ ...userForm, kampus: e.target.value })}
                        className="w-full px-4 py-2.5 bg-blue-50/20 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden"
                      >
                        <option value="limau_manis">Limau Manis (UNAND / PNP)</option>
                        <option value="air_tawar">Air Tawar (UNP)</option>
                        <option value="lubuk_begalung">Lubuk Begalung (UPI YPTK)</option>
                        <option value="ulak_karang">Ulak Karang (UBH)</option>
                        <option value="kuranji">Kuranji / Gn Pangilun (UIN Imam Bonjol)</option>
                        <option value="lainnya">Wilayah / Kampus Lainnya di Padang</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Kata Sandi
                    </label>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </div>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-4 py-2.5 bg-blue-50/20 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                    className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white disabled:opacity-70 mt-3"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Memproses Akun...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px] text-white">login</span>
                        <span>{userAuthMode === 'LOGIN' ? 'Masuk & Lanjut ke Form Booking' : 'Daftar & Mulai Booking'}</span>
                        <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ===================================================================== */}
            {/* KONTEN JIKA MODE: PETUGAS & ADMIN                                     */}
            {/* ===================================================================== */}
            {accountType === 'ADMIN' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Portal Petugas & Admin</span>
                    <span className="material-symbols-outlined text-slate-900 text-[24px]">shield</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Akses kontrol internal SafeTitip untuk Super Admin, Petugas Gudang, dan Kurir.
                  </p>
                </div>

                {/* Role Switcher Admin */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Pilih Peran Petugas:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdminDemoFill('ADMIN')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        adminRole === 'ADMIN'
                          ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-xs ring-2 ring-blue-500/20 font-extrabold'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600 font-bold'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-blue-600">shield_person</span>
                      <span className="text-xs">Super Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdminDemoFill('GUDANG')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        adminRole === 'GUDANG'
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs ring-2 ring-indigo-500/20 font-extrabold'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600 font-bold'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-indigo-600">warehouse</span>
                      <span className="text-xs">Staf Gudang</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdminDemoFill('KURIR')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        adminRole === 'KURIR'
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-700 shadow-xs ring-2 ring-emerald-500/20 font-extrabold'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600 font-bold'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-emerald-600">local_shipping</span>
                      <span className="text-xs">Kurir Jemput</span>
                    </button>
                  </div>
                </div>

                {/* Form Admin */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Email Petugas / Admin
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@safetitip.com"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                      Kata Sandi
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                    className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm shadow-lg shadow-slate-900/25 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white disabled:opacity-70 mt-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Memverifikasi Akses...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px] text-white">login</span>
                        <span>Masuk ke Dashboard Admin</span>
                        <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Back link */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Kembali ke Beranda</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
