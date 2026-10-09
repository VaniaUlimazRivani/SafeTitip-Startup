'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();

  // Mode Antarmuka: 'LOGIN' (Masuk) atau 'REGISTER' (Daftar)
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // State Input Mode Masuk (Login) - Kosong tanpa data demo
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // State Input Mode Daftar (Register) - Kosong tanpa data demo
  const [registerForm, setRegisterForm] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  // State Toggle Ikon Mata untuk Kata Sandi
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState<'ID' | 'EN'>('ID');

  // Kalkulasi Kekuatan Kata Sandi Dinamis
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '-', textColor: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 1) return { score: 1, label: 'Lemah', textColor: 'text-rose-500' };
    if (score === 2) return { score: 2, label: 'Sedang', textColor: 'text-amber-500' };
    if (score >= 3) return { score: 3, label: 'Kuat', textColor: 'text-emerald-500' };
    return { score: 1, label: 'Lemah', textColor: 'text-rose-500' };
  };

  const strength = getPasswordStrength(registerForm.password);

  // Autentikasi Nyata Melalui Firebase Google Sign-In
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userSession = {
        role: 'USER',
        nama: user.displayName || 'Pengguna Google',
        email: user.email || '',
        photoURL: user.photoURL || '',
        noWa: user.phoneNumber || '',
        alamat: 'Kota Padang, Sumatera Barat',
        loginAt: new Date().toISOString(),
        authProvider: 'google',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('safetitip_user_session', JSON.stringify(userSession));

        // Simpan juga ke daftar akun terdaftar lokal agar sinkron
        const saved = localStorage.getItem('safetitip_registered_accounts');
        const existingAccounts = saved ? JSON.parse(saved) : [];
        if (!existingAccounts.some((acc: any) => acc.email?.toLowerCase() === user.email?.toLowerCase())) {
          existingAccounts.push({
            nama: userSession.nama,
            email: userSession.email,
            authProvider: 'google',
            registeredAt: new Date().toISOString(),
          });
          localStorage.setItem('safetitip_registered_accounts', JSON.stringify(existingAccounts));
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/booking');
      }, 700);
    } catch (err: any) {
      console.error('Firebase Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Proses masuk dengan Google dibatalkan.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Permintaan login dibatalkan.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Koneksi internet bermasalah. Periksa jaringan Anda.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domain localhost belum diizinkan di Firebase Console > Authentication > Settings > Authorized domains.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Metode login Google belum diaktifkan di Firebase Console > Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Submit Login Manual
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedIdentifier = loginIdentifier.trim().toLowerCase();
    const enteredPassword = loginPassword.trim();

    if (!trimmedIdentifier || !enteredPassword) {
      setError('Harap masukkan Alamat Email dan Kata Sandi Anda.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      let existingAccounts: any[] = [];
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('safetitip_registered_accounts');
        if (saved) {
          try {
            existingAccounts = JSON.parse(saved);
          } catch (err) {
            existingAccounts = [];
          }
        }
      }

      const foundAccount = existingAccounts.find(
        (acc: any) =>
          acc.email?.toLowerCase() === trimmedIdentifier ||
          acc.nama?.toLowerCase() === trimmedIdentifier
      );

      if (!foundAccount) {
        setError(
          'Akun belum terdaftar. Silakan lakukan pendaftaran pada menu Buat Akun Baru terlebih dahulu.'
        );
        return;
      }

      if (foundAccount.password !== enteredPassword) {
        setError('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
        return;
      }

      setSuccess(true);
      const userSession = {
        role: 'USER',
        nama: foundAccount.nama,
        email: foundAccount.email,
        noWa: foundAccount.noWa || '',
        alamat: foundAccount.alamat || 'Kota Padang, Sumatera Barat',
        loginAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('safetitip_user_session', JSON.stringify(userSession));
      }

      setTimeout(() => {
        router.push('/booking');
      }, 700);
    }, 500);
  };

  // Submit Daftar Akun Baru
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedNama = registerForm.nama.trim();
    const trimmedEmail = registerForm.email.trim().toLowerCase();
    const password = registerForm.password;
    const confirmPassword = registerForm.confirmPassword;

    if (!trimmedNama || !trimmedEmail || !password || !confirmPassword) {
      setError('Semua kolom pendaftaran wajib diisi.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Format alamat email tidak valid.');
      return;
    }

    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter unik.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreeTerms) {
      setError('Harap setujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      let existingAccounts: any[] = [];
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('safetitip_registered_accounts');
        if (saved) {
          try {
            existingAccounts = JSON.parse(saved);
          } catch (err) {
            existingAccounts = [];
          }
        }
      }

      const emailExists = existingAccounts.some(
        (acc: any) => acc.email?.toLowerCase() === trimmedEmail
      );

      if (emailExists) {
        setError('Email ini sudah terdaftar. Silakan langsung masuk menggunakan akun Anda.');
        return;
      }

      const newAccount = {
        nama: trimmedNama,
        email: trimmedEmail,
        password: password,
        registeredAt: new Date().toISOString(),
      };

      existingAccounts.push(newAccount);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'safetitip_registered_accounts',
          JSON.stringify(existingAccounts)
        );

        const userSession = {
          role: 'USER',
          nama: newAccount.nama,
          email: newAccount.email,
          noWa: '',
          alamat: 'Kota Padang, Sumatera Barat',
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem('safetitip_user_session', JSON.stringify(userSession));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/booking');
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand Asli SafeTitip */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                Safe<span className="text-blue-600">Titip</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600 mt-1">
                Express & Care
              </span>
            </div>
          </Link>

          {/* Right Nav: Language & Need Help */}
          <div className="flex items-center gap-5 sm:gap-6 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setLanguage(language === 'ID' ? 'EN' : 'ID')}
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-600">language</span>
              <span>{language === 'ID' ? 'Bahasa (ID)' : 'English (US)'}</span>
            </button>

            <Link
              href="/faq"
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-600">help</span>
              <span>{language === 'ID' ? 'Butuh Bantuan?' : 'Need Help?'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT: DUA KARTU SEPERTI TAMPILAN MOCKUP                           */}
      {/* ========================================================================= */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* ======================================================================= */}
          {/* SISI KIRI: PANEL PROPOSISI NILAI (BACKGROUND BIRU PASTEL SESUAI GAMBAR) */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 bg-[#edf2fe] border border-blue-100/80 rounded-[32px] p-7 sm:p-9 flex flex-col justify-between shadow-xs">
            <div>
              {/* Badge Pill Top */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-indigo-700 text-[11px] font-extrabold shadow-2xs border border-indigo-100">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>SAFETITIP EXPRESS & CARE</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight mt-6">
                Titip Aman, Cepat,<br />
                <span className="text-indigo-600">dan Terpercaya.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 font-normal">
                Solusi penitipan & pengiriman titipan lintas kota dan wilayah dengan sistem keamanan berlapis serta kurir terverifikasi.
              </p>

              {/* 3 Kartu Keunggulan */}
              <div className="space-y-3.5 mt-7">
                {/* 1. Real-Time Live Tracking */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-blue-50/80 flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">radar</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Real-Time Live Tracking
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Pantau lokasi paket Anda dengan akurasi GPS detik per detik hingga tiba di tujuan.
                    </p>
                  </div>
                </div>

                {/* 2. Asuransi & Proteksi 100% */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-blue-50/80 flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Asuransi & Proteksi 100%
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Jaminan ganti rugi penuh tanpa potongan jika terjadi kendala pada barang berharga Anda.
                    </p>
                  </div>
                </div>

                {/* 3. Jaringan Terverifikasi */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-blue-50/80 flex items-start gap-3.5 transition-all hover:shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Jaringan Terverifikasi
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Setiap kurir melalui verifikasi identitas biometrik dan latar belakang legal yang ketat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button / Badge */}
            <div className="mt-7 w-full py-3.5 px-4 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/25">
              <span className="material-symbols-outlined text-[20px] text-white">local_shipping</span>
              <span>Titipan Terkirim Aman & Tepat Waktu</span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SISI KANAN: FORM MASUK (LOGIN) ATAU BUAT AKUN BARU (REGISTER)           */}
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
                  <span>
                    {authMode === 'LOGIN'
                      ? 'Berhasil Masuk! Mengalihkan ke Halaman Booking...'
                      : 'Akun Berhasil Dibuat! Mengalihkan ke Halaman Booking...'}
                  </span>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAMPILAN MODE MASUK (LOGIN)                                         */}
              {/* =================================================================== */}
              {authMode === 'LOGIN' ? (
                <>
                  {/* Logo Di Atas Form (Tetap di kiri sejajar tulisan) */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                      <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                        Safe<span className="text-blue-600">Titip</span>
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600 mt-1">
                        Express & Care
                      </span>
                    </div>
                  </div>

                  {/* Judul & Deskripsi Header Form */}
                  <div className="mt-5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Selamat Datang Kembali
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Masuk ke akun SafeTitip Anda untuk memantau dan mengelola titipan barang.
                    </p>
                  </div>

                  {/* Form Masuk Manual di Atas */}
                  <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                    {/* Field: Alamat Email */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                        Alamat Email
                      </label>
                      <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </div>
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="nama@email.com"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Field: Kata Sandi + Ikon Mata */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                        Kata Sandi
                      </label>
                      <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                          <span className="material-symbols-outlined text-[20px]">lock</span>
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
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
                      <button
                        type="button"
                        onClick={() => alert('Fitur reset kata sandi akan dikirimkan ke email terdaftar Anda.')}
                        className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        Lupa Kata Sandi?
                      </button>
                    </div>

                    {/* Tombol Utama: Masuk Sekarang */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Memverifikasi Akun...</span>
                        </>
                      ) : (
                        <span>Masuk Sekarang</span>
                      )}
                    </button>
                  </form>

                  {/* Divider: atau daftar dengan (Di Bawah Form) */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] font-bold text-slate-400">
                      <span className="bg-white px-3">atau daftar dengan</span>
                    </div>
                  </div>

                  {/* Tombol Nyata Google Sign-In Sesuai Gambar (Di Bawah Form) */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || loading}
                    className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                  >
                    {googleLoading ? (
                      <span className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></span>
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    )}
                    <span>Google</span>
                  </button>

                  {/* Toggle Switcher: Belum punya akun? Daftar Sekarang */}
                  <div className="text-center mt-5 text-xs text-slate-600 font-semibold">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('REGISTER');
                        setError('');
                        setSuccess(false);
                      }}
                      className="font-extrabold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                    >
                      Daftar Sekarang
                    </button>
                  </div>

                  {/* Banner Keamanan Ringkas */}
                  <div className="mt-7 p-3 rounded-2xl bg-[#f0f5ff] border border-blue-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <div className="text-[11px] text-slate-600 leading-snug">
                      <span>Data dan transaksi Anda terlindungi sepenuhnya.</span>
                    </div>
                  </div>
                </>
              ) : (
                /* =================================================================== */
                /* TAMPILAN BUAT AKUN BARU (SESUAI GAMBAR MOCKUP TERBARU)              */
                /* =================================================================== */
                <>
                  {/* Top Bar Form: Logo di Kiri Sejajar Tulisan (Tanpa Tanda Panah) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                        <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                          Safe<span className="text-blue-600">Titip</span>
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-600 mt-1">
                          Express & Care
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-xs font-bold text-slate-500">Create Account</span>
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge: Keamanan Terjamin 100% */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-extrabold border border-indigo-100 mt-5">
                    <span className="material-symbols-outlined text-[15px] text-indigo-600">verified_user</span>
                    <span>Keamanan Terjamin 100%</span>
                  </div>

                  {/* Judul & Subjudul Sesuai Mockup Gambar */}
                  <div className="mt-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Buat Akun Baru
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      Mulai pengalaman terbaik Anda dalam hitungan detik.
                    </p>
                  </div>

                  {/* Formulir Pendaftaran Mandiri di Atas */}
                  <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
                    {/* 1. Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Nama Lengkap
                      </label>
                      <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <span className="material-symbols-outlined text-[20px]">person</span>
                        </div>
                        <input
                          type="text"
                          value={registerForm.nama}
                          onChange={(e) => setRegisterForm({ ...registerForm, nama: e.target.value })}
                          placeholder="cth. Alex Pratama"
                          required
                          className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* 2. Alamat Email */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Alamat Email
                      </label>
                      <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </div>
                        <input
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          placeholder="alex@domain.com"
                          required
                          className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* 3. Kata Sandi + Toggle Ikon Mata */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Kata Sandi
                      </label>
                      <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <span className="material-symbols-outlined text-[20px]">lock</span>
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          placeholder="Minimal 8 karakter unik"
                          required
                          className="w-full pl-11 pr-11 py-2.5 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle Password Visibility"
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>

                      {/* Indikator Kekuatan Kata Sandi Sesuai Gambar */}
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Kekuatan kata sandi:</span>
                          <span className={strength.textColor}>{strength.label}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 h-1.5">
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 1
                                ? strength.score === 1
                                  ? 'bg-rose-500'
                                  : strength.score === 2
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                                : 'bg-slate-200'
                            }`}
                          ></div>
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 2
                                ? strength.score === 2
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                                : 'bg-slate-200'
                            }`}
                          ></div>
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Konfirmasi Kata Sandi + Toggle Ikon Mata */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi
                      </label>
                      <div className="relative rounded-2xl overflow-hidden bg-[#f8faff] border border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <span className="material-symbols-outlined text-[20px]">lock</span>
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                          }
                          placeholder="Ulangi kata sandi"
                          required
                          className="w-full pl-11 pr-11 py-2.5 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Toggle Confirm Password Visibility"
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 5. Checkbox Syarat & Ketentuan */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer shrink-0"
                        />
                        <span>
                          Saya menyetujui{' '}
                          <span className="text-indigo-600 font-bold hover:underline">
                            Syarat & Ketentuan
                          </span>{' '}
                          serta{' '}
                          <span className="text-indigo-600 font-bold hover:underline">
                            Kebijakan Privasi
                          </span>{' '}
                          SafeTitip.
                        </span>
                      </label>
                    </div>

                    {/* Tombol Utama: Buat Akun Saya */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 mt-2"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Mendaftarkan Akun Anda...</span>
                        </>
                      ) : (
                        <span>Buat Akun Saya</span>
                      )}
                    </button>
                  </form>

                  {/* Divider: atau daftar dengan (Di Bawah Form) */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] font-bold text-slate-400">
                      <span className="bg-white px-3">atau daftar dengan</span>
                    </div>
                  </div>

                  {/* Tombol Nyata Google Sign-In Sesuai Gambar (Di Bawah Form) */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || loading}
                    className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                  >
                    {googleLoading ? (
                      <span className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></span>
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    )}
                    <span>Google</span>
                  </button>

                  {/* Switcher: Sudah memiliki akun? Masuk di sini */}
                  <div className="text-center mt-5 text-xs text-slate-600 font-semibold">
                    Sudah memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('LOGIN');
                        setError('');
                        setSuccess(false);
                      }}
                      className="font-extrabold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                    >
                      Masuk di sini
                    </button>
                  </div>

                  {/* Bottom Trust Badge: Enkripsi End-to-End */}
                  <div className="mt-7 p-3 rounded-2xl bg-[#edf2fe] border border-blue-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                    </div>
                    <div className="text-[11px] text-slate-600 leading-snug">
                      <span className="font-extrabold text-slate-900 block">Enkripsi End-to-End</span>
                      <span>Data Anda disimpan secara aman dengan proteksi terkini.</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="py-4 text-center text-xs text-slate-600 border-t border-slate-200/60 bg-white">
        <p>© 2026 SafeTitip Padang. Penitipan & Ekspedisi Terpercaya.</p>
      </footer>
    </div>
  );
}
