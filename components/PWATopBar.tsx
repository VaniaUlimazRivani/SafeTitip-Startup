'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

/** Mapping dari pathname ke judul halaman untuk AppBar */
const PAGE_TITLES: Record<string, { title: string; icon: string }> = {
  '/':           { title: 'SafeTitip',          icon: 'home'           },
  '/booking':    { title: 'Form Booking',        icon: 'inventory_2'    },
  '/kalkulator': { title: 'Simulasi Harga',      icon: 'calculate'      },
  '/keamanan':   { title: 'Keamanan & SOP',      icon: 'verified_user'  },
  '/faq':        { title: 'FAQ',                 icon: 'help'           },
  '/login':      { title: 'Masuk Akun',          icon: 'account_circle' },
  '/register':   { title: 'Daftar Akun',         icon: 'person_add'     },
};

export default function PWATopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Deteksi mode standalone
    const check = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };
    check();
    const mq = window.matchMedia('(display-mode: standalone)');
    mq.addEventListener('change', check);

    // Ambil sesi pengguna
    const saved = localStorage.getItem('safetitip_user_session');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch {}
    }

    return () => mq.removeEventListener('change', check);
  }, [pathname]);

  // Hanya tampil di mode PWA standalone
  if (!isStandalone) return null;

  // Jangan tampil di halaman admin
  if (pathname.startsWith('/admin')) return null;

  const isHome = pathname === '/';
  const pageInfo = PAGE_TITLES[pathname] ?? { title: 'SafeTitip', icon: 'inventory_2' };

  const handleLogout = () => {
    localStorage.removeItem('safetitip_user_session');
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    /* Safe area top — penting untuk iPhone notch & Dynamic Island */
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/70 shadow-sm safe-area-top"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center justify-between px-4 h-14">

        {/* Kiri: Tombol Back (halaman non-home) atau Logo Brand (halaman home) */}
        <div className="flex items-center gap-2.5 min-w-0">
          {!isHome ? (
            <button
              onClick={() => router.back()}
              aria-label="Kembali"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          )}
        </div>

        {/* Tengah: Judul Halaman */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {isHome ? (
            <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
              Safe<span className="text-blue-600">Titip</span>
            </span>
          ) : (
            <span className="font-bold text-[15px] text-slate-800 truncate max-w-[200px]">
              {pageInfo.title}
            </span>
          )}
        </div>

        {/* Kanan: Akun pengguna / Tombol login */}
        <div className="flex items-center gap-1.5 min-w-0">
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 max-w-[100px]">
                <span className="material-symbols-outlined text-[15px] text-blue-600">person</span>
                <span className="truncate">{currentUser.nama?.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Keluar"
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold shadow-sm shadow-blue-600/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[15px]">account_circle</span>
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
