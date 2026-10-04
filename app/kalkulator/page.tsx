'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HARGA } from '@/lib/constants/harga';

export default function KalkulatorPage() {
  const [calcKategori, setCalcKategori] = useState<'A' | 'B'>('A');
  const [calcDurasi, setCalcDurasi] = useState<1 | 2 | 3>(1);
  const [selectedPreset, setSelectedPreset] = useState<string | null>('buku');

  const presetItems = [
    { id: 'buku', label: '📦 Dus Buku & Arsip', kategori: 'A' as const, note: 'Kategori A (≤ 3 item)' },
    { id: 'pakaian', label: '👕 Box Pakaian & Sepatu', kategori: 'A' as const, note: 'Kategori A (≤ 3 item)' },
    { id: 'kulkas', label: '❄️ Kulkas Mini Kos', kategori: 'B' as const, note: 'Kategori B (Barang Besar)' },
    { id: 'kasur', label: '🛏️ Kasur Lipat / Busa', kategori: 'B' as const, note: 'Kategori B (Volume Besar)' },
    { id: 'motor', label: '🏍️ Sepeda Motor', kategori: 'CUSTOM' as const, note: 'Perlu Cek STNK / Negosiasi' },
  ];

  const handleSelectPreset = (preset: typeof presetItems[0]) => {
    setSelectedPreset(preset.id);
    if (preset.kategori === 'A' || preset.kategori === 'B') {
      setCalcKategori(preset.kategori);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Simulasi Biaya Transparan
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kalkulator & Tarif Flat Kos
          </h1>
          <p className="text-sm text-slate-600">
            Hitung biaya titip barang secara instan tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Visual Quick Item Selector (Interaktif & Animasi) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">touch_app</span>
              Klik Cepat Jenis Barang Anda:
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Auto Pilih Kategori
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {presetItems.map((preset) => {
              const isActive = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all transform active:scale-95 flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kalkulator Card Visual Grid */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  1. Pilih Kategori Barang
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcKategori('A');
                      setSelectedPreset(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      calcKategori === 'A'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/30 shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-extrabold text-sm text-slate-900">Kategori A</p>
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">inventory_2</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Dus buku, pakaian, mini kit (≤ 3 item)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalcKategori('B');
                      setSelectedPreset(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      calcKategori === 'B'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/30 shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-extrabold text-sm text-slate-900">Kategori B</p>
                      <span className="material-symbols-outlined text-blue-600 text-[20px]">kitchen</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Kulkas mini, kasur lipat (4–7 item)</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  2. Pilih Durasi Penitipan
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {([1, 2, 3] as const).map((bln) => (
                    <button
                      key={bln}
                      type="button"
                      onClick={() => setCalcDurasi(bln)}
                      className={`py-3.5 rounded-2xl border text-sm font-extrabold transition-all ${
                        calcDurasi === bln
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {bln} Bulan
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Guarantee Perks */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span>Palet Kayu Bebas Banjir</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">videocam</span>
                  <span>CCTV 24 Jam Non-Stop</span>
                </div>
              </div>
            </div>

            {/* Output Panel with Animated Gradient */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Estimasi Resmi</span>
                  <span className="text-xs font-extrabold text-blue-900 bg-sky-100 px-3 py-1 rounded-full">
                    Kategori {calcKategori} • {calcDurasi} Bulan
                  </span>
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                  Rp {HARGA[calcKategori][calcDurasi].toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  Rata-rata: Rp {Math.round(HARGA[calcKategori][calcDurasi] / calcDurasi).toLocaleString('id-ID')} / bulan
                </p>
              </div>

              <div className="text-xs text-blue-100 space-y-2 pt-4 border-t border-white/20">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                  <span>Jemput langsung ke kamar kos Anda di Padang</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                  <span>Dokumentasi fisik foto 360° & segel ber-barcode</span>
                </p>
              </div>

              <Link
                href="/booking"
                className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 text-center text-sm font-extrabold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Booking Penjemputan Paket Ini →
              </Link>
            </div>

          </div>

          {/* Full Price Table with Modern Striping */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">table_chart</span>
              Tabel Perbandingan Harga Resmi Mahasiswa
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase">
                  <tr>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Kapasitas Barang</th>
                    <th className="p-3.5 text-center">1 Bulan</th>
                    <th className="p-3.5 text-center">2 Bulan</th>
                    <th className="p-3.5 text-center">3 Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-blue-700 flex items-center gap-1.5">
                      <span>📦</span> Kategori A
                    </td>
                    <td className="p-3.5 text-slate-600">Dus buku, pakaian, mini kit (≤3 item)</td>
                    <td className="p-3.5 text-center font-extrabold text-slate-900">Rp 199.000</td>
                    <td className="p-3.5 text-center font-extrabold text-slate-900">Rp 379.000</td>
                    <td className="p-3.5 text-center font-extrabold text-blue-700 bg-blue-50/50">Rp 499.000</td>
                  </tr>
                  <tr className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-indigo-700 flex items-center gap-1.5">
                      <span>❄️</span> Kategori B
                    </td>
                    <td className="p-3.5 text-slate-600">Kulkas mini, kasur lipat (4–7 item)</td>
                    <td className="p-3.5 text-center font-extrabold text-slate-900">Rp 299.000</td>
                    <td className="p-3.5 text-center font-extrabold text-slate-900">Rp 499.000</td>
                    <td className="p-3.5 text-center font-extrabold text-indigo-700 bg-indigo-50/50">Rp 699.000</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-amber-700 flex items-center gap-1.5">
                      <span>🏍️</span> Custom
                    </td>
                    <td className="p-3.5 text-slate-600">Sepeda motor & volume &gt;7 item</td>
                    <td className="p-3.5 text-center font-bold text-slate-500" colSpan={3}>
                      Konsultasi & Penawaran Khusus Admin
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
