'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';
import { HARGA } from '@/lib/constants/harga';

export default function Home() {
  // Tanggal hari ini dalam format YYYY-MM-DD lokal untuk membatasi input tanggal lampau (A-04)
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    noWa: '',
    lokasiPickup: '',
    tanggalPickup: '',
    durasiBulan: 1,
    campusArea: 'tembalang',
  });

  const [items, setItems] = useState<Array<{ nama: string; jumlah: number }>>([
    { nama: '', jumlah: 1 },
  ]);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Kalkulator Mandiri State
  const [calcKategori, setCalcKategori] = useState<'A' | 'B'>('A');
  const [calcDurasi, setCalcDurasi] = useState<1 | 2 | 3>(1);

  // Live Classification & Quotation (Dievaluasi real-time sebelum submit)
  const liveClassification = useMemo(() => {
    const validItems = items.filter((i) => i.nama.trim().length > 0);
    if (validItems.length === 0) {
      return {
        kategori: 'BELUM_ADA',
        alasan: 'Masukkan minimal satu nama barang untuk melihat estimasi.',
        quotation: null,
      };
    }

    const klas = klasifikasiBarang(validItems);
    if (klas.kategori === 'REJECT') {
      return {
        kategori: 'REJECT',
        alasan: klas.alasan,
        quotation: null,
      };
    }

    if (klas.kategori === 'CUSTOM') {
      return {
        kategori: 'CUSTOM',
        alasan: klas.alasan,
        quotation: null,
      };
    }

    const quot = hitungQuotation(klas.kategori as 'A' | 'B', formData.durasiBulan as 1 | 2 | 3);
    return {
      kategori: klas.kategori,
      alasan: klas.alasan,
      quotation: quot,
    };
  }, [items, formData.durasiBulan]);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { nama: '', jumlah: 1 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Quick Preset Helper untuk mempermudah saat demo skenario A-01, A-02, A-03
  const applyPreset = (type: 'A01' | 'A02' | 'A03' | 'A04') => {
    if (type === 'A01') {
      setFormData((prev) => ({
        ...prev,
        nama: 'Budi Santoso (Demo A-01)',
        noWa: '081234567890',
        durasiBulan: 1,
        lokasiPickup: 'Kos Putra Barokah, Jl. Prof Sudarto No. 10',
        tanggalPickup: todayStr,
      }));
      setItems([{ nama: 'dus buku', jumlah: 2 }]);
      setAgreeTerms(true);
    } else if (type === 'A02') {
      setFormData((prev) => ({
        ...prev,
        nama: 'Dewi Lestari (Demo A-02)',
        noWa: '085712345678',
        durasiBulan: 1,
        lokasiPickup: 'Kos Putri Melati, Pogung Baru Blok C',
        tanggalPickup: todayStr,
      }));
      setItems([{ nama: 'kulkas mini', jumlah: 1 }]);
      setAgreeTerms(true);
    } else if (type === 'A03') {
      setFormData((prev) => ({
        ...prev,
        nama: 'Rian Pratama (Demo A-03)',
        noWa: '081398765432',
        durasiBulan: 1,
        lokasiPickup: 'Kos Wijaya, Sekaran No. 5',
        tanggalPickup: todayStr,
      }));
      setItems([{ nama: 'motor vario', jumlah: 1 }]);
      setAgreeTerms(true);
    } else if (type === 'A04') {
      // Set tanggal lampau
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        nama: 'Test Validasi (Demo A-04)',
        noWa: '081234567890',
        durasiBulan: 1,
        lokasiPickup: 'Kos Coba',
        tanggalPickup: yesterdayStr,
      }));
      setItems([{ nama: 'dus pakaian', jumlah: 1 }]);
      setAgreeTerms(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi Skenario A-04 di sisi client
    if (!formData.tanggalPickup) {
      setError('Tanggal penjemputan wajib diisi.');
      return;
    }
    if (formData.tanggalPickup < todayStr) {
      setError('Tanggal penjemputan tidak boleh tanggal lampau (Skenario A-04).');
      return;
    }
    const hasEmptyItem = items.some((i) => !i.nama.trim() || Number(i.jumlah) < 1);
    if (hasEmptyItem) {
      setError('Semua barang harus memiliki nama dan jumlah minimal 1.');
      return;
    }

    if (liveClassification.kategori === 'REJECT') {
      setError(`Pemesanan ditolak: ${liveClassification.alasan}`);
      return;
    }

    if (!agreeTerms) {
      setError('Harap setujui simulasi harga dan ketentuan layanan terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          durasiBulan: Number(formData.durasiBulan),
          lokasiPickup: `[${formData.campusArea}] ${formData.lokasiPickup}`,
          items: items.map((i) => ({ nama: i.nama.trim(), jumlah: Number(i.jumlah) })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (data.errors ? data.errors.join(', ') : 'Terjadi kesalahan'));
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim data booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HEADER & NAVIGATION BAR MODERN & BERSIH                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">inventory_2</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                    Safe<span className="text-blue-600">Titip</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 mt-1">
                    Express & Care • MVP Pilot
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
              <a
                href="#beranda"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-white rounded-full transition-all"
              >
                Beranda
              </a>
              <a
                href="#kalkulator"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-white rounded-full transition-all"
              >
                Simulasi Harga
              </a>
              <a
                href="#booking-form"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-white rounded-full transition-all"
              >
                Form Booking
              </a>
              <a
                href="#keamanan"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-white rounded-full transition-all"
              >
                Keamanan SOP
              </a>
              <a
                href="#faq"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-white rounded-full transition-all"
              >
                FAQ
              </a>
            </nav>

            {/* Header Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-sm font-bold shadow-xs hover:border-slate-300 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Dashboard Admin</span>
              </Link>

              <a
                href="#booking-form"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span>Booking Sekarang</span>
              </a>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href="/admin"
                className="p-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Admin
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Menu"
              >
                <span className="material-symbols-outlined text-[28px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              Beranda
            </a>
            <a
              href="#kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              Simulasi Harga
            </a>
            <a
              href="#booking-form"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              Form Booking
            </a>
            <a
              href="#keamanan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              Keamanan SOP
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/admin"
                className="w-full py-2.5 text-center rounded-xl bg-slate-100 text-slate-800 font-bold text-sm"
              >
                Dashboard Admin
              </Link>
              <a
                href="#booking-form"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-blue-600 text-white font-bold text-sm"
              >
                Booking Sekarang
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION & TRUST METRICS                                           */}
      {/* ========================================================================= */}
      <section id="beranda" className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              {/* Badge Status */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>MVP Sprint 3-Day • Khusus Mahasiswa Libur Semester</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Titip Barang Kos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-blue-600">Lebih Aman</span>, Bebas Bayar Kos Kosong.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Solusi cerdas bagi mahasiswa saat mudik liburan semester. Layanan jemput langsung ke kamar kos, 
                pengecekan kondisi foto & video, serta disimpan di gudang aman terjamin garansi.
              </p>

              {/* Quick Preset Buttons for Demo Evaluator */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">play_circle</span>
                    Uji Coba Cepat Kriteria Lulus MVP (Demo Mode):
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    A-01 s/d A-05 Ready
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      applyPreset('A01');
                      const el = document.getElementById('booking-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                  >
                    A-01: 2 Dus Buku (Kat A - Rp 199k)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyPreset('A02');
                      const el = document.getElementById('booking-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors"
                  >
                    A-02: 1 Kulkas (Kat B - Rp 299k)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyPreset('A03');
                      const el = document.getElementById('booking-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 transition-colors"
                  >
                    A-03: Motor (Custom Quotation)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      applyPreset('A04');
                      const el = document.getElementById('booking-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                  >
                    A-04: Tgl Lampau (Test Error)
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#booking-form"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 active:translate-y-0.5 transition-all"
                >
                  <span>Mulai Booking Penitipan</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
                <a
                  href="#kalkulator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-blue-600">calculate</span>
                  <span>Cek Simulasi Harga</span>
                </a>
              </div>

              {/* Key Features Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Jemput Kamar</p>
                    <p className="text-[11px] text-slate-500">Antar-jemput kos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Gudang Aman</p>
                    <p className="text-[11px] text-slate-500">CCTV & Segel Rapi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Harga Tetap</p>
                    <p className="text-[11px] text-slate-500">Mulai Rp 199.000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Live Price Calculator & Feature Highlight Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-3xl blur-lg opacity-25"></div>
                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                        Tabel Resmi MVP
                      </span>
                      <h3 className="font-extrabold text-xl text-slate-900">Skema Harga SafeTitip</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Flat Rate
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Kategori A Card */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          Kategori A (Barang Kecil & Sedang)
                        </span>
                        <span className="text-xs font-extrabold bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded">
                          ≤ 3 Dus / Item
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        Dus pakaian, buku, magic com, kipas angin kecil, perlengkapan kuliah.
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white rounded-xl border border-blue-100">
                          <p className="text-[10px] text-slate-500 font-semibold">1 Bulan</p>
                          <p className="text-xs font-extrabold text-blue-700">Rp 199.000</p>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-blue-100">
                          <p className="text-[10px] text-slate-500 font-semibold">2 Bulan</p>
                          <p className="text-xs font-extrabold text-blue-700">Rp 379.000</p>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-blue-100">
                          <p className="text-[10px] text-slate-500 font-semibold">3 Bulan</p>
                          <p className="text-xs font-extrabold text-blue-700">Rp 499.000</p>
                        </div>
                      </div>
                    </div>

                    {/* Kategori B Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                          Kategori B (Barang Besar / Elektronik)
                        </span>
                        <span className="text-xs font-extrabold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                          Kulkas / 4–7 Item
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        Kulkas mini, dispenser, mesin cuci, kasur lipat, volume barang 4–7 dus.
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <p className="text-[10px] text-slate-500 font-semibold">1 Bulan</p>
                          <p className="text-xs font-extrabold text-indigo-700">Rp 299.000</p>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <p className="text-[10px] text-slate-500 font-semibold">2 Bulan</p>
                          <p className="text-xs font-extrabold text-indigo-700">Rp 499.000</p>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <p className="text-[10px] text-slate-500 font-semibold">3 Bulan</p>
                          <p className="text-xs font-extrabold text-indigo-700">Rp 699.000</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <a
                      href="#booking-form"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                    >
                      <span>Langsung isi form & dapatkan konfirmasi instan</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIMULASI KALKULATOR MANDIRI                                            */}
      {/* ========================================================================= */}
      <section id="kalkulator" className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Kalkulator Mandiri
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Hitung Estimasi Biaya Penitipan
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Pilih kategori barang dan durasi waktu titip yang Anda rencanakan untuk melihat simulasi biaya resmi.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Opsi Kategori */}
              <div className="space-y-4">
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
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-sm text-slate-900">Kategori A</p>
                      <p className="text-xs text-slate-500 mt-0.5">Dus buku / Pakaian / ≤ 3 item</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcKategori('B')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        calcKategori === 'B'
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-sm text-slate-900">Kategori B</p>
                      <p className="text-xs text-slate-500 mt-0.5">Kulkas / Kasur / 4–7 item</p>
                    </button>
                  </div>
                </div>

                {/* Opsi Durasi */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    2. Durasi Penitipan (Bulan)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((bln) => (
                      <button
                        key={bln}
                        type="button"
                        onClick={() => setCalcDurasi(bln)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          calcDurasi === bln
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {bln} Bulan
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rincian Output Kalkulator */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase">Hasil Perhitungan</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Kategori {calcKategori} • {calcDurasi} Bulan
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-blue-700 tracking-tight mt-2">
                    Rp {HARGA[calcKategori][calcDurasi].toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Setara Rp {Math.round(HARGA[calcKategori][calcDurasi] / calcDurasi).toLocaleString('id-ID')} / bulan
                  </p>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
                  <p className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                    Termasuk penjemputan ke kamar kos
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                    Dokumentasi kondisi barang & segel rapi
                  </p>
                </div>

                <a
                  href="#booking-form"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, durasiBulan: calcDurasi }));
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold transition-colors"
                >
                  Pilih Paket Ini di Form Booking ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FORM BOOKING UTAMA DENGAN REAL-TIME QUOTATION PREVIEW & APPROVAL        */}
      {/* ========================================================================= */}
      <section id="booking-form" className="py-20 bg-slate-100/60 scroll-mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Form Booking Resmi MVP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pemesanan Penjemputan Barang
            </h2>
            <p className="text-sm text-slate-600">
              Lengkapi informasi kontak, jadwal penjemputan, dan daftar barang. Estimasi harga akan dihitung secara langsung sebelum booking dikirimkan.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* TAMPILAN JIKA BOOKING SUKSES TERKIRIM */}
            {result ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[42px]">check_circle</span>
                </div>

                <div>
                  <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold uppercase tracking-wide">
                    {result.booking?.kategori === 'CUSTOM' ? 'Booking Custom Diterima' : 'Booking Berhasil Terkonfirmasi'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    {result.booking?.kategori === 'CUSTOM'
                      ? 'Permintaan Kuotasi Khusus Masuk!'
                      : 'Slot Penjemputan Aman & Tersimpan! 🎉'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                    {result.booking?.kategori === 'CUSTOM'
                      ? 'Barang membutuhkan persetujuan khusus mentor/admin. Tim SafeTitip akan segera memverifikasi detail.'
                      : 'Data booking telah tersimpan di sistem dan dapat dicek langsung di halaman admin.'}
                  </p>
                </div>

                {/* Detail Bukti Pemesanan */}
                <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kode Booking</p>
                      <p className="font-mono text-lg font-extrabold text-blue-700">{result.booking?.kodeBooking}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status Awal</p>
                      <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-100 text-blue-800">
                        {result.booking?.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Nama Pelanggan:</p>
                      <p className="font-bold text-slate-900">{result.booking?.user?.nama || formData.nama}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Kontak WA:</p>
                      <p className="font-bold text-slate-900">{result.booking?.user?.noWa || formData.noWa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Kategori & Durasi:</p>
                      <p className="font-bold text-slate-900">
                        Kategori {result.booking?.kategori} • {result.booking?.durasiBulan} Bulan
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Estimasi Total Biaya:</p>
                      <p className="font-extrabold text-blue-700 text-base">
                        {result.booking?.totalHarga === 0
                          ? 'Dinegosiasikan Admin'
                          : `Rp ${result.booking?.totalHarga?.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Setelah Sukses */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/admin"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span>Lihat di Dashboard Admin</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setFormData({
                        nama: '',
                        noWa: '',
                        lokasiPickup: '',
                        tanggalPickup: '',
                        durasiBulan: 1,
                        campusArea: 'tembalang',
                      });
                      setItems([{ nama: '', jumlah: 1 }]);
                      setAgreeTerms(false);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold transition-colors"
                  >
                    Buat Booking Baru
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULIR UTAMA */
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                
                {/* Alert Error jika validasi gagal */}
                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                    <span className="material-symbols-outlined text-rose-600 mt-0.5">error</span>
                    <div className="text-sm">
                      <p className="font-bold">Periksa Kembali Data Anda:</p>
                      <p className="mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Bagian 1: Data Kontak & Identitas */}
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                    Identitas & Kontak Pemesan
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="nama">
                        Nama Lengkap Mahasiswa *
                      </label>
                      <input
                        id="nama"
                        required
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Contoh: Gilang Ramadhan"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="noWa">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        id="noWa"
                        required
                        type="tel"
                        name="noWa"
                        value={formData.noWa}
                        onChange={handleInputChange}
                        placeholder="Contoh: 081234567890"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Alamat & Jadwal Penjemputan */}
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                    Lokasi Kos & Jadwal Penjemputan
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="campusArea">
                        Wilayah Kampus *
                      </label>
                      <select
                        id="campusArea"
                        name="campusArea"
                        value={formData.campusArea}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      >
                        <option value="tembalang">Tembalang (UNDIP / Polines)</option>
                        <option value="pogung">Pogung & Kaliurang (UGM / UNY / UII)</option>
                        <option value="sekaran">Sekaran (UNNES)</option>
                        <option value="lainnya">Wilayah Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="tanggalPickup">
                        Tanggal Penjemputan * (A-04 Validasi)
                      </label>
                      <input
                        id="tanggalPickup"
                        required
                        type="date"
                        name="tanggalPickup"
                        min={todayStr}
                        value={formData.tanggalPickup}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="durasiBulan">
                        Durasi Penitipan *
                      </label>
                      <select
                        id="durasiBulan"
                        name="durasiBulan"
                        value={formData.durasiBulan}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold"
                      >
                        <option value={1}>1 Bulan</option>
                        <option value={2}>2 Bulan</option>
                        <option value={3}>3 Bulan</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="lokasiPickup">
                        Alamat Kos & Nomor Kamar *
                      </label>
                      <textarea
                        id="lokasiPickup"
                        required
                        rows={2}
                        name="lokasiPickup"
                        value={formData.lokasiPickup}
                        onChange={handleInputChange}
                        placeholder="Tuliskan nama kos, jalan, patokan, dan nomor kamar (contoh: Kos Melati, Jl. Banjarsari No. 12, Kamar 2B)"
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 3: Daftar Barang yang Dititipkan */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                      Daftar Barang yang Dititipkan
                    </h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Tambah Barang</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>

                        <div className="flex-1">
                          <input
                            required
                            type="text"
                            value={item.nama}
                            onChange={(e) => handleItemChange(idx, 'nama', e.target.value)}
                            placeholder="Nama barang (misal: 2 dus buku, kulkas mini, kipas angin, motor)"
                            className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                          />
                        </div>

                        <div className="w-24">
                          <input
                            required
                            type="number"
                            min={1}
                            value={item.jumlah}
                            onChange={(e) => handleItemChange(idx, 'jumlah', Number(e.target.value))}
                            className="w-full h-10 px-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                            title="Jumlah item"
                          />
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="w-10 h-10 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center transition-colors"
                            title="Hapus baris barang"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* Bagian 4: LIVE QUOTATION & SIMULASI HARGA SEBELUM SUBMIT  */}
                {/* (MEMENUHI SYARAT MUTLAK DOKUMEN MODUL P0)                  */}
                {/* ========================================================= */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/60 border-2 border-blue-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-700 text-[22px]">price_check</span>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        Simulasi Quotation Real-time (Sebelum Submit)
                      </h4>
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-xs">
                      Aturan Kode P0
                    </span>
                  </div>

                  {/* Kondisi Jika Terdeteksi Barang Terlarang (REJECT) */}
                  {liveClassification.kategori === 'REJECT' && (
                    <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 space-y-1">
                      <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                        <span className="material-symbols-outlined text-[18px]">block</span>
                        Ditolak Sistem (BR-A-P0-04)
                      </p>
                      <p className="text-xs">{liveClassification.alasan}</p>
                    </div>
                  )}

                  {/* Kondisi Jika Terdeteksi Kendaraan / Custom Quotation */}
                  {liveClassification.kategori === 'CUSTOM' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm flex items-center gap-1.5 text-amber-800">
                          <span className="material-symbols-outlined text-[18px]">support_agent</span>
                          Kuotasi Khusus (Perlu Verifikasi Admin)
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded font-extrabold bg-amber-200 text-amber-900">
                          CUSTOM
                        </span>
                      </div>
                      <p className="text-xs">{liveClassification.alasan}</p>
                      <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                        Estimasi biaya akhir akan dinegosiasikan dan disepakati bersama admin melalui WhatsApp setelah booking diajukan.
                      </p>
                    </div>
                  )}

                  {/* Kondisi Normal Kategori A atau B */}
                  {(liveClassification.kategori === 'A' || liveClassification.kategori === 'B') && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Klasifikasi:</span>
                            <span
                              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                                liveClassification.kategori === 'A'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              }`}
                            >
                              Kategori {liveClassification.kategori}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{liveClassification.alasan}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Durasi: <strong>{formData.durasiBulan} Bulan</strong>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500 uppercase font-semibold">Estimasi Total Biaya</p>
                          <p className="text-3xl font-extrabold text-blue-700 tracking-tight">
                            Rp {liveClassification.quotation?.totalHarga.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            (Rp {liveClassification.quotation?.hargaPerBulan.toLocaleString('id-ID')} / bulan)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Jika belum ada barang */}
                  {liveClassification.kategori === 'BELUM_ADA' && (
                    <div className="p-4 rounded-2xl bg-white/70 border border-dashed border-blue-200 text-center text-xs text-slate-500">
                      Tuliskan nama barang pada form di atas untuk melihat klasifikasi kategori (A/B) dan kalkulasi harga otomatis.
                    </div>
                  )}

                  {/* Checkbox Persetujuan Sesuai Syarat MVP */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                        Saya menyetujui rincian estimasi biaya di atas dan ketentuan penjemputan layanan SafeTitip Express & Care.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Tombol Kirim Form */}
                <div className="pt-2">
                  <button
                    disabled={loading || liveClassification.kategori === 'REJECT' || !agreeTerms}
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>{loading ? 'Menyimpan Booking...' : 'Kirim Booking Penitipan'}</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2">
                    *Data booking akan disimpan dan dapat diperiksa langsung di Dashboard Admin.
                  </p>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. KEAMANAN & SOP GUDANG                                                  */}
      {/* ========================================================================= */}
      <section id="keamanan" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Standar Operasional Prosedur
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              4 Jaminan Keamanan SafeTitip
            </h2>
            <p className="text-slate-600 text-sm">
              Kami memperlakukan setiap barang berharga Anda dengan standar penanganan logistik terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 font-bold">
                <span className="material-symbols-outlined text-[28px]">lock</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Segel Keamanan Barcode</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap dus dan barang elektronik disegel dengan stiker security seal ber-barcode unik anti-rusak.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                <span className="material-symbols-outlined text-[28px]">videocam</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Dokumentasi 360°</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Foto dan video kondisi awal barang dicatat bersama kurir sebelum dimasukkan ke dalam armada.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 font-bold">
                <span className="material-symbols-outlined text-[28px]">warehouse</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Gudang CCTV 24 Jam</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyimpanan di lokasi indoor kering, beralas palet kayu, bebas banjir, serta diawasi kamera CCTV aktif.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 font-bold">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-2">Garansi Kompensasi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klausul perlindungan resmi tercatat dalam dokumen perjanjian digital untuk kenyamanan mahasiswa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FAQ (PERTANYAAN UMUM)                                                  */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
              Bantuan & Panduan
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">help</span>
                Bagaimana cara menentukan apakah barang saya masuk Kategori A atau B?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Kategori A diperuntukkan untuk maksimal 3 dus/item kecil seperti pakaian, buku, atau elektronik kecil (kipas mini/magic com). Jika ada barang besar seperti kulkas mini atau total item 4 hingga 7 dus, otomatis masuk Kategori B.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">help</span>
                Apakah sepeda motor bisa dititipkan?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Sepeda motor dialihkan ke skema Custom Quotation karena memerlukan penanganan khusus (inspeksi fisik, pelepasan aki, dan dokumen legal STNK).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">help</span>
                Barang apa saja yang dilarang untuk dititipkan?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Sesuai aturan keamanan BR-A-P0-04, SafeTitip secara ketat menolak makanan mudah busuk, uang tunai, perhiasan berharga tinggi, hewan peliharaan, serta narkotika dan senjata tajam/api.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">SafeTitip</span>
              <span className="text-xs text-slate-500">| 3-Day MVP Sprint Inatechno Batch 9</span>
            </div>

            <p className="text-xs text-slate-500 text-center md:text-right">
              &copy; 2026 Tim A (Gilang, Fauzan, Hasan, Vania). Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}