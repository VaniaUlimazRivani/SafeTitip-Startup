'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PriceRow {
  durasi: string;
  durasiType: 'harian' | 'mingguan' | 'bulanan';
  hargaA: number;
  hargaB: number;
  skemaLamaBox: string;
  skemaLamaBesar: string;
  periodeLamaBox: string;
  periodeLamaBesar: string;
  hematA?: string;
  hematB?: string;
  isPopular?: boolean;
}

const PRICE_DATA: PriceRow[] = [
  // Harian (1 - 7 hari)
  { durasi: '1 Hari', durasiType: 'harian', hargaA: 10000, hargaB: 18000, skemaLamaBox: 'Rp 10.000 – Rp 60.000', skemaLamaBesar: 'Rp 20.000 – Rp 50.000', periodeLamaBox: 'Harian', periodeLamaBesar: 'Harian' },
  { durasi: '2 Hari', durasiType: 'harian', hargaA: 20000, hargaB: 36000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '3 Hari', durasiType: 'harian', hargaA: 30000, hargaB: 54000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '4 Hari', durasiType: 'harian', hargaA: 40000, hargaB: 72000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '5 Hari', durasiType: 'harian', hargaA: 50000, hargaB: 90000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '6 Hari', durasiType: 'harian', hargaA: 60000, hargaB: 108000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '7 Hari', durasiType: 'harian', hargaA: 70000, hargaB: 126000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  
  // Mingguan (1 - 4 minggu)
  { durasi: '1 Minggu', durasiType: 'mingguan', hargaA: 55000, hargaB: 95000, skemaLamaBox: 'Rp 40.000 – Rp 230.000', skemaLamaBesar: 'Rp 100.000 – Rp 250.000', periodeLamaBox: 'Mingguan', periodeLamaBesar: 'Mingguan' },
  { durasi: '2 Minggu', durasiType: 'mingguan', hargaA: 110000, hargaB: 190000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '3 Minggu', durasiType: 'mingguan', hargaA: 165000, hargaB: 285000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },
  { durasi: '4 Minggu', durasiType: 'mingguan', hargaA: 220000, hargaB: 380000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-' },

  // Bulanan (1 - 3 bulan)
  { durasi: '1 Bulan', durasiType: 'bulanan', hargaA: 199000, hargaB: 299000, skemaLamaBox: 'Rp 45.000 – Rp 550.000', skemaLamaBesar: 'Rp 160.000 – Rp 450.000', periodeLamaBox: 'Bulanan', periodeLamaBesar: 'Bulanan', isPopular: true },
  { durasi: '2 Bulan', durasiType: 'bulanan', hargaA: 379000, hargaB: 499000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-', hematA: 'Hemat Rp 19.000', hematB: 'Hemat Rp 99.000', isPopular: true },
  { durasi: '3 Bulan', durasiType: 'bulanan', hargaA: 499000, hargaB: 699000, skemaLamaBox: '-', skemaLamaBesar: '-', periodeLamaBox: '-', periodeLamaBesar: '-', hematA: 'Hemat Rp 98.000', hematB: 'Hemat Rp 198.000', isPopular: true },
];

export default function PriceListPage() {
  const [selectedKategori, setSelectedKategori] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [selectedDurasiType, setSelectedDurasiType] = useState<'ALL' | 'harian' | 'mingguan' | 'bulanan'>('ALL');
  const [showKomparasi, setShowKomparasi] = useState<boolean>(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredData = PRICE_DATA.filter((item) => {
    if (selectedDurasiType === 'ALL') return true;
    return item.durasiType === selectedDurasiType;
  });

  const faqs = [
    {
      q: 'Apakah tarif 2 dan 3 bulan memakai harga paket khusus?',
      a: 'Ya, benar sekali! Sesuai skema resmi Kosinaja, tarif untuk 2 bulan dan 3 bulan menggunakan harga paket hemat khusus, bukan hasil perkalian matematis. Misalnya Kategori A 3 bulan hanya Rp 499.000 (jauh lebih hemat daripada 3x Rp 199.000 = Rp 597.000, hemat Rp 98.000!).',
    },
    {
      q: 'Apa perbedaan mendasar Kategori A dan Kategori B?',
      a: 'Kategori A diperuntukkan bagi barang ringkas & kardus (maksimal 3 item), seperti dus buku, koper pakaian, dan perkakas mini. Sedangkan Kategori B mencakup barang sedang hingga besar furniture (4 s/d 7 item), seperti kasur lipat/gulung, kulkas mini, dispenser, rak sepatu, dan meja lipat.',
    },
    {
      q: 'Apa maksud skema lama Kosinaja (Box S-XL & Barang Besar)?',
      a: 'Sebelumnya penitipan dihitung eceran per kotak (Box S–XL) atau per unit furniture besar. Dengan skema baru Kategori A & B, biaya jauh lebih terjangkau, transparan, dan tidak lagi membebani mahasiswa dengan hitungan per satuan dimensi yang rumit.',
    },
    {
      q: 'Apakah ada biaya tambahan untuk antar-jemput barang?',
      a: 'Kami menyediakan layanan jemput barang langsung ke kamar kos Anda di seluruh Kota Padang (UNAND Limau Manis, UNP Air Tawar, UPI YPTK Lubeg, UBH Ulak Karang, dan sekitarnya). Biaya jemput & antar sangat ekonomis dan transparan saat booking.',
    },
    {
      q: 'Bagaimana SOP keamanan barang saya selama dititipkan?',
      a: 'Semua barang melalui protokol segel barcode anti-bongkar, dokumentasi foto saat serah terima, disimpan di atas pallet kayu anti-lembab, serta diawasi CCTV gudang tertutup 24 jam.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B14] font-sans flex flex-col justify-between selection:bg-[#B86B35] selection:text-white">
      <Navbar />

      <main className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* HERO TITLE SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold uppercase tracking-wider border border-[#EBD8C6] shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-[#B86B35]">sell</span>
            Tarif Resmi Kosinaja 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2A1B14] tracking-tight leading-tight">
            Price List & Komparasi Tarif Penitipan Barang
          </h1>
          <p className="text-sm sm:text-base text-[#705E54] leading-relaxed max-w-2xl mx-auto">
            Biaya penitipan barang kos transparan, ramah kantong mahasiswa di Kota Padang. Dapatkan diskon harga paket spesial untuk durasi 2 dan 3 bulan!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/booking"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#B86B35] to-[#E69526] text-white font-extrabold text-sm shadow-lg shadow-[#B86B35]/25 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Pesan Sekarang
            </Link>
            <Link
              href="/kalkulator"
              className="px-6 py-3 rounded-2xl bg-white border border-[#E8DDD3] text-[#421E0B] font-extrabold text-sm hover:bg-[#F6ECE1] hover:border-[#DCBEA3] transition-all flex items-center gap-2 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#B86B35]">calculate</span>
              Buka Simulasi Biaya
            </Link>
          </div>
        </section>

        {/* 2 MAIN CATEGORY HIGHLIGHT CARDS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Kategori A */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E8DDD3] hover:border-[#B86B35] transition-all shadow-lg flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#F6ECE1] text-[#7E3F18] border border-[#DCBEA3] mb-2">
                    Kategori A
                  </span>
                  <h2 className="text-2xl font-black text-[#2A1B14]">Barang Ringkas & Box</h2>
                  <p className="text-xs text-[#705E54] mt-0.5">Kecil – Menengah (Maksimal 3 Item)</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">inventory_2</span>
                </div>
              </div>

              {/* Price Preview */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#705E54]">Mulai Harian</span>
                  <span className="text-lg font-black text-[#2A1B14]">Rp 10.000 <span className="text-xs font-normal text-[#705E54]">/hari</span></span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8DDD3] pt-2">
                  <span className="text-xs font-bold text-[#705E54]">Paket Mingguan</span>
                  <span className="text-lg font-black text-[#2A1B14]">Rp 55.000 <span className="text-xs font-normal text-[#705E54]">/minggu</span></span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8DDD3] pt-2">
                  <span className="text-xs font-bold text-[#B86B35]">Paket 1 Bulan</span>
                  <span className="text-xl font-black text-[#B86B35]">Rp 199.000 <span className="text-xs font-normal text-[#705E54]">/bulan</span></span>
                </div>
              </div>

              {/* Items included */}
              <div className="space-y-2.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#705E54]">Contoh Barang yang Masuk:</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#421E0B]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Dus Buku / Indomie
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Koper / Tas Pakaian
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Perkakas Mini & Alat Tulis
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Elektronik Ringkas
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E8DDD3] flex items-center justify-between">
              <span className="text-xs text-[#705E54] font-medium">Paket 3 Bulan: <strong className="text-[#2A1B14]">Rp 499.000</strong></span>
              <Link
                href="/booking"
                className="text-xs font-extrabold text-[#B86B35] hover:text-[#9B5424] inline-flex items-center gap-1"
              >
                Pilih Kategori A
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Card Kategori B */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#B86B35] shadow-xl flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B86B35] to-[#E69526] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Pilihan Favorit Mahasiswa
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#F6ECE1] text-[#7E3F18] border border-[#DCBEA3] mb-2">
                    Kategori B
                  </span>
                  <h2 className="text-2xl font-black text-[#2A1B14]">Barang Sedang – Besar</h2>
                  <p className="text-xs text-[#705E54] mt-0.5">Furniture & Elektronik (4 – 7 Item)</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] text-white flex items-center justify-center font-bold shadow-md shadow-[#B86B35]/30 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">kitchen</span>
                </div>
              </div>

              {/* Price Preview */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#705E54]">Mulai Harian</span>
                  <span className="text-lg font-black text-[#2A1B14]">Rp 18.000 <span className="text-xs font-normal text-[#705E54]">/hari</span></span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8DDD3] pt-2">
                  <span className="text-xs font-bold text-[#705E54]">Paket Mingguan</span>
                  <span className="text-lg font-black text-[#2A1B14]">Rp 95.000 <span className="text-xs font-normal text-[#705E54]">/minggu</span></span>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8DDD3] pt-2">
                  <span className="text-xs font-bold text-[#B86B35]">Paket 1 Bulan</span>
                  <span className="text-xl font-black text-[#B86B35]">Rp 299.000 <span className="text-xs font-normal text-[#705E54]">/bulan</span></span>
                </div>
              </div>

              {/* Items included */}
              <div className="space-y-2.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#705E54]">Contoh Barang yang Masuk:</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#421E0B]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Kulkas Mini / 1 Pintu
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Kasur Lipat / Busa Gulung
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Dispenser & Galon
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B86B35]">check_circle</span>
                    Meja Belajar / Rak Sepatu
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E8DDD3] flex items-center justify-between">
              <span className="text-xs text-[#705E54] font-medium">Paket 3 Bulan: <strong className="text-[#B86B35]">Rp 699.000 (Hemat Rp 198rb)</strong></span>
              <Link
                href="/booking"
                className="text-xs font-extrabold text-[#B86B35] hover:text-[#9B5424] inline-flex items-center gap-1"
              >
                Pilih Kategori B
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* PROMO CALLOUT BANNER - PAKET HEMAT 2 & 3 BULAN */}
        <section className="rounded-3xl bg-gradient-to-r from-[#2A1B14] via-[#421E0B] to-[#2A1B14] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#B86B35]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B86B35]/30 text-[#E69526] text-xs font-extrabold uppercase tracking-wider border border-[#B86B35]/40">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                Keuntungan Paket Libur Semester
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Harga Paket Khusus untuk 2 Bulan & 3 Bulan!
              </h3>
              <p className="text-xs sm:text-sm text-[#C4B2A3] max-w-2xl leading-relaxed">
                Biaya untuk 2 dan 3 bulan tidak dihitung perkalian kaku! Kami memberikan diskon harga paket spesial hingga <strong className="text-[#E69526]">Rp 198.000</strong> agar liburan Anda tenang tanpa bayar uang sewa kos jutaan rupiah.
              </p>
            </div>
            <Link
              href="/booking"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#B86B35] to-[#E69526] text-white font-black text-sm whitespace-nowrap shadow-lg shadow-black/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              Klaim Paket Liburan
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </Link>
          </div>
        </section>

        {/* INTERACTIVE PRICE TABLE SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#B86B35]">
                Tabel Lengkap & Transparan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2A1B14]">
                Perbandingan Rincian Tarif & Skema Lama
              </h2>
              <p className="text-xs sm:text-sm text-[#705E54] mt-1">
                Bandingkan skema baru Kosinaja (Kategori A & B) dengan skema sebelumnya.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 bg-[#F6ECE1] rounded-2xl border border-[#EBD8C6]">
                {(['ALL', 'harian', 'mingguan', 'bulanan'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedDurasiType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedDurasiType === type
                        ? 'bg-[#B86B35] text-white shadow-xs'
                        : 'text-[#705E54] hover:text-[#2A1B14]'
                    }`}
                  >
                    {type === 'ALL' ? 'Semua Durasi' : type}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowKomparasi(!showKomparasi)}
                className={`px-3 py-2 rounded-2xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                  showKomparasi
                    ? 'bg-white border-[#B86B35] text-[#B86B35] shadow-xs'
                    : 'bg-[#F6ECE1] border-[#EBD8C6] text-[#705E54]'
                }`}
                title="Tampilkan kolom perbandingan skema sebelumnya"
              >
                <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                {showKomparasi ? 'Sembunyikan Skema Lama' : 'Lihat Skema Lama'}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-3xl bg-white border border-[#E8DDD3] shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F6ECE1] text-[#421E0B] border-b border-[#E8DDD3]">
                    <th className="py-4 px-4 sm:px-6 font-black uppercase tracking-wider text-[11px]">Durasi</th>
                    <th className="py-4 px-4 sm:px-6 font-black uppercase tracking-wider text-[11px] bg-[#EBD8C6]/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#B86B35]"></span>
                        Kosinaja Kategori A
                      </div>
                      <span className="block text-[10px] font-normal text-[#705E54] normal-case mt-0.5">Maks. 3 Item Ringkas/Box</span>
                    </th>
                    <th className="py-4 px-4 sm:px-6 font-black uppercase tracking-wider text-[11px] bg-[#EBD8C6]/80">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E69526]"></span>
                        Kosinaja Kategori B
                      </div>
                      <span className="block text-[10px] font-normal text-[#705E54] normal-case mt-0.5">4 – 7 Item Sedang/Besar</span>
                    </th>
                    {showKomparasi && (
                      <>
                        <th className="py-4 px-4 sm:px-6 font-bold uppercase tracking-wider text-[11px] text-[#705E54] border-l border-[#E8DDD3]">
                          Skema Lama: Paket Box
                          <span className="block text-[10px] font-normal text-[#8C7A6D] normal-case mt-0.5">Box S, M, L, XL</span>
                        </th>
                        <th className="py-4 px-4 sm:px-6 font-bold uppercase tracking-wider text-[11px] text-[#705E54]">
                          Skema Lama: Barang Besar
                          <span className="block text-[10px] font-normal text-[#8C7A6D] normal-case mt-0.5">Per unit (kasur/lemari/meja)</span>
                        </th>
                      </>
                    )}
                    <th className="py-4 px-4 sm:px-6 font-black uppercase tracking-wider text-[11px] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD3]/70">
                  {filteredData.map((row, idx) => {
                    const isBulananHighlight = row.durasiType === 'bulanan';
                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-[#FAF6F0] transition-colors ${
                          row.isPopular ? 'bg-[#FFFDF9]' : ''
                        }`}
                      >
                        {/* Durasi */}
                        <td className="py-4 px-4 sm:px-6 font-bold text-[#2A1B14] whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-[#B86B35]">
                              {row.durasiType === 'harian' ? 'today' : row.durasiType === 'mingguan' ? 'date_range' : 'event_available'}
                            </span>
                            <span>{row.durasi}</span>
                            {row.durasiType === 'bulanan' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#F6ECE1] text-[#7E3F18]">
                                Paket
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Kategori A */}
                        <td className="py-4 px-4 sm:px-6 font-extrabold text-[#2A1B14] bg-[#EBD8C6]/20 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-sm sm:text-base font-black text-[#B86B35]">
                              {formatRupiah(row.hargaA)}
                            </span>
                            {row.hematA && (
                              <div className="inline-block ml-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {row.hematA}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Kategori B */}
                        <td className="py-4 px-4 sm:px-6 font-extrabold text-[#2A1B14] bg-[#EBD8C6]/30 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="text-sm sm:text-base font-black text-[#421E0B]">
                              {formatRupiah(row.hargaB)}
                            </span>
                            {row.hematB && (
                              <div className="inline-block ml-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                {row.hematB}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Skema Lama Komparasi */}
                        {showKomparasi && (
                          <>
                            <td className="py-4 px-4 sm:px-6 text-[#705E54] border-l border-[#E8DDD3] whitespace-nowrap">
                              {row.skemaLamaBox !== '-' ? (
                                <span className="font-semibold text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                                  {row.skemaLamaBox}
                                </span>
                              ) : (
                                <span className="text-slate-300 italic text-xs">–</span>
                              )}
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-[#705E54] whitespace-nowrap">
                              {row.skemaLamaBesar !== '-' ? (
                                <span className="font-semibold text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                                  {row.skemaLamaBesar}
                                </span>
                              ) : (
                                <span className="text-slate-300 italic text-xs">–</span>
                              )}
                            </td>
                          </>
                        )}

                        {/* Action CTA */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <Link
                            href="/booking"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F6ECE1] hover:bg-[#B86B35] text-[#7E3F18] hover:text-white font-extrabold text-xs transition-colors"
                          >
                            Pesan
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Note footer inside table */}
            <div className="p-4 sm:p-5 bg-[#FAF6F0] border-t border-[#E8DDD3] text-xs text-[#705E54] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#B86B35] shrink-0 mt-0.5">info</span>
              <div>
                <p className="font-bold text-[#2A1B14]">
                  Catatan Resmi Skema Harga Kosinaja:
                </p>
                <p className="mt-0.5">
                  Harga Kosinaja (Kategori A dan B) untuk durasi 2 dan 3 bulan memakai harga paket hemat resmi, bukan hasil perkalian matematis. Kolom skema lama yang bertanda strip (–) berarti harga pada skema sebelumnya tidak disebutkan secara spesifik melainkan menggunakan rentang periode harian/mingguan/bulanan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON BENEFIT GRID (Mengapa Skema Baru Lebih Untung) */}
        <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E8DDD3] shadow-md space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#B86B35]">Kelebihan Skema Kosinaja</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2A1B14]">
              Mengapa Skema Kategori Jauh Lebih Hemat?
            </h3>
            <p className="text-xs sm:text-sm text-[#705E54]">
              Dibandingkan menghitung per kardus atau per unit furnitur yang mahal dan rumit, skema paket baru memberikan kenyamanan maksimal bagi mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
              <h4 className="font-extrabold text-sm text-[#2A1B14]">Bebas Biaya Per Item Mahal</h4>
              <p className="text-xs text-[#705E54] leading-relaxed">
                Anda cukup memilih Kategori A (hingga 3 barang) atau Kategori B (hingga 7 barang). Tidak ada lagi hitungan dimensi senti per senti yang membingungkan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <h4 className="font-extrabold text-sm text-[#2A1B14]">Jemput & Antar ke Kamar Kos</h4>
              <p className="text-xs text-[#705E54] leading-relaxed">
                Tim kurir Kosinaja siap menjemput barang langsung ke kamar kos Anda di Limau Manis, Pauh, Air Tawar, Jati, hingga Lubuk Begalung.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <h4 className="font-extrabold text-sm text-[#2A1B14]">Segel Barcode & Gudang Terjaga</h4>
              <p className="text-xs text-[#705E54] leading-relaxed">
                Setiap barang disegel stiker barcode anti-buka dengan berita acara digital. Disimpan aman bebas tikus, rayap, dan banjir.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#B86B35]">Pertanyaan Umum</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2A1B14]">
              FAQ Seputar Tarif & Price List
            </h3>
            <p className="text-xs sm:text-sm text-[#705E54]">
              Hal-hal yang sering ditanyakan mahasiswa mengenai perhitungan biaya penitipan.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-[#E8DDD3] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-[#2A1B14] hover:bg-[#FAF6F0] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`material-symbols-outlined text-[20px] text-[#B86B35] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-[#705E54] leading-relaxed border-t border-[#F6ECE1] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM FINAL CALL TO ACTION */}
        <section className="rounded-3xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Siap Liburan Tanpa Pusing Sewa Kos Kosong?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Titipkan barang berharga Anda di Kosinaja sekarang. Dapatkan kuota gudang terbatas untuk masa liburan semester ini!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/booking"
              className="px-8 py-3.5 rounded-2xl bg-[#2A1B14] text-white font-black text-sm hover:bg-[#421E0B] shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">assignment_add</span>
              Form Booking Online
            </Link>
            <Link
              href="/kalkulator"
              className="px-8 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm border border-white/40 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              Hitung di Kalkulator
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
