'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'jemput' | 'gudang' | 'larangan' | 'biaya'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'Semua Pertanyaan', icon: 'apps' },
    { id: 'jemput', label: 'Penjemputan Kos', icon: 'local_shipping' },
    { id: 'gudang', label: 'Keamanan Gudang', icon: 'warehouse' },
    { id: 'larangan', label: 'Barang Dilarang', icon: 'do_not_disturb' },
    { id: 'biaya', label: 'Biaya & Diskon', icon: 'payments' },
  ];

  const faqs = [
    {
      category: 'biaya',
      q: 'Bagaimana penentuan Kategori A vs Kategori B?',
      a: 'Kategori A untuk barang berukuran sedang seperti dus buku, dus pakaian, dan elektronik kecil (maks. 3 item). Kategori B untuk barang bervolume besar seperti kulkas mini, kasur lipat, atau volume 4–7 item.',
    },
    {
      category: 'jemput',
      q: 'Apakah sepeda motor bisa dititipkan di SafeTitip?',
      a: 'Bisa! Sepeda motor masuk ke skema Custom Quotation. Dilakukan inspeksi fisik STNK, pencatatan kilometer, dan pelepasan aki demi keselamatan.',
    },
    {
      category: 'jemput',
      q: 'Bagaimana proses penjemputan barang di kamar kos?',
      a: 'Kurir SafeTitip datang langsung ke kamar kos Anda sesuai jadwal. Dilakukan pemasangan segel barcode unik dan foto dokumentasi 360° sebelum barang diangkut.',
    },
    {
      category: 'larangan',
      q: 'Barang apa saja yang dilarang untuk dititipkan?',
      a: 'Sesuai regulasi: makanan basah/basi, uang tunai, perhiasan emas/berlian, hewan peliharaan, senjata tajam, dan narkoba ditolak otomatis oleh sistem.',
    },
    {
      category: 'gudang',
      q: 'Apakah gudang aman dari banjir dan tikus?',
      a: 'Sangat aman! Seluruh barang dialasi palet kayu berjarak dari lantai semen, ruangan dilengkapi sirkulasi optimal, dan dipantau CCTV 24 jam penuh.',
    },
    {
      category: 'jemput',
      q: 'Kapan barang akan diantar kembali ke kos saya?',
      a: 'Barang diantar kembali tepat saat Anda kembali ke Padang sesuai tanggal selesai sewa atau konfirmasi via WhatsApp admin SafeTitip.',
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter((f) => f.category === activeCategory);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">help</span>
            Pusat Bantuan Cepat
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            FAQ & Panduan Titip
          </h1>
          <p className="text-sm text-slate-600">
            Temukan jawaban lengkap seputar penjemputan, keamanan gudang, dan barang yang diizinkan.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* VISUAL SHOWCASE: BARANG DIPERBOLEHKAN VS BARANG DILARANG (VISUAL-FIRST)   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Boleh Dititip */}
          <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/60 border border-emerald-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Barang Diperbolehkan</h3>
                <p className="text-[11px] text-emerald-700 font-bold">100% Layanan SafeTitip Melindungi</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-2">
                <span>📚</span>
                <span className="font-bold text-slate-800">Dus Buku & Dokumen</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-2">
                <span>👕</span>
                <span className="font-bold text-slate-800">Pakaian & Sepatu</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-2">
                <span>❄️</span>
                <span className="font-bold text-slate-800">Kulkas Mini Kos</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-2">
                <span>🛏️</span>
                <span className="font-bold text-slate-800">Kasur Lipat / Busa</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-2">
                <span>💨</span>
                <span className="font-bold text-slate-800">Kipas Angin / Dispenser</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-2">
                <span>🏍️</span>
                <span className="font-bold text-slate-800">Sepeda Motor (+STNK)</span>
              </div>
            </div>
          </div>

          {/* Card Dilarang Dititip */}
          <div className="p-6 sm:p-7 rounded-3xl bg-rose-50/60 border border-rose-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/30">
                <span className="material-symbols-outlined text-[22px]">cancel</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Barang Dilarang Keras</h3>
                <p className="text-[11px] text-rose-700 font-bold">Ditolak Otomatis oleh SOP Keamanan</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center gap-2 text-slate-700">
                <span>🍲</span>
                <span className="font-bold text-rose-900">Makanan Mudah Basi</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center gap-2 text-slate-700">
                <span>💵</span>
                <span className="font-bold text-rose-900">Uang Tunai & Logam Mulia</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center gap-2 text-slate-700">
                <span>🐱</span>
                <span className="font-bold text-rose-900">Hewan Peliharaan</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center gap-2 text-slate-700">
                <span>🔥</span>
                <span className="font-bold text-rose-900">Gas & Bahan Peledak</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center gap-2 text-slate-700">
                <span>🔪</span>
                <span className="font-bold text-rose-900">Senjata Tajam / Api</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-100 shadow-2xs flex items-center gap-2 text-slate-700">
                <span>🚫</span>
                <span className="font-bold text-rose-900">Obat Terlarang / Narkoba</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Kategori Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id as any)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion / List Interaktif */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.map((f, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{f.q}</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed pl-14 border-t border-slate-100 bg-slate-50/50">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Action Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center space-y-4 shadow-xl">
          <h3 className="font-extrabold text-2xl sm:text-3xl">Sudah Siap Titip Barang Kos Anda?</h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
            Hanya butuh 2 menit untuk melengkapi form dan kurir kami siap menjemput barang di kamar kos Anda di Padang.
          </p>
          <div className="pt-2">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-blue-900 font-extrabold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Buka Form Booking Sekarang</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
