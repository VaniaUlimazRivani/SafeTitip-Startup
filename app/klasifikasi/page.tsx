'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  klasifikasiDanValidasi,
  Barang,
  HasilKlasifikasi,
} from '../../Lib/klasifikasi';
import {
  deteksiOtomatisBarang,
  PRESET_SKENARIO,
  KATALOG_BARANG_KOS,
  BarangItemUI,
} from '../../Lib/utils/klasifikasiHelper';

export default function KlasifikasiPage() {
  const router = useRouter();
  const simulatorRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);

  // State daftar barang di simulator
  const [items, setItems] = useState<BarangItemUI[]>([
    {
      id: 'item-1',
      nama: 'Kipas Angin Meja',
      tipe: 'KECIL_ELEKTRONIK',
      isKecilPengecualian: true,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
      jumlah: 1,
    },
    {
      id: 'item-2',
      nama: 'Koper Pakaian Mahasiswa',
      tipe: 'PAKAIAN',
      isKecilPengecualian: false,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
      jumlah: 1,
    },
  ]);

  // Durasi simulasi untuk estimasi harga
  const [durasiSimulasi, setDurasiSimulasi] = useState<1 | 2 | 3>(1);

  // Filter pencarian untuk tabel panduan barang kos
  const [searchCatalog, setSearchCatalog] = useState('');

  // Hitung total jumlah barang
  const totalJumlah = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.jumlah) || 1), 0);
  }, [items]);

  // Eksekusi fungsi klasifikasi resmi dari Lib/klasifikasi.ts
  const hasilKlasifikasi: HasilKlasifikasi = useMemo(() => {
    const daftarBarangExpanded: Barang[] = [];
    items.forEach((item) => {
      const count = Number(item.jumlah) || 1;
      for (let i = 0; i < count; i++) {
        daftarBarangExpanded.push({
          nama: item.nama || 'Barang tanpa nama',
          tipe: item.tipe,
          isKecilPengecualian: item.isKecilPengecualian,
          isKendaraanBermotor: item.isKendaraanBermotor,
          isTerlarangAtauBusuk: item.isTerlarangAtauBusuk,
        });
      }
    });

    return klasifikasiDanValidasi({
      totalJumlahBarang: totalJumlah,
      daftarBarang: daftarBarangExpanded,
    });
  }, [items, totalJumlah]);

  // Handler update barang
  const updateItem = (id: string, updates: Partial<BarangItemUI>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if ('nama' in updates && updates.nama !== undefined) {
            const detected = deteksiOtomatisBarang(updates.nama);
            return {
              ...updated,
              ...detected,
            };
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newItem: BarangItemUI = {
      id: `item-${Date.now()}`,
      nama: '',
      tipe: 'PAKAIAN',
      jumlah: 1,
      isKecilPengecualian: false,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const addQuickItem = (nama: string, jumlah: number = 1) => {
    const detected = deteksiOtomatisBarang(nama);
    const newItem: BarangItemUI = {
      id: `item-${Date.now()}`,
      nama,
      tipe: detected.tipe || 'PAKAIAN',
      isKecilPengecualian: detected.isKecilPengecualian || false,
      isKendaraanBermotor: detected.isKendaraanBermotor || false,
      isTerlarangAtauBusuk: detected.isTerlarangAtauBusuk || false,
      jumlah,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_SKENARIO.find((p) => p.id === presetId);
    if (preset) {
      setItems(
        preset.items.map((it, idx) => ({
          ...it,
          id: `preset-${idx}-${Date.now()}`,
          isKecilPengecualian: (it as any).isKecilPengecualian || false,
          isKendaraanBermotor: (it as any).isKendaraanBermotor || false,
          isTerlarangAtauBusuk: (it as any).isTerlarangAtauBusuk || false,
        }))
      );
    }
  };

  const resetItems = () => {
    setItems([
      {
        id: `item-${Date.now()}`,
        nama: '',
        tipe: 'PAKAIAN',
        jumlah: 1,
        isKecilPengecualian: false,
        isKendaraanBermotor: false,
        isTerlarangAtauBusuk: false,
      },
    ]);
  };

  // Navigasi ke Form Booking (localStorage prefill)
  const handleProceedToBooking = () => {
    if (hasilKlasifikasi.kategori === 'REJECT') {
      alert('Perhatian: Barang yang termasuk kategori REJECT tidak dapat diajukan penitipan.');
      return;
    }

    try {
      const payload = items.map((i) => ({
        nama: i.nama || 'Barang Titipan',
        jumlah: i.jumlah,
      }));
      localStorage.setItem('safetitip_prefilled_items', JSON.stringify(payload));
      localStorage.setItem('safetitip_prefilled_durasi', String(durasiSimulasi));
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRules = () => {
    rulesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper theme hasil kategori (light mode clean matching the reference)
  const getCategoryTheme = (kategori: HasilKlasifikasi['kategori']) => {
    switch (kategori) {
      case 'KATEGORI_A':
        return {
          title: 'KATEGORI A',
          sub: 'Kapasitas Ringan (Volume 1–3 Item)',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          cardBorder: 'border-emerald-300 bg-emerald-50/40',
          textColor: 'text-emerald-700',
          icon: '🎒',
        };
      case 'KATEGORI_B':
        return {
          title: 'KATEGORI B',
          sub: 'Kapasitas Sedang / Ada Barang Besar (Volume 4–7)',
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
          cardBorder: 'border-sky-300 bg-sky-50/40',
          textColor: 'text-sky-700',
          icon: '📦',
        };
      case 'CUSTOM_QUOTATION':
        return {
          title: 'CUSTOM QUOTATION',
          sub: 'Volume > 7 Item atau Kendaraan Bermotor',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          cardBorder: 'border-amber-300 bg-amber-50/40',
          textColor: 'text-amber-800',
          icon: '🛵',
        };
      case 'REJECT':
        return {
          title: 'REJECT / DITOLAK',
          sub: 'Barang Terlarang atau Mudah Busuk/Rusak',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          cardBorder: 'border-rose-300 bg-rose-50/40',
          textColor: 'text-rose-700',
          icon: '🚫',
        };
    }
  };

  const currentTheme = getCategoryTheme(hasilKlasifikasi.kategori);

  // Estimasi harga
  const hargaKategoriA: Record<number, number> = { 1: 199000, 2: 379000, 3: 499000 };
  const hargaKategoriB: Record<number, number> = { 1: 299000, 2: 499000, 3: 699000 };

  const getEstimatedPrice = () => {
    if (hasilKlasifikasi.kategori === 'KATEGORI_A') return hargaKategoriA[durasiSimulasi];
    if (hasilKlasifikasi.kategori === 'KATEGORI_B') return hargaKategoriB[durasiSimulasi];
    return null;
  };

  const filteredCatalog = KATALOG_BARANG_KOS.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      item.status.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      item.rule.toLowerCase().includes(searchCatalog.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans p-3 sm:p-6 lg:p-8">
      {/* Outer Dotted Blueprint Blueprint Frame as shown in user reference image */}
      <div className="relative max-w-7xl mx-auto rounded-[28px] border-2 border-dashed border-[#0284c7] p-2 sm:p-4 bg-white/40">
        
        {/* Subtle 'klasifikasi' blueprint label at top left */}
        <span className="absolute -top-3.5 left-6 bg-[#f8fafc] px-3 py-0.5 text-xs font-mono font-bold text-slate-400 select-none">
          klasifikasi
        </span>

        {/* Main Clean Canvas Container */}
        <div className="bg-white rounded-[22px] border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* ========================================================
              1. NAVBAR (Identical to the Reference Image)
             ======================================================== */}
          <nav className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
            {/* Logo SafeTitip with Express & Care Pill */}
            <div className="flex items-center gap-2.5">
              <Link href="/" className="flex items-center gap-2">
                {/* Logo Mark */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#0f766e] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  ST
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  SafeTitip
                </span>
              </Link>

              {/* Mint Green Pill Badge 'Express & Care' */}
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                Express & Care
              </span>
            </div>

            {/* Menu Links */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-[#0284c7] transition-colors">
                Beranda
              </Link>
              <Link href="/klasifikasi" className="text-[#0369a1] font-bold border-b-2 border-[#0369a1] pb-0.5">
                Klasifikasi Barang
              </Link>
              <button onClick={scrollToSimulator} className="hover:text-[#0284c7] transition-colors">
                Kalkulator Harga
              </button>
              <button onClick={scrollToRules} className="hover:text-[#0284c7] transition-colors">
                Keamanan & Aturan
              </button>
              <Link href="/" className="hover:text-[#0284c7] transition-colors">
                Pesan
              </Link>
            </div>

            {/* Right Buttons: Pesan Slot & User Avatar */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                id="btn-pesan-slot-navbar"
                className="px-5 py-2.5 rounded-xl bg-[#0369a1] hover:bg-[#0284c7] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                Pesan Slot
              </Link>

              <Link
                href="/admin"
                id="btn-user-avatar"
                title="Dashboard Admin"
                className="w-9 h-9 rounded-full bg-[#0369a1] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </nav>

          {/* ========================================================
              2. HERO SECTION (Identical Layout & Components to Image)
             ======================================================== */}
          <section className="px-6 lg:px-10 py-10 lg:py-14 grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, CTA, and 3 Feature Cards (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pilot Resmi Spesialis Kos Mahasiswa Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold uppercase tracking-wider border border-[#a7f3d0]">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                PILOT RESMI SPESIALIS KOS MAHASISWA
              </div>

              {/* Bold Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-slate-900 leading-[1.14]">
                Titip Barang Kos Lebih Aman, <br />
                Bebas Rugi Kos Kosong.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Layanan jemput ke kamar, penanganan khusus barang besar, diawasi dengan video 360°, dan divalidasi otomatis sesuai <strong className="text-slate-900">Business Rules P0 (v1.4)</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  id="btn-cek-estimasi-harga"
                  onClick={scrollToSimulator}
                  className="px-6 py-3.5 rounded-xl bg-[#0369a1] hover:bg-[#0284c7] text-white font-bold text-sm shadow-md shadow-sky-900/10 flex items-center gap-2.5 transition-all active:scale-95"
                >
                  {/* Grid / Calculator Icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  <span>Cek Estimasi Harga</span>
                </button>

                <button
                  type="button"
                  id="btn-jelajahi-keamanan"
                  onClick={scrollToRules}
                  className="px-6 py-3.5 rounded-xl bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] font-bold text-sm transition-all flex items-center gap-1.5"
                >
                  <span>Jelajahi Fitur Keamanan</span>
                  <span>&rarr;</span>
                </button>
              </div>

              {/* 3 Value Feature Cards Row (Identical to reference image) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
                {/* Feature 1 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5 hover:border-slate-300 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                    {/* Door / Handcart Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="5" y="3" width="14" height="18" rx="2" />
                      <circle cx="9" cy="12" r="1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">100% Jemput Kamar</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      Tak perlu repot gotong barang koper keluar gang kosan sempit.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5 hover:border-slate-300 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#d1fae5] text-[#059669] flex items-center justify-center">
                    {/* Snowflake / AC Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Bebas Lembap & Rayap</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      Gudang ber-AC sentral & palet sirkulasi mikro bebas jamur.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5 hover:border-slate-300 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#ede9fe] text-[#6366f1] flex items-center justify-center">
                    {/* Shield / Guarantee Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Garansi Ganti Rugi</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      Kompensasi tertulis sah s.d 100% nilai pertanggungan barang.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Frame with Courier Photo & Floating Badges (Col 5) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0284c7] via-[#0f766e] to-slate-900 p-2 shadow-2xl shadow-sky-900/15">
                
                {/* Photo Layer */}
                <div className="relative w-full h-full rounded-[26px] overflow-hidden">
                  <Image
                    src="/courier_campus_storage.jpg"
                    alt="SafeTitip Campus Couriers in Warehouse"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/20"></div>
                </div>

                {/* Floating Glassmorphism Badge 1 (Top Left) */}
                <div className="absolute top-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span>CCTV ONLINE 24 JAM</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Penyimpanan Terpantau Sentral Kampus
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    {/* Camera Icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                      <rect x="3" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </div>
                </div>

                {/* Floating Glassmorphism Badge 2 (Bottom) */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d1fae5] text-[#059669] flex items-center justify-center shrink-0">
                    {/* Graduation Cap Icon */}
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a10.97 10.97 0 01-.25 2.449c-.58.334-1 1.05-1 1.884 0 1.105.895 2 2 2h8c1.105 0 2-.895 2-2 0-.834-.42-1.55-1-1.884a10.97 10.97 0 01-.25-2.449l2.644-1.131a1 1 0 000-1.84l-7-3zM10 4.214L14.167 6 10 7.786 5.833 6 10 4.214zM8 12.28a9.025 9.025 0 004 0v1.44a1 1 0 01-1.447.894L10 14.382l-.553.276A1 1 0 018 13.72v-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      1.480+ <span className="text-[#059669] font-bold">Mahasiswa Aktif</span>
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      Terlayani aman selama libur semester genap & ganjil lalu.
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </section>

          {/* ========================================================
              3. CALLOUT BANNER (Matching the Green Banner in Image)
             ======================================================== */}
          <section className="px-6 lg:px-10 pb-8">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {/* Mint Green Box with Savings / Piggy Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#d1fae5] text-[#059669] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    Mau tahu berapa hematnya dibanding bayar kos kosong selama liburan?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Rata-rata mahasiswa hemat Rp 1.200.000 hingga Rp 3.500.000 sekali masa libur panjang.
                  </p>
                </div>
              </div>

              {/* Deep Green Action Button */}
              <button
                type="button"
                id="btn-coba-kalkulator"
                onClick={scrollToSimulator}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#065f46] hover:bg-[#047857] text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Coba Kalkulator Sekarang</span>
                <span>&rsaquo;</span>
              </button>
            </div>
          </section>

          {/* ========================================================
              4. INTERACTIVE CLASSIFICATION SIMULATOR & ENGINE (P0 v1.4)
             ======================================================== */}
          <section ref={simulatorRef} className="px-6 lg:px-10 py-10 bg-[#f8fafc] border-t border-slate-200/80 space-y-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e0f2fe] text-[#0284c7] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>⚙️</span> MODUL KLASIFIKASI & VALIDASI RULE P0 (v1.4)
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Simulator Klasifikasi & Validasi Barang
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                  Simulasikan barang kos Anda secara real-time untuk melihat penentuan kategori otomatis (A, B, Custom), deteksi barang terlarang (*BR-A-P0-04*), dan kebutuhan persetujuan mentor (*BR-A-P0-04a*).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetItems}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Kosongkan Input
                </button>
              </div>
            </div>

            {/* 1-Click Preset Strip */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                ⚡ Uji Coba Cepat Kasus Nyata (1-Click Test Scenarios):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {PRESET_SKENARIO.map((preset) => (
                  <button
                    key={preset.id}
                    id={`btn-preset-${preset.id}`}
                    onClick={() => loadPreset(preset.id)}
                    className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition-all text-left group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase block w-fit mb-1 bg-slate-100 text-slate-700 border border-slate-200">
                        {preset.tag}
                      </span>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0284c7] transition-colors line-clamp-1">
                        {preset.label}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 line-clamp-1">
                      {preset.deskripsi}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Column: Left = Item Form, Right = Evaluation Result */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Barang (Col 7) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <span>📋</span> Daftar Barang Bawaan Mahasiswa
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ketik nama barang untuk auto-detect kategori atau ubah flag secara manual.
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    totalJumlah <= 3
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : totalJumlah <= 7
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {totalJumlah} Barang
                  </span>
                </div>

                {/* Quick Add Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tambah Cepat Barang Kos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '+ Kipas Meja', nama: 'Kipas Angin Meja' },
                      { label: '+ Kulkas Mini', nama: 'Kulkas Mini' },
                      { label: '+ Motor Honda Beat', nama: 'Motor Honda Beat' },
                      { label: '+ Rice Cooker', nama: 'Rice Cooker Mini' },
                      { label: '+ Kasur Busa', nama: 'Kasur Busa Single' },
                      { label: '+ Dus Baju', nama: 'Dus Pakaian' },
                      { label: '+ Durian/Makanan', nama: 'Durian Busuk Makanan' },
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addQuickItem(chip.nama)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3.5">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200/90 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-mono font-bold mt-2">
                          {index + 1}
                        </span>

                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Nama Barang
                          </label>
                          <input
                            id={`sim-item-nama-${index}`}
                            type="text"
                            value={item.nama}
                            onChange={(e) => updateItem(item.id, { nama: e.target.value })}
                            placeholder="Contoh: Kulkas mini, Motor Beat, Koper Baju..."
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                          />
                        </div>

                        <div className="w-20">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Jumlah
                          </label>
                          <input
                            id={`sim-item-jumlah-${index}`}
                            type="number"
                            min="1"
                            max="20"
                            value={item.jumlah}
                            onChange={(e) => updateItem(item.id, { jumlah: Math.max(1, Number(e.target.value)) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                          />
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-6 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus barang"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Dropdown Type & Flags */}
                      <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Tipe Barang
                          </label>
                          <select
                            id={`sim-item-tipe-${index}`}
                            value={item.tipe}
                            onChange={(e) => updateItem(item.id, { tipe: e.target.value as any })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                          >
                            <option value="PAKAIAN">PAKAIAN (Koper, Dus Baju, Buku)</option>
                            <option value="KECIL_ELEKTRONIK">KECIL_ELEKTRONIK (Kipas, Rice Cooker)</option>
                            <option value="BESAR_ELEKTRONIK">BESAR_ELEKTRONIK (Kulkas, TV, Kasur)</option>
                            <option value="KENDARAAN">KENDARAAN (Sepeda Motor)</option>
                            <option value="LAINNYA">LAINNYA (Perlengkapan Umum)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Flag Aturan Khusus (BR-A-P0)
                          </label>

                          {item.tipe === 'KECIL_ELEKTRONIK' && (
                            <label className="flex items-center gap-2 text-xs text-emerald-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!item.isKecilPengecualian}
                                onChange={(e) => updateItem(item.id, { isKecilPengecualian: e.target.checked })}
                                className="rounded border-slate-300 text-[#059669] focus:ring-0"
                              />
                              <span>Pengecualian Sah Kat. A (BR-A-P0-02a)</span>
                            </label>
                          )}

                          {(item.tipe === 'KENDARAAN' || item.isKendaraanBermotor) && (
                            <label className="flex items-center gap-2 text-xs text-amber-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!item.isKendaraanBermotor}
                                onChange={(e) => updateItem(item.id, { isKendaraanBermotor: e.target.checked })}
                                className="rounded border-slate-300 text-amber-600 focus:ring-0"
                              />
                              <span>Kendaraan Bermotor (BR-A-P0-04a)</span>
                            </label>
                          )}

                          <label className="flex items-center gap-2 text-xs text-rose-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!item.isTerlarangAtauBusuk}
                              onChange={(e) => updateItem(item.id, { isTerlarangAtauBusuk: e.target.checked })}
                              className="rounded border-slate-300 text-rose-600 focus:ring-0"
                            />
                            <span>Barang Terlarang / Makanan Busuk (BR-A-P0-04)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Item Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    id="btn-tambah-barang-sim"
                    onClick={addItem}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>+</span> Tambah Barang Lain
                  </button>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500">
                      Batas Pikap Standar: <strong>{totalJumlah}/7 Barang</strong>
                    </span>
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all ${
                          totalJumlah <= 3
                            ? 'bg-[#10b981]'
                            : totalJumlah <= 7
                            ? 'bg-[#0284c7]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (totalJumlah / 7) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Hasil Evaluasi Klasifikasi Real-Time (Col 5) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6 lg:sticky lg:top-8">
                
                {/* Header Hasil */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Hasil Evaluasi Sistem:
                    </span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border uppercase ${currentTheme.badgeBg}`}>
                      {hasilKlasifikasi.status}
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${currentTheme.cardBorder} flex items-center gap-3.5`}>
                    <span className="text-3xl">{currentTheme.icon}</span>
                    <div>
                      <h3 className={`text-xl font-extrabold tracking-tight ${currentTheme.textColor}`}>
                        {currentTheme.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {currentTheme.sub}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mentor Approval Requirement Box */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  hasilKlasifikasi.membutuhkanPersetujuanMentor
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <span className="text-base">
                    {hasilKlasifikasi.membutuhkanPersetujuanMentor ? '⚠️' : '✅'}
                  </span>
                  <div>
                    <div className="font-bold">
                      {hasilKlasifikasi.membutuhkanPersetujuanMentor
                        ? 'Membutuhkan Persetujuan Mentor (Approval Required)'
                        : 'Disetujui Otomatis oleh Sistem'}
                    </div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      {hasilKlasifikasi.membutuhkanPersetujuanMentor
                        ? 'Kendaraan bermotor atau volume > 7 wajib divalidasi mentor SafeTitip.'
                        : 'Barang memenuhi syarat aman tanpa eskalasi peninjauan.'}
                    </div>
                  </div>
                </div>

                {/* Formal Rule Message */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Penjelasan Rule Resmi (BR-A-P0):
                  </span>
                  <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                    {hasilKlasifikasi.pesan}
                  </p>
                </div>

                {/* Checklist Rules Check */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Audit Pemeriksaan Aturan Bisnis:
                  </span>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">BR-A-P0-04: Cek Barang Terlarang / Makanan</span>
                      {items.some((i) => i.isTerlarangAtauBusuk) ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          TRIGGERED (REJECT)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Lolos
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">BR-A-P0-04a & 10: Kendaraan / Volume &gt; 7</span>
                      {items.some((i) => i.isKendaraanBermotor || i.tipe === 'KENDARAAN') || totalJumlah > 7 ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          CUSTOM (MENTOR)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          Normal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-600">BR-A-P0-02 & 02a: Alokasi Kategori</span>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        {hasilKlasifikasi.kategori}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Simulation & Proceed Action */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Simulasi Tarif Penitipan:
                    </span>
                    {hasilKlasifikasi.kategori !== 'REJECT' && hasilKlasifikasi.kategori !== 'CUSTOM_QUOTATION' && (
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                        {[1, 2, 3].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setDurasiSimulasi(m as any)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                              durasiSimulasi === m
                                ? 'bg-[#0369a1] text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {m} Bln
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {hasilKlasifikasi.kategori === 'REJECT' ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center font-semibold">
                      Pengajuan ditolak. Barang terlarang/busuk tidak dapat disimpan demi keselamatan.
                    </div>
                  ) : hasilKlasifikasi.kategori === 'CUSTOM_QUOTATION' ? (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                      <div className="font-bold">Skema Kuotasi Custom</div>
                      <p className="text-[11px] text-amber-800/90">
                        Admin & mentor SafeTitip akan mengirimkan rincian tarif via WhatsApp sesuai kapasitas armada tambahan.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-500">Total Tarif ({durasiSimulasi} Bulan)</div>
                        <div className="text-2xl font-black text-[#0369a1]">
                          Rp {getEstimatedPrice()?.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase">Tarif / Bulan</div>
                        <div className="text-sm font-bold text-slate-700">
                          Rp {Math.round((getEstimatedPrice() || 0) / durasiSimulasi).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proceed to Booking Button */}
                  {hasilKlasifikasi.kategori !== 'REJECT' ? (
                    <button
                      type="button"
                      id="btn-lanjutkan-booking-hasil"
                      onClick={handleProceedToBooking}
                      className="w-full py-3.5 rounded-xl bg-[#0369a1] hover:bg-[#0284c7] text-white font-bold text-sm shadow-md shadow-sky-900/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <span>Gunakan Barang Ini di Form Booking</span>
                      <span>&rarr;</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed text-center"
                    >
                      Ditolak Otomatis (Hapus Barang Terlarang)
                    </button>
                  )}
                </div>

              </div>

            </div>
          </section>

          {/* ========================================================
              5. ATURAN BISNIS P0 MATRIX & CATALOG (Rules Reference)
             ======================================================== */}
          <section ref={rulesRef} className="px-6 lg:px-10 py-10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold uppercase tracking-wider mb-2">
                <span>📖</span> KAMUS RESMI BUSINESS RULES P0
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Pedoman Aturan Klasifikasi & Standar Keamanan SafeTitip
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Ketetapan resmi untuk menjaga keamanan fasilitas penitipan mahasiswa kos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                  BR-A-P0-04 • REJECT
                </span>
                <h3 className="font-bold text-sm text-slate-900">Barang Terlarang & Busuk</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Makanan basah, hewan, uang tunai, perhiasan emas, dan narkoba/senjata ditolak otomatis demi keamanan gudang.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                  BR-A-P0-04a • MENTOR
                </span>
                <h3 className="font-bold text-sm text-slate-900">Kendaraan Bermotor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sepeda motor (Beat, Vario, dll) dialihkan ke skema Custom Quotation dan wajib persetujuan mentor untuk cek fisik & STNK.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                  BR-A-P0-10 • CUSTOM
                </span>
                <h3 className="font-bold text-sm text-slate-900">Kapasitas &gt; 7 Barang</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Melebihi 7 barang melampaui kapasitas 1 armada standar pikap SafeTitip, membutuhkan persetujuan mentor & armada tambahan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  BR-A-P0-02 & 02a • KATEGORI
                </span>
                <h3 className="font-bold text-sm text-slate-900">Barang Besar & Pengecualian</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kulkas/kasur otomatis Kategori B. Kipas angin meja & rice cooker mini diizinkan masuk Kategori A jika &le; 3 barang.
                </p>
              </div>
            </div>

            {/* Dorm Catalog Table */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-base text-slate-900">
                  Katalog Referensi Barang Kos Mahasiswa
                </h3>
                <div className="w-full sm:w-64">
                  <input
                    id="input-cari-katalog"
                    type="text"
                    value={searchCatalog}
                    onChange={(e) => setSearchCatalog(e.target.value)}
                    placeholder="Cari: kulkas, motor, kipas..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Nama Barang Kos</th>
                      <th className="px-4 py-3">Tipe</th>
                      <th className="px-4 py-3">Status Klasifikasi</th>
                      <th className="px-4 py-3">Rujukan Rule</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCatalog.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">{row.nama}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{row.tipe}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{row.rule}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => addQuickItem(row.nama)}
                            className="px-2.5 py-1 rounded-lg bg-[#e0f2fe] hover:bg-[#0284c7] text-[#0284c7] hover:text-white font-bold text-[11px] transition-colors"
                          >
                            + Tambah
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ========================================================
              6. BOTTOM TRUST BADGES (Identical to 3 Items in Image)
             ======================================================== */}
          <section className="px-6 lg:px-10 py-10 border-t border-slate-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Badge 1 */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#d1fae5] text-[#059669] flex items-center justify-center shrink-0">
                  {/* Shield Checkmark */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    100% Custody Safety Guarantee
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Perlindungan komprehensif & asuransi penitipan barang anak kos.
                  </p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0">
                  {/* Smart Lock */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                    <circle cx="12" cy="16" r="1.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Smart Locker OTP Lock
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Sistem loker digital anti-bobol dengan enkripsi 6-digit PIN.
                  </p>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#d1fae5] text-[#059669] flex items-center justify-center shrink-0">
                  {/* Support Headset */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M3 18v-6a9 9 0 0118 0v6" />
                    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Support Mahasiswa 24/7
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Layanan bantuan darurat di seluruh area kampus binaan.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              7. FOOTER (Matching the Reference Image)
             ======================================================== */}
          <footer className="px-6 lg:px-10 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; 2024 SafeTitip Express & Care. Solusi Logistik & Penitipan Anak Kos Amanah.
            </div>
            <div className="flex items-center gap-3">
              <Link href="#" className="hover:text-slate-800 transition-colors">
                Kebijakan Privasi
              </Link>
              <span>&bull;</span>
              <Link href="#" className="hover:text-slate-800 transition-colors">
                Syarat Layanan
              </Link>
              <span>&bull;</span>
              <Link href="#" className="hover:text-slate-800 transition-colors">
                Bantuan Kampus
              </Link>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
