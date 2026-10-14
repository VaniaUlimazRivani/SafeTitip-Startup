'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileAppNav() {
  const pathname = usePathname();

  // Jangan render sama sekali di halaman admin
  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Spacer — hanya tampil di mobile via CSS */}
      <div className="mobile-nav-spacer" aria-hidden="true" />

      {/* Bottom Navigation Bar — visibilitas diatur murni via CSS @media query */}
      <nav aria-label="Navigasi Aplikasi" className="mobile-bottom-nav">
        <div className="mobile-bottom-nav__inner">

          {/* Beranda */}
          <Link href="/" aria-label="Beranda" className={`mobile-nav-tab${isActive('/') ? ' active' : ''}`}>
            <span className="material-symbols-outlined">home</span>
            <span>Beranda</span>
          </Link>

          {/* Kalkulator */}
          <Link href="/kalkulator" aria-label="Simulasi Harga" className={`mobile-nav-tab${isActive('/kalkulator') ? ' active' : ''}`}>
            <span className="material-symbols-outlined">calculate</span>
            <span>Harga</span>
          </Link>

          {/* CENTER FAB: Booking */}
          <div className="mobile-nav-fab-wrap">
            <Link href="/booking" aria-label="Booking Penitipan" className={`mobile-nav-fab${isActive('/booking') ? ' active' : ''}`}>
              <span className="material-symbols-outlined">inventory_2</span>
            </Link>
          </div>

          {/* Keamanan */}
          <Link href="/keamanan" aria-label="Keamanan SOP" className={`mobile-nav-tab${isActive('/keamanan') ? ' active' : ''}`}>
            <span className="material-symbols-outlined">verified_user</span>
            <span>SOP</span>
          </Link>

          {/* Akun */}
          <Link href="/login" aria-label="Akun" className={`mobile-nav-tab${isActive('/login') ? ' active' : ''}`}>
            <span className="material-symbols-outlined">account_circle</span>
            <span>Akun</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
