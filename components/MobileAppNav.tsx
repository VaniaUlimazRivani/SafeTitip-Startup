'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MobileAppNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Jangan tampil di halaman admin
  if (pathname.startsWith('/admin')) return null;

  // Hindari hydration mismatch
  if (!isMounted) return null;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Spacer agar konten tidak ketutupan bottom nav — hanya di mobile */}
      <div className="h-[68px] block lg:hidden shrink-0" aria-hidden="true" />

      {/* Bottom Navigation Bar — hanya tampil di layar mobile (< lg) */}
      <nav
        aria-label="Navigasi Aplikasi"
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom
          bg-white/92 backdrop-blur-xl
          border-t border-slate-200/70
          shadow-[0_-2px_16px_rgba(0,0,0,0.07)]
          block lg:hidden"
      >
        <div className="flex items-center justify-around h-[60px] px-2 relative max-w-lg mx-auto">

          {/* Tab: Beranda */}
          <Link
            href="/"
            aria-label="Beranda"
            aria-current={isActive('/') ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200
              ${isActive('/') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span className={`material-symbols-outlined text-[24px] leading-none
              ${isActive('/') ? '[font-variation-settings:"FILL"_1]' : '[font-variation-settings:"FILL"_0]'}`}>
              home
            </span>
            <span className="text-[10px] font-bold leading-none">Beranda</span>
          </Link>

          {/* Tab: Kalkulator */}
          <Link
            href="/kalkulator"
            aria-label="Simulasi Harga"
            aria-current={isActive('/kalkulator') ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200
              ${isActive('/kalkulator') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span className={`material-symbols-outlined text-[24px] leading-none
              ${isActive('/kalkulator') ? '[font-variation-settings:"FILL"_1]' : '[font-variation-settings:"FILL"_0]'}`}>
              calculate
            </span>
            <span className="text-[10px] font-bold leading-none">Harga</span>
          </Link>

          {/* CENTER FAB: Booking */}
          <div className="flex items-center justify-center flex-1 -mt-4">
            <Link
              href="/booking"
              aria-label="Booking Penitipan"
              className={`w-14 h-14 rounded-full flex items-center justify-center
                shadow-[0_4px_20px_rgba(37,99,235,0.40)]
                active:scale-95 transition-all duration-200
                ${isActive('/booking')
                  ? 'bg-blue-700 ring-4 ring-blue-200'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <span className="material-symbols-outlined text-white text-[26px] [font-variation-settings:'FILL'_1]">
                inventory_2
              </span>
            </Link>
          </div>

          {/* Tab: Keamanan */}
          <Link
            href="/keamanan"
            aria-label="Keamanan & SOP"
            aria-current={isActive('/keamanan') ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200
              ${isActive('/keamanan') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span className={`material-symbols-outlined text-[24px] leading-none
              ${isActive('/keamanan') ? '[font-variation-settings:"FILL"_1]' : '[font-variation-settings:"FILL"_0]'}`}>
              verified_user
            </span>
            <span className="text-[10px] font-bold leading-none">SOP</span>
          </Link>

          {/* Tab: Akun */}
          <Link
            href="/login"
            aria-label="Akun"
            aria-current={isActive('/login') ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200
              ${isActive('/login') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span className={`material-symbols-outlined text-[24px] leading-none
              ${isActive('/login') ? '[font-variation-settings:"FILL"_1]' : '[font-variation-settings:"FILL"_0]'}`}>
              account_circle
            </span>
            <span className="text-[10px] font-bold leading-none">Akun</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
