'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';
import { TipeDurasi } from '@/lib/constants/harga';

export default function BookingPage() {
  const router = useRouter();

  // Tanggal hari ini lokal YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const [formData, setFormData] = useState({
    nama: '',
    noWa: '',
    lokasiPickup: '',
    tanggalPickup: '',
    tipeDurasi: 'BULAN' as TipeDurasi,
    durasiNilai: 1,
    durasiBulan: 1,
    campusArea: 'pauh',
    customArea: '',
  });

  const [items, setItems] = useState<Array<{ nama: string; jumlah: number }>>([
    { nama: '', jumlah: 1 },
  ]);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectingToRegister, setRedirectingToRegister] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load User Session & Restore Draft Pemesanan (jika pengguna baru selesai mendaftar)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let user: any = null;
      const savedUser = localStorage.getItem('safetitip_user_session');
      if (savedUser) {
        try {
          user = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (e) {
          user = null;
        }
      }

      // Periksa apakah ada draf booking yang tersimpan sebelumnya
      const savedDraft = sessionStorage.getItem('safetitip_draft_booking');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          if (parsedDraft.formData) {
            setFormData({
              ...parsedDraft.formData,
              nama: user?.nama || parsedDraft.formData.nama || '',
              noWa: user?.noWa || parsedDraft.formData.noWa || '',
              lokasiPickup: parsedDraft.formData.lokasiPickup || user?.alamat || '',
              tipeDurasi: parsedDraft.formData.tipeDurasi || 'BULAN',
              durasiNilai: parsedDraft.formData.durasiNilai || 1,
            });
          }
          if (parsedDraft.items && parsedDraft.items.length > 0) {
            setItems(parsedDraft.items);
          }
        } catch (e) {}
      } else if (user) {
        // Jika tidak ada draft tapi user sudah login, isi data profil awal
        setFormData((prev) => ({
          ...prev,
          nama: prev.nama || user.nama || '',
          noWa: prev.noWa || user.noWa || '',
          lokasiPickup: prev.lokasiPickup || user.alamat || '',
        }));
      }
    }
  }, []);

  const handleUserLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('safetitip_user_session');
    }
    setCurrentUser(null);
  };

  // Live Classification & Quotation (Sebelum Submit)
  const liveClassification = useMemo(() => {
    const validItems = items.filter((i) => i.nama.trim().length > 0);
    if (validItems.length === 0) {
      return {
        kategori: 'BELUM_ADA',
        alasan: 'Masukkan minimal satu nama barang untuk melihat estimasi biaya otomatis.',
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

    const quot = hitungQuotation(
      klas.kategori as 'A' | 'B',
      formData.durasiNilai,
      formData.tipeDurasi
    );

    return {
      kategori: klas.kategori,
      alasan: klas.alasan,
      quotation: quot,
    };
  }, [items, formData.durasiNilai, formData.tipeDurasi]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi Dasar
    if (!formData.tanggalPickup) {
      setError('Tanggal penjemputan wajib diisi.');
      return;
    }
    if (formData.tanggalPickup < todayStr) {
      setError('Tanggal penjemputan tidak boleh tanggal yang sudah lewat.');
      return;
    }
    if (formData.campusArea === 'lainnya' && !formData.customArea.trim()) {
      setError('Harap masukkan nama wilayah atau kecamatan Anda pada kolom yang disediakan.');
      return;
    }
    const hasEmptyItem = items.some((i) => !i.nama.trim() || Number(i.jumlah) < 1);
    if (hasEmptyItem) {
      setError('Semua barang harus memiliki nama dan jumlah minimal 1.');
      return;
    }
    if (liveClassification.kategori === 'REJECT') {
      setError(`Pemesanan tidak dapat dilanjutkan: ${liveClassification.alasan}`);
      return;
    }
    if (!agreeTerms) {
      setError('Harap setujui simulasi biaya dan ketentuan layanan terlebih dahulu.');
      return;
    }

    // =========================================================================
    // ATURAN AUTENTIKASI:
    // 1. JIKA BELUM MEMILIKI AKUN / BELUM LOGIN:
    //    -> Simpan isian formulir ke sessionStorage agar tidak hilang
    //    -> Alihkan otomatis ke halaman daftar akun (/login?mode=register)
    // 2. JIKA SUDAH MEMILIKI AKUN / SUDAH LOGIN:
    //    -> Langsung proses booking dan masukkan ke antrean penjemputan
    // =========================================================================
    if (!currentUser) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'safetitip_draft_booking',
          JSON.stringify({ formData, items })
        );
      }
      setRedirectingToRegister(true);
      setTimeout(() => {
        router.push('/login?mode=register&from=booking');
      }, 900);
      return;
    }

    // Pengguna sudah login -> Kirim data pemesanan ke antrean
    setLoading(true);

    const areaLabelMap: Record<string, string> = {
      pauh: 'Pauh & Limau Manis (UNAND / PNP)',
      padang_utara: 'Padang Utara & Air Tawar (UNP)',
      lubuk_begalung: 'Lubuk Begalung (UPI YPTK)',
      padang_barat: 'Padang Barat & Ulak Karang (UBH)',
      kuranji: 'Kuranji & Gn. Pangilun (UIN IB / ITP)',
      padang_timur: 'Padang Timur & Sawahan',
      nanggalo: 'Nanggalo & Siteba',
      lubuk_kilangan: 'Lubuk Kilangan & Indarung',
      koto_tangah: 'Koto Tangah & Lubuk Buaya',
      padang_selatan: 'Padang Selatan & Teluk Bayur',
      bungus: 'Bungus Teluk Kabung',
      limau_manis: 'Limau Manis (UNAND / PNP)',
      air_tawar: 'Air Tawar (UNP)',
      ulak_karang: 'Ulak Karang (UBH)',
    };

    const finalArea =
      formData.campusArea === 'lainnya'
        ? formData.customArea.trim()
        : areaLabelMap[formData.campusArea] || formData.campusArea;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: currentUser?.id,
          nama: currentUser?.nama || formData.nama,
          noWa: currentUser?.noWa || formData.noWa,
          tipeDurasi: (formData as any).tipeDurasi,
          durasiNilai: Number((formData as any).durasiNilai) || 1,
          durasiBulan: liveClassification.quotation?.durasiBulan || Number(formData.durasiBulan) || 1,
          lokasiPickup: `[${finalArea}] ${formData.lokasiPickup}`,
          items: items.map((i) => ({ nama: i.nama.trim(), jumlah: Number(i.jumlah) })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (data.errors ? data.errors.join(', ') : 'Terjadi kesalahan'));
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('safetitip_draft_booking');
        }
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim data booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Visual Hero Banner: Penjemputan SafeTitip */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white mb-8 group">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-7 p-6 sm:p-8 space-y-3 z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-extrabold border border-blue-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Armada Penjemputan Kota Padang Siaga
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Kurir Jemput Langsung ke Pintu Lokasi Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Pilihan durasi fleksibel Harian, Mingguan, dan Bulanan untuk kos mahasiswa, rumah tinggal, maupun kantor di seluruh area Kota Padang.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">calendar_month</span>
                  Harian, Mingguan & Bulanan
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
                  <span className="material-symbols-outlined text-sky-400 text-[16px]">photo_camera</span>
                  Foto Berita Acara Digital
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
                  <span className="material-symbols-outlined text-amber-400 text-[16px]">bolt</span>
                  Hitung Biaya Otomatis
                </span>
              </div>
            </div>
            <div className="md:col-span-5 relative h-48 md:h-full min-h-[200px] overflow-hidden">
              <img
                src="/images/courier.jpg"
                alt="Kurir SafeTitip Siap Jemput"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-blue-900/90 md:from-blue-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold text-slate-800 shadow-md">
                📍 Wilayah Layanan: Kota Padang
              </div>
            </div>
          </div>
        </div>

        {/* Notifikasi Pengalihan ke Halaman Pendaftaran */}
        {redirectingToRegister && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-500/80 shadow-md flex items-center gap-3 animate-pulse text-indigo-950">
            <span className="material-symbols-outlined text-indigo-600 text-[26px]">account_circle</span>
            <div className="text-xs sm:text-sm">
              <p className="font-extrabold">Mengarahkan ke Pendaftaran Akun...</p>
              <p className="text-indigo-800 text-xs">
                Data pesanan Anda telah tersimpan sementara dan akan otomatis terisi kembali setelah akun Anda siap.
              </p>
            </div>
          </div>
        )}

        {/* Banner Status Akun Pengguna */}
        {currentUser ? (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div>
                <p className="font-extrabold text-emerald-950 text-sm">
                  Masuk sebagai: {currentUser.nama}
                </p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  {currentUser.email || currentUser.noWa} • Booking akan langsung masuk ke antrean penjemputan akun Anda.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUserLogout}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300 transition-colors shadow-2xs text-xs"
            >
              Ganti Akun
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">
                  Alur Pemesanan Cepat & Fleksibel
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Silakan tentukan durasi (harian, mingguan, atau bulanan) dan barang Anda. Jika belum memiliki akun, sistem akan otomatis mengarahkan Anda mendaftar saat menekan tombol pesan.
                </p>
              </div>
            </div>
            <Link
              href="/login?mode=register&from=booking"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Daftar / Masuk Akun</span>
            </Link>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {result ? (
            /* SUKSES RESULT */
            <div className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[44px]">local_shipping</span>
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold uppercase tracking-wide">
                  {result.booking?.kategori === 'CUSTOM' ? 'Kuotasi Khusus Masuk' : 'Masuk Antrean Penjemputan'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {result.booking?.kategori === 'CUSTOM'
                    ? 'Permintaan Kuotasi Khusus Diterima!'
                    : 'Pesanan Berhasil Masuk Antrean! 🎉'}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Data pemesanan Anda telah tersimpan di sistem SafeTitip. Kurir kami akan segera menghubungi nomor WhatsApp Anda untuk konfirmasi jadwal jemput.
                </p>
              </div>

              <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kode Booking</p>
                    <p className="font-mono text-lg font-extrabold text-blue-700">{result.booking?.kodeBooking}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status Pemesanan</p>
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-100 text-blue-800">
                      {result.booking?.status === 'APPROVED' ? 'Siap Dijemput' : result.booking?.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Nama Pemesan:</p>
                    <p className="font-bold text-slate-900">{result.booking?.user?.nama || formData.nama}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">WhatsApp Aktif:</p>
                    <p className="font-bold text-slate-900">{result.booking?.user?.noWa || formData.noWa}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Kategori & Durasi:</p>
                    <p className="font-bold text-slate-900">
                      Kategori {result.booking?.kategori} • {result.booking?.quotation?.labelDurasi || result.booking?.labelDurasi || `${result.booking?.durasiBulan} Bulan`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estimasi Total Biaya:</p>
                    <p className="font-extrabold text-blue-700 text-base">
                      {result.booking?.totalHarga === 0
                        ? 'Dihubungi Admin'
                        : `Rp ${result.booking?.totalHarga?.toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  <span>Kembali ke Beranda</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      nama: currentUser?.nama || '',
                      noWa: currentUser?.noWa || '',
                      lokasiPickup: currentUser?.alamat || '',
                      tanggalPickup: '',
                      tipeDurasi: 'BULAN',
                      durasiNilai: 1,
                      durasiBulan: 1,
                      campusArea: 'pauh',
                      customArea: '',
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
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                  <span className="material-symbols-outlined text-rose-600 mt-0.5">error</span>
                  <div className="text-sm">
                    <p className="font-bold">Periksa Kembali Data Anda:</p>
                    <p className="mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Bagian 1: Identitas */}
              <div className="space-y-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                  Identitas & Kontak Pemesan
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="nama">
                      Nama Lengkap Pemesan *
                    </label>
                    <input
                      id="nama"
                      required
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap Anda..."
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
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
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Alamat & Jadwal */}
              <div className="space-y-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                  Lokasi Penjemputan & Durasi Penitipan
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="campusArea">
                      Wilayah / Kecamatan (Kota Padang) *
                    </label>
                    <select
                      id="campusArea"
                      name="campusArea"
                      value={formData.campusArea}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-medium"
                    >
                      <option value="pauh">Pauh & Limau Manis (UNAND / PNP)</option>
                      <option value="padang_utara">Padang Utara & Air Tawar (UNP)</option>
                      <option value="lubuk_begalung">Lubuk Begalung (UPI YPTK)</option>
                      <option value="padang_barat">Padang Barat & Ulak Karang (UBH)</option>
                      <option value="kuranji">Kuranji & Gn. Pangilun (UIN IB / ITP)</option>
                      <option value="padang_timur">Padang Timur & Sawahan</option>
                      <option value="nanggalo">Nanggalo & Siteba</option>
                      <option value="lubuk_kilangan">Lubuk Kilangan & Indarung</option>
                      <option value="koto_tangah">Koto Tangah & Lubuk Buaya</option>
                      <option value="padang_selatan">Padang Selatan & Teluk Bayur</option>
                      <option value="bungus">Bungus Teluk Kabung</option>
                      <option value="lainnya">Wilayah Lainnya (Ketik Manual)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="tanggalPickup">
                      Tanggal Penjemputan *
                    </label>
                    <input
                      id="tanggalPickup"
                      required
                      type="date"
                      name="tanggalPickup"
                      min={todayStr}
                      value={formData.tanggalPickup}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-medium"
                    />
                  </div>

                  {formData.campusArea === 'lainnya' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="customArea">
                        Nama Wilayah / Kecamatan Anda *
                      </label>
                      <input
                        id="customArea"
                        required
                        type="text"
                        name="customArea"
                        value={formData.customArea}
                        onChange={handleInputChange}
                        placeholder="Contoh: Bukittinggi, Pariaman, Solok, dll..."
                        className="w-full h-11 px-3.5 rounded-xl border border-blue-400 bg-blue-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold"
                      />
                    </div>
                  )}

                  {/* Satuan Durasi (Harian, Mingguan, Bulanan) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pilihan Satuan Durasi *
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-300 h-11 items-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipeDurasi: 'HARI', durasiNilai: 1 })}
                        className={`h-9 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                          formData.tipeDurasi === 'HARI'
                            ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        Harian
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipeDurasi: 'MINGGU', durasiNilai: 1 })}
                        className={`h-9 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                          formData.tipeDurasi === 'MINGGU'
                            ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        Mingguan
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipeDurasi: 'BULAN', durasiNilai: 1 })}
                        className={`h-9 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                          formData.tipeDurasi === 'BULAN'
                            ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        Bulanan
                      </button>
                    </div>
                  </div>

                  {/* Jumlah Durasi Sesuai Satuan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="durasiNilai">
                      Jumlah {formData.tipeDurasi === 'HARI' ? 'Hari (Maks. 7 Hari)' : formData.tipeDurasi === 'MINGGU' ? 'Minggu' : 'Bulan'} *
                    </label>
                    {formData.tipeDurasi === 'HARI' ? (
                      <select
                        id="durasiNilai"
                        name="durasiNilai"
                        value={formData.durasiNilai}
                        onChange={(e) => setFormData({ ...formData, durasiNilai: Number(e.target.value) })}
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-semibold"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <option key={d} value={d}>
                            {d} Hari {d === 1 ? '(Titip Kilat 24 Jam)' : d === 7 ? '(1 Pekan Penuh)' : ''}
                          </option>
                        ))}
                      </select>
                    ) : formData.tipeDurasi === 'MINGGU' ? (
                      <select
                        id="durasiNilai"
                        name="durasiNilai"
                        value={formData.durasiNilai}
                        onChange={(e) => setFormData({ ...formData, durasiNilai: Number(e.target.value) })}
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-semibold"
                      >
                        <option value={1}>1 Minggu (7 Hari)</option>
                        <option value={2}>2 Minggu (14 Hari)</option>
                        <option value={3}>3 Minggu (21 Hari)</option>
                        <option value={4}>4 Minggu (28 Hari)</option>
                      </select>
                    ) : (
                      <select
                        id="durasiNilai"
                        name="durasiNilai"
                        value={formData.durasiNilai}
                        onChange={(e) => setFormData({ ...formData, durasiNilai: Number(e.target.value), durasiBulan: Number(e.target.value) })}
                        className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-semibold"
                      >
                        <option value={1}>1 Bulan (Paket Standar)</option>
                        <option value={2}>2 Bulan (Paket Hemat)</option>
                        <option value={3}>3 Bulan (Paket Semester Penuh)</option>
                      </select>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="lokasiPickup">
                      Alamat Lengkap Penjemputan (Kos, Rumah, atau Kantor) *
                    </label>
                    <textarea
                      id="lokasiPickup"
                      required
                      rows={2}
                      name="lokasiPickup"
                      value={formData.lokasiPickup}
                      onChange={handleInputChange}
                      placeholder="Tuliskan nama jalan, nama kos/kantor, nomor rumah, dan patokan lokasi terdekat..."
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 resize-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Daftar Barang */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                    Daftar Barang yang Dititipkan
                  </h2>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold border border-blue-200 transition-colors shadow-2xs"
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
                          placeholder="Nama barang (misal: dus pakaian, koper, kulkas mini, motor vario)"
                          className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          required
                          type="number"
                          min={1}
                          value={item.jumlah}
                          onChange={(e) => handleItemChange(idx, 'jumlah', Number(e.target.value))}
                          className="w-full h-10 px-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
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

              {/* Bagian 4: LIVE QUOTATION PREVIEW & APPROVAL */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/60 border-2 border-blue-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-700 text-[22px]">price_check</span>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Simulasi Biaya & Kategori Otomatis
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-xs">
                    Transparan & Real-time
                  </span>
                </div>

                {liveClassification.kategori === 'REJECT' && (
                  <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 space-y-1">
                    <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Barang Tidak Memenuhi Syarat Keamanan
                    </p>
                    <p className="text-xs">{liveClassification.alasan}</p>
                  </div>
                )}

                {liveClassification.kategori === 'CUSTOM' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm flex items-center gap-1.5 text-amber-800">
                        <span className="material-symbols-outlined text-[18px]">support_agent</span>
                        Kuotasi Khusus (Kendaraan / Penanganan Spesial)
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-extrabold bg-amber-200 text-amber-900">
                        CUSTOM
                      </span>
                    </div>
                    <p className="text-xs">{liveClassification.alasan}</p>
                  </div>
                )}

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
                          Durasi Penitipan: <strong>{liveClassification.quotation?.labelDurasi || `${formData.durasiNilai} ${formData.tipeDurasi === 'HARI' ? 'Hari' : formData.tipeDurasi === 'MINGGU' ? 'Minggu' : 'Bulan'}`}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Estimasi Total Biaya</p>
                        <p className="text-3xl font-extrabold text-blue-700 tracking-tight">
                          Rp {liveClassification.quotation?.totalHarga.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          (Rp {liveClassification.quotation?.hargaPerSatuan.toLocaleString('id-ID')} / {formData.tipeDurasi === 'HARI' ? 'hari' : formData.tipeDurasi === 'MINGGU' ? 'minggu' : 'bulan'})
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {liveClassification.kategori === 'BELUM_ADA' && (
                  <div className="p-4 rounded-2xl bg-white/70 border border-dashed border-blue-200 text-center text-xs text-slate-500">
                    Tuliskan nama barang di atas untuk melihat klasifikasi kategori dan estimasi biaya secara otomatis.
                  </div>
                )}

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                      Saya menyetujui rincian estimasi biaya di atas dan syarat & ketentuan layanan penjemputan SafeTitip.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  disabled={loading || redirectingToRegister || liveClassification.kategori === 'REJECT' || !agreeTerms}
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:translate-y-0.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {currentUser ? 'local_shipping' : 'login'}
                  </span>
                  <span>
                    {loading
                      ? 'Memasukkan ke Antrean...'
                      : redirectingToRegister
                      ? 'Mengalihkan ke Pendaftaran Akun...'
                      : currentUser
                      ? 'Pesan & Masuk Antrean Penjemputan'
                      : 'Pesan Sekarang (Lanjut Daftar Akun)'}
                  </span>
                </button>
              </div>

            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
