'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'GUDANG' | 'KURIR'>('ADMIN');
  const [email, setEmail] = useState('admin@safetitip.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDemoFill = (selectedRole: 'ADMIN' | 'GUDANG' | 'KURIR') => {
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setEmail('admin@safetitip.com');
      setPassword('admin123');
    } else if (selectedRole === 'GUDANG') {
      setEmail('gudang@safetitip.com');
      setPassword('gudang123');
    } else {
      setEmail('kurir@safetitip.com');
      setPassword('kurir123');
    }
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }

    setLoading(true);

    // Simulasi verifikasi kredensial
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      const session = {
        role,
        email,
        nama: role === 'ADMIN' ? 'Vania (Super Admin)' : role === 'GUDANG' ? 'Bambang (Petugas Gudang)' : 'Rahmat (Kurir Penjemputan)',
        loginAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('safetitip_admin_session', JSON.stringify(session));
      }

      setTimeout(() => {
        router.push('/admin');
      }, 800);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="relative z-10 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Safe<span className="text-blue-400">Titip</span>
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 w-full flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Left Column: Visual Highlight */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-b from-blue-900/60 to-slate-900/90 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-700/80 relative">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Portal Petugas & Admin
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Kelola Seluruh Penitipan Barang Kos
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Akses manajemen pesanan, verifikasi penjemputan kamar, pantau barang di gudang, dan ubah status transaksi secara terpusat.
              </p>
            </div>

            {/* Visual Mini Features */}
            <div className="space-y-3 py-6">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">verified</span>
                <span className="text-xs font-semibold text-slate-200">Verifikasi Status Instan (A-05)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="material-symbols-outlined text-blue-400 text-[20px]">inventory</span>
                <span className="text-xs font-semibold text-slate-200">Database & Local Persistence</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="material-symbols-outlined text-purple-400 text-[20px]">shield</span>
                <span className="text-xs font-semibold text-slate-200">Log Riwayat & Audit Trail</span>
              </div>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-4 border-t border-slate-700/80">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pilih Akses Cepat Demo:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('ADMIN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    role === 'ADMIN'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('GUDANG')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    role === 'GUDANG'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Petugas Gudang
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('KURIR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    role === 'KURIR'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Kurir Armada
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Masuk ke Dashboard</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gunakan akun petugas atau klik salah satu tombol akses cepat di samping.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Login berhasil! Mengalihkan ke Dashboard Admin...</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="email">
                    Alamat Email Petugas
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-500 text-[18px]">
                      mail
                    </span>
                    <input
                      id="email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@safetitip.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5" htmlFor="password">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-500 text-[18px]">
                      key
                    </span>
                    <input
                      id="password"
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Ingat sesi saya</span>
                  </label>
                  <span className="text-blue-400 font-semibold cursor-pointer hover:underline">
                    Lupa Password?
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-500">
                Sistem SafeTitip Express & Care • Khusus Petugas Terverifikasi
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        &copy; 2026 SafeTitip Startup. Batch 9 Inatechno.
      </footer>
    </div>
  );
}
