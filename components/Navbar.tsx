'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Form Booking', href: '/booking' },
    { name: 'Simulasi Harga', href: '/kalkulator' },
    { name: 'Keamanan SOP', href: '/keamanan' },
    { name: 'FAQ', href: '/faq' },
  ];

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('safetitip_user_session');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
  }, [pathname]);

  const handleUserLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('safetitip_user_session');
      setCurrentUser(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] flex items-center justify-center text-white shadow-md shadow-[#B86B35]/25 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[26px]">inventory_2</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[#2A1B14] leading-none group-hover:text-[#B86B35] transition-colors">
                Kos<span className="text-[#B86B35]">inaja</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#705E54] mt-1">
                Jasa Titip Barang • Padang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F6ECE1]/80 p-1.5 rounded-full border border-[#E8DDD3]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                    isActive
                      ? 'bg-[#B86B35] text-white shadow-xs'
                      : 'text-[#421E0B] hover:text-[#B86B35] hover:bg-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Status Akun Pengguna / Tombol Masuk */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F6ECE1] border border-[#EBD8C6] text-xs font-bold text-[#622F12] shadow-2xs">
                <span className="material-symbols-outlined text-[18px] text-[#B86B35]">person</span>
                <span className="max-w-[120px] truncate">{currentUser.nama.split(' ')[0]}</span>
                <button
                  type="button"
                  onClick={handleUserLogout}
                  title="Keluar Akun"
                  className="p-1 rounded-md hover:bg-[#EBD8C6] text-[#705E54] hover:text-rose-600 transition-colors ml-1"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#7E3F18] bg-[#F6ECE1] hover:bg-[#EBD8C6] border border-[#DCBEA3] text-xs font-extrabold transition-all shadow-2xs"
                title="Masuk / Daftar Akun Pengguna"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>Masuk / Daftar</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[28px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#B86B35] text-white'
                    : 'text-[#421E0B] hover:bg-[#F6ECE1]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E8DDD3] flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6ECE1] border border-[#EBD8C6] text-xs font-bold text-[#622F12]">
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[18px] text-[#B86B35] shrink-0">school</span>
                  <span className="truncate">{currentUser.nama}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleUserLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#EBD8C6] hover:bg-rose-100 text-[#705E54] hover:text-rose-600 transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">logout</span>
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-[#F6ECE1] text-[#7E3F18] font-extrabold text-xs flex items-center justify-center gap-1.5 border border-[#DCBEA3]"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>Masuk / Daftar Akun</span>
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-[#F6ECE1]/60 hover:bg-[#F6ECE1] text-[#421E0B] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#E8DDD3]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#B86B35]">shield_person</span>
                <span>Portal Petugas</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-[#F6ECE1]/60 hover:bg-[#F6ECE1] text-[#421E0B] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#E8DDD3]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Dashboard Admin</span>
              </Link>
            </div>
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-bold text-sm shadow-md shadow-[#B86B35]/20"
            >
              Booking Slot Penjemputan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
