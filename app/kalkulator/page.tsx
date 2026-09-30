'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HARGA } from '@/lib/constants/harga';

export default function KalkulatorPage() {
  const [calcKategori, setCalcKategori] = useState<'A' | 'B'>('A');
  const [calcDurasi, setCalcDurasi] = useState<1 | 2 | 3>(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Halaman Simulasi Biaya
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kalkulator & Tabel Harga Resmi
          </h1>
          <p className="text-sm text-slate-600">
            Ketahui estimasi biaya penitipan barang secara transparan tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Kalkulator Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Pilih Kategori Barang
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcKategori('A')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      calcKategori === 'A'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900">Kategori A</p>
                    <p className="text-xs text-slate-500 mt-1">Dus buku, pakaian, elektronik kecil (≤ 3 item)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcKategori('B')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      calcKategori === 'B'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900">Kategori B</p>
                    <p className="text-xs text-slate-500 mt-1">Kulkas mini, kasur lipat, volume 4–7 item</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  2. Pilih Durasi Penitipan (Bulan)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as const).map((bln) => (
                    <button
                      key={bln}
                      type="button"
                      onClick={() => setCalcDurasi(bln)}
                      className={`py-3.5 rounded-xl border text-sm font-bold transition-all ${
                        calcDurasi === bln
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {bln} Bulan
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Estimasi Resmi</span>
                  <span className="text-xs font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-200">
                    Kategori {calcKategori} • {calcDurasi} Bulan
                  </span>
                </div>
                <p className="text-4xl font-extrabold text-blue-700 tracking-tight mt-3">
                  Rp {HARGA[calcKategori][calcDurasi].toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Rata-rata: Rp {Math.round(HARGA[calcKategori][calcDurasi] / calcDurasi).toLocaleString('id-ID')} / bulan
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-4 border-t border-blue-200/80">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Sudah termasuk jemput langsung ke kamar kos</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Dokumentasi kondisi foto 360° & segel unik</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Gudang bersih, palet kayu, dan bebas banjir</span>
                </p>
              </div>

              <Link
                href="/booking"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-bold shadow-md shadow-blue-600/25 transition-all"
              >
                Lanjutkan Booking dengan Paket Ini →
              </Link>
            </div>

          </div>

          {/* Full Price Table */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Tabel Perbandingan Harga Flat Rate
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                  <tr>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Kapasitas Barang</th>
                    <th className="p-3 text-center">1 Bulan</th>
                    <th className="p-3 text-center">2 Bulan</th>
                    <th className="p-3 text-center">3 Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-blue-700">Kategori A</td>
                    <td className="p-3 text-slate-600">Dus buku, pakaian, elektronik kecil (≤3 item)</td>
                    <td className="p-3 text-center font-bold">Rp 199.000</td>
                    <td className="p-3 text-center font-bold">Rp 379.000</td>
                    <td className="p-3 text-center font-bold">Rp 499.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-700">Kategori B</td>
                    <td className="p-3 text-slate-600">Kulkas mini, kasur lipat, volume 4–7 item</td>
                    <td className="p-3 text-center font-bold">Rp 299.000</td>
                    <td className="p-3 text-center font-bold">Rp 499.000</td>
                    <td className="p-3 text-center font-bold">Rp 699.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-amber-700">Custom</td>
                    <td className="p-3 text-slate-600">Sepeda motor, kendaraan, & volume &gt;7 item</td>
                    <td className="p-3 text-center font-bold text-slate-500" colSpan={3}>
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
