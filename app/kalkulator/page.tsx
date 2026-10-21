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
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B14] font-sans flex flex-col justify-between selection:bg-[#B86B35] selection:text-white">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold uppercase tracking-wider border border-[#EBD8C6]">
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Simulasi Biaya Fleksibel
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2A1B14] tracking-tight">
            Kalkulator Tarif Harian, Mingguan & Bulanan
          </h1>
          <p className="text-sm text-[#705E54]">
            Hitung biaya titip barang secara instan tanpa biaya tersembunyi di seluruh Kota Padang.
          </p>
        </div>

        {/* Kalkulator Card Visual Grid */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E8DDD3] shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#705E54] mb-2">
                  1. Pilih Kategori Barang
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcKategori('A')}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      calcKategori === 'A'
                        ? 'border-[#B86B35] bg-[#F6ECE1] ring-2 ring-[#B86B35]/30 shadow-md'
                        : 'border-[#E8DDD3] bg-[#FAF6F0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-extrabold text-sm text-[#2A1B14]">Kategori A</p>
                      <span className="material-symbols-outlined text-[#B86B35] text-[20px]">inventory_2</span>
                    </div>
                    <p className="text-[11px] text-[#705E54]">Dus buku, pakaian, mini kit (≤ 3 item)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcKategori('B')}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      calcKategori === 'B'
                        ? 'border-[#B86B35] bg-[#F6ECE1] ring-2 ring-[#B86B35]/30 shadow-md'
                        : 'border-[#E8DDD3] bg-[#FAF6F0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-extrabold text-sm text-[#2A1B14]">Kategori B</p>
                      <span className="material-symbols-outlined text-[#B86B35] text-[20px]">kitchen</span>
                    </div>
                    <p className="text-[11px] text-[#705E54]">Kulkas mini, kasur lipat (4–7 item)</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#705E54] mb-2">
                  2. Pilih Satuan Durasi
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F6ECE1]/70 rounded-2xl border border-[#EBD8C6]">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTipeDurasi('HARI');
                      setCalcDurasiNilai(1);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      calcTipeDurasi === 'HARI'
                        ? 'bg-[#B86B35] text-white shadow-xs'
                        : 'text-[#705E54] hover:text-[#2A1B14]'
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
                        ? 'bg-[#B86B35] text-white shadow-xs'
                        : 'text-[#705E54] hover:text-[#2A1B14]'
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
                        ? 'bg-[#B86B35] text-white shadow-xs'
                        : 'text-[#705E54] hover:text-[#2A1B14]'
                    }`}
                  >
                    Bulanan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#705E54] mb-2">
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
                            ? 'bg-[#B86B35] text-white border-[#B86B35] shadow-md'
                            : 'bg-[#FAF6F0] text-[#421E0B] border-[#E8DDD3] hover:bg-white'
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
                            ? 'bg-[#B86B35] text-white border-[#B86B35] shadow-md'
                            : 'bg-[#FAF6F0] text-[#421E0B] border-[#E8DDD3] hover:bg-white'
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
                            ? 'bg-[#B86B35] text-white border-[#B86B35] shadow-md shadow-[#B86B35]/25 scale-[1.02]'
                            : 'bg-[#FAF6F0] text-[#421E0B] border-[#E8DDD3] hover:bg-white'
                        }`}
                      >
                        {bln} Bulan
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Visual Guarantee Perks */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold text-[#705E54]">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF6F0] border border-[#E8DDD3]">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  <span>Palet Kayu Bebas Banjir</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF6F0] border border-[#E8DDD3]">
                  <span className="material-symbols-outlined text-[#E69526] text-[18px]">videocam</span>
                  <span>CCTV 24 Jam Non-Stop</span>
                </div>
              </div>
            </div>

            {/* Output Panel with Animated Gradient */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#B86B35] via-[#A85E2B] to-[#1E1510] text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E69526]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#F6ECE1] uppercase tracking-wider">Estimasi Resmi</span>
                  <span className="text-xs font-extrabold text-[#7E3F18] bg-[#F6ECE1] px-3 py-1 rounded-full">
                    Kategori {calcKategori} • {quotation?.labelDurasi || `${calcDurasiNilai} ${calcTipeDurasi}`}
                  </span>
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                  Rp {quotation?.totalHarga.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-[#F6ECE1] mt-1">
                  Tarif: Rp {quotation?.hargaPerSatuan.toLocaleString('id-ID')} / {calcTipeDurasi === 'HARI' ? 'hari' : calcTipeDurasi === 'MINGGU' ? 'minggu' : 'bulan'}
                </p>
              </div>

              <div className="text-xs text-[#F6ECE1] space-y-2 pt-4 border-t border-white/20">
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
                className="w-full py-4 rounded-2xl bg-white hover:bg-[#FAF6F0] text-[#7E3F18] text-center text-sm font-extrabold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Booking Penjemputan Paket Ini →
              </Link>
            </div>

          </div>

          {/* Full Price Table with Modern Striping */}
          <div className="pt-6 border-t border-[#E8DDD3]">
            <h3 className="font-extrabold text-sm text-[#2A1B14] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B86B35] text-[20px]">table_chart</span>
              Daftar Tarif Lengkap Kosinaja Kota Padang
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E8DDD3] rounded-2xl overflow-hidden">
                <thead className="bg-[#F6ECE1] text-[#7E3F18] font-extrabold uppercase">
                  <tr>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Kapasitas Barang</th>
                    <th className="p-3.5 text-center">Harian (Per Hari)</th>
                    <th className="p-3.5 text-center">Mingguan (Per Pekan)</th>
                    <th className="p-3.5 text-center">Bulanan (Paket 1 Bln)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD3]">
                  <tr className="hover:bg-[#F6ECE1]/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-[#B86B35] flex items-center gap-1.5">
                      <span>📦</span> Kategori A
                    </td>
                    <td className="p-3.5 text-[#705E54]">Dus buku, pakaian, mini kit (≤3 item)</td>
                    <td className="p-3.5 text-center font-bold text-[#2A1B14]">Rp 10.000</td>
                    <td className="p-3.5 text-center font-bold text-[#2A1B14]">Rp 55.000</td>
                    <td className="p-3.5 text-center font-extrabold text-[#B86B35] bg-[#F6ECE1]/50">Rp 199.000</td>
                  </tr>
                  <tr className="hover:bg-[#F6ECE1]/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-[#9B5424] flex items-center gap-1.5">
                      <span>❄️</span> Kategori B
                    </td>
                    <td className="p-3.5 text-[#705E54]">Kulkas mini, kasur lipat (4–7 item)</td>
                    <td className="p-3.5 text-center font-bold text-[#2A1B14]">Rp 18.000</td>
                    <td className="p-3.5 text-center font-bold text-[#2A1B14]">Rp 95.000</td>
                    <td className="p-3.5 text-center font-extrabold text-[#9B5424] bg-[#F6ECE1]/50">Rp 299.000</td>
                  </tr>
                  <tr className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-amber-700 flex items-center gap-1.5">
                      <span>🏍️</span> Custom
                    </td>
                    <td className="p-3.5 text-[#705E54]">Sepeda motor & volume &gt;7 item</td>
                    <td className="p-3.5 text-center font-bold text-[#705E54]" colSpan={3}>
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
