'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  // Android: floating banner
  const [showAndroidBanner, setShowAndroidBanner] = useState(false);
  // iOS: langsung tampilkan bottom sheet panduan
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[SafeTitip PWA] SW registered:', reg.scope))
        .catch((err) => console.warn('[SafeTitip PWA] SW failed:', err));
    }

    // 2. Cek mode standalone (sudah diinstall)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // 3. Cek apakah user sudah dismiss dalam 3 hari terakhir
    const dismissedTime = localStorage.getItem('safetitip_pwa_dismissed');
    if (dismissedTime) {
      const daysSince = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 3) return;
    }

    // 4. Android / Chromium: tangkap beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Tunda sedikit agar halaman selesai render
      setTimeout(() => setShowAndroidBanner(true), 2000);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. iOS Safari: langsung tampilkan panduan setelah 2 detik
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    if (isIOSDevice) {
      setIsIOS(true);
      const timer = setTimeout(() => {
        setShowIOSModal(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Handler install Android
  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowAndroidBanner(false);
    setShowIOSModal(false);
    localStorage.setItem('safetitip_pwa_dismissed', Date.now().toString());
  };

  // Sudah installed — tidak tampilkan apapun
  if (isStandalone) return null;

  return (
    <>
      {/* =========================================================== */}
      {/* ANDROID: Floating Banner                                    */}
      {/* =========================================================== */}
      {showAndroidBanner && (
        <aside
          aria-label="Install Aplikasi SafeTitip"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md animate-bounce-subtle"
        >
          <div className="bg-white/97 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-blue-100/80 flex items-center gap-3.5">
            <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden shadow-md shadow-blue-500/20">
              <Image src="/icons/icon-192x192.png" alt="SafeTitip" width={48} height={48} className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">SafeTitip App</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">PWA</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Install aplikasi untuk akses lebih cepat</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleAndroidInstall}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-semibold rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                aria-label="Tutup"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================== */}
      {/* iOS: Bottom Sheet Panduan Install — Muncul OTOMATIS         */}
      {/* =========================================================== */}
      {isIOS && showIOSModal && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-end justify-center animate-fade-in"
          onClick={handleDismiss}
        >
          <div
            className="bg-white w-full rounded-t-3xl shadow-2xl border border-slate-200/80 animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            <div className="px-6 pb-6 pt-3">
              {/* Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md shadow-blue-500/20 shrink-0">
                  <Image src="/icons/icon-192x192.png" alt="SafeTitip" width={56} height={56} className="object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[17px] text-slate-900 leading-tight">
                    Pasang SafeTitip<br />di iPhone Anda! 📱
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Akses lebih cepat, tanpa buka browser</p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Steps */}
              <div className="py-5 space-y-5">

                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-slate-900">Ketuk tombol <span className="text-blue-600">Bagikan</span></p>
                    <div className="flex items-center gap-1.5 mt-1.5 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
                      <span className="material-symbols-outlined text-blue-600 text-[22px]">ios_share</span>
                      <span className="text-xs text-slate-600">
                        Ikon kotak & panah di toolbar bawah Safari
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-slate-900">Pilih <span className="text-blue-600">&quot;Add to Home Screen&quot;</span></p>
                    <div className="flex items-center gap-1.5 mt-1.5 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
                      <span className="material-symbols-outlined text-slate-700 text-[22px]">add_box</span>
                      <span className="text-xs text-slate-600">
                        Tambahkan ke Layar Utama — scroll ke bawah di menu Share
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-slate-900">Ketuk <span className="text-blue-600">&quot;Tambah&quot;</span> di pojok kanan atas</p>
                    <div className="flex items-center gap-1.5 mt-1.5 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-200">
                      <span className="material-symbols-outlined text-emerald-600 text-[22px]">check_circle</span>
                      <span className="text-xs text-emerald-700 font-medium">
                        Selesai! SafeTitip siap dipakai seperti aplikasi native.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <button
                onClick={handleDismiss}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-2xl transition-colors cursor-pointer"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
