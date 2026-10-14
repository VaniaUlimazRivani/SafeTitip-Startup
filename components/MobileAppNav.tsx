'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NavTab {
  label: string;
  href: string;
  icon: string;
  iconActive: string;
}

const TABS: NavTab[] = [
  { label: 'Beranda',   href: '/',           icon: 'home',               iconActive: 'home'              },
  { label: 'Booking',   href: '/booking',    icon: 'inventory_2',        iconActive: 'inventory_2'       },
  { label: 'Kalkulator',href: '/kalkulator', icon: 'calculate',          iconActive: 'calculate'         },
  { label: 'Keamanan',  href: '/keamanan',   icon: 'verified_user',      iconActive: 'verified_user'     },
  { label: 'Akun',      href: '/login',      icon: 'account_circle',     iconActive: 'account_circle'    },
];

export default function MobileAppNav() {
  const pathname = usePathname();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();
    const mq = window.matchMedia('(display-mode: standalone)');
    mq.addEventListener('change', checkStandalone);
    return () => mq.removeEventListener('change', checkStandalone);
  }, []);

  // Hanya tampil di mode PWA standalone
  if (!isStandalone) return null;

  // Jangan tampil di halaman admin
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Safe area bottom spacer agar konten tidak tertutup nav bar */}
      <div className="h-[74px] shrink-0" aria-hidden="true" />

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Aplikasi"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] safe-area-bottom"
      >
        <div className="flex items-stretch justify-around h-[62px] px-1 max-w-lg mx-auto">
          {TABS.map((tab) => {
            const isActive =
              tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 transition-all duration-200 relative
                  ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}
                `}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-full" />
                )}

                {/* Icon */}
                <span
                  className={`material-symbols-outlined transition-all duration-200 leading-none select-none
                    ${isActive ? 'text-[26px] [font-variation-settings:"FILL"_1]' : 'text-[24px] [font-variation-settings:"FILL"_0]'}
                  `}
                >
                  {isActive ? tab.iconActive : tab.icon}
                </span>

                {/* Label */}
                <span className={`text-[10px] font-bold leading-none tracking-wide truncate max-w-full px-1
                  ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* iOS home indicator safe area */}
        <div className="h-safe-bottom" />
      </nav>
    </>
  );
}
