'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TARIF_DASAR, HARGA_BULANAN, TipeDurasi } from '@/lib/constants/harga';
import { hitungQuotation } from '@/lib/services/quotationService';

export default function KalkulatorPage() {
  const [calcKategori, setCalcKategori] = useState<'A' | 'B'>('A');
  const [calcTipeDurasi, setCalcTipeDurasi] = useState<TipeDurasi>('BULAN');
  const [calcDurasiNilai, setCalcDurasiNilai] = useState<number>(1);

  const quotation = hitungQuotation(calcKategori, calcDurasiNilai, calcTipeDurasi);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Simulasi Biaya Fleksibel
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kalkulator Tarif Harian, Mingguan & Bulanan
          </h1>
          <p className="text-sm text-slate-600">
            Hitung biaya titip barang secara instan tanpa biaya tersembunyi di seluruh Kota Padang.
          </p>
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
                    onClick={() => setCalcKategori('A')}
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
                    onClick={() => setCalcKategori('B')}
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
                  2. Pilih Satuan Durasi
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTipeDurasi('HARI');
                      setCalcDurasiNilai(1);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      calcTipeDurasi === 'HARI'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Harian
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTipeDurasi('MINGGU');
                      setCalcDurasiNilai(1);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      calcTipeDurasi === 'MINGGU'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mingguan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTipeDurasi('BULAN');
                      setCalcDurasiNilai(1);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      calcTipeDurasi === 'BULAN'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bulanan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  3. Jumlah {calcTipeDurasi === 'HARI' ? 'Hari (Maks. 7 Hari)' : calcTipeDurasi === 'MINGGU' ? 'Minggu' : 'Bulan'}
                </label>
                {calcTipeDurasi === 'HARI' ? (
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCalcDurasiNilai(d)}
                        className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                          calcDurasiNilai === d
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        {d} Hari
                      </button>
                    ))}
                  </div>
                ) : calcTipeDurasi === 'MINGGU' ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCalcDurasiNilai(m)}
                        className={`py-3 rounded-xl border text-xs font-extrabold transition-all ${
                          calcDurasiNilai === m
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        {m} Minggu
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5">
                    {([1, 2, 3] as const).map((bln) => (
                      <button
                        key={bln}
                        type="button"
                        onClick={() => setCalcDurasiNilai(bln)}
                        className={`py-3.5 rounded-2xl border text-sm font-extrabold transition-all ${
                          calcDurasiNilai === bln
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        {bln} Bulan
                      </button>
                    ))}
                  </div>
                )}
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
                    Kategori {calcKategori} • {quotation?.labelDurasi || `${calcDurasiNilai} ${calcTipeDurasi}`}
                  </span>
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                  Rp {quotation?.totalHarga.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  Tarif: Rp {quotation?.hargaPerSatuan.toLocaleString('id-ID')} / {calcTipeDurasi === 'HARI' ? 'hari' : calcTipeDurasi === 'MINGGU' ? 'minggu' : 'bulan'}
                </p>
              </div>

              <div className="text-xs text-blue-100 space-y-2 pt-4 border-t border-white/20">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                  <span>Jemput langsung ke lokasi Anda di Padang</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                  <span>Dokumentasi fisik foto 360° & segel barcode aman</span>
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
              Daftar Tarif Lengkap SafeTitip Kota Padang
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase">
                  <tr>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Kapasitas Barang</th>
                    <th className="p-3.5 text-center">Harian (Per Hari)</th>
                    <th className="p-3.5 text-center">Mingguan (Per Pekan)</th>
                    <th className="p-3.5 text-center">Bulanan (Paket 1 Bln)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-blue-700 flex items-center gap-1.5">
                      <span>📦</span> Kategori A
                    </td>
                    <td className="p-3.5 text-slate-600">Dus buku, pakaian, mini kit (≤3 item)</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">Rp 10.000</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">Rp 55.000</td>
                    <td className="p-3.5 text-center font-extrabold text-blue-700 bg-blue-50/50">Rp 199.000</td>
                  </tr>
                  <tr className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-indigo-700 flex items-center gap-1.5">
                      <span>❄️</span> Kategori B
                    </td>
                    <td className="p-3.5 text-slate-600">Kulkas mini, kasur lipat (4–7 item)</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">Rp 18.000</td>
                    <td className="p-3.5 text-center font-bold text-slate-900">Rp 95.000</td>
                    <td className="p-3.5 text-center font-extrabold text-indigo-700 bg-indigo-50/50">Rp 299.000</td>
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
