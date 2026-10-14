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
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SafeTitip PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SafeTitip PWA] Service Worker registration failed:', err);
        });
    }

    // 2. Check if already installed / running in standalone mode
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return; // Do not show install prompt if already installed
    }

    // 3. Check if user dismissed prompt recently (within 3 days)
    const dismissedTime = localStorage.getItem('safetitip_pwa_dismissed');
    if (dismissedTime) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 3) {
        return;
      }
    }

    // 4. Android / Chromium: Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. iOS Safari Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('fxios');

    if (isIOSDevice && !isStandaloneMode) {
      setIsIOS(true);
      // Show prompt after a short delay for smooth page experience
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2500);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSModal(false);
    localStorage.setItem('safetitip_pwa_dismissed', Date.now().toString());
  };

  // If already installed or no prompt needed, render nothing
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Notification Banner */}
      <aside 
        aria-label="PWA Install Notification"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md w-auto animate-bounce-subtle"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-blue-100/80 shadow-blue-500/10 flex items-center gap-3.5 transition-all">
          
          {/* App Icon */}
          <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center">
            <Image
              src="/icons/icon-192x192.png"
              alt="SafeTitip App Icon"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 tracking-tight">SafeTitip App</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">PWA</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
              {isIOS 
                ? 'Pasang di iPhone Anda untuk akses lebih cepat' 
                : 'Install aplikasi untuk booking & pantau penitipan'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Install</span>
            </button>

            <button
              onClick={handleDismiss}
              aria-label="Tutup notifikasi install"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Instruction Modal Popup */}
      {showIOSModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-blue-500/20 bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="SafeTitip App Icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Install SafeTitip di iOS</h3>
                  <p className="text-xs text-slate-500">Panduan tambah ke layar utama</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Steps */}
            <div className="py-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  1
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">Ketuk tombol Bagikan (Share)</p>
                  <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                    Cari ikon <span className="material-symbols-outlined text-blue-600 text-[18px]">ios_share</span> di bilah navigasi Safari (bagian bawah iPhone).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  2
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">Pilih &quot;Tambahkan ke Layar Utama&quot;</p>
                  <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                    Gulir ke bawah dan ketuk <span className="material-symbols-outlined text-slate-700 text-[18px]">add_box</span> <span className="font-medium text-slate-800">Add to Home Screen</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                  3
                </div>
                <div className="text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">Ketuk &quot;Tambah&quot; (Add)</p>
                  <p className="text-slate-500 mt-0.5">
                    Klik tombol <strong>Tambah</strong> di sudut kanan atas layar iPhone Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2">
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
