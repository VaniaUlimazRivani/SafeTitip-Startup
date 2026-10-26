'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';
import { TipeDurasi } from '@/lib/constants/harga';
import LocationPicker from '@/components/LocationPicker';
import { KalkulasiOngkirResult } from '@/lib/services/ongkirService';

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

  // Data Ongkir & Lokasi Google Maps
  const [ongkirData, setOngkirData] = useState<KalkulasiOngkirResult & { coordinate: { lat: number; lng: number }; alamatDetail: string }>({
    jarakKm: 1.8,
    tarifDasarPerTrip: 5000,
    surchargeKategori: 0,
    ongkirPerTrip: 5000,
    metodePickup: 'PICKUP',
    metodeDelivery: 'DELIVERY',
    ongkirPickup: 5000,
    ongkirDelivery: 5000,
    totalOngkir: 10000,
    mapsUrl: '',
    isFreePickup: false,
    estimasiWaktuMenit: 8,
    isRealRoute: true,
    isOutOfRange: false,
    maxDistanceKm: 35,
    coordinate: { lat: -0.9250, lng: 100.4420 },
    alamatDetail: '',
  });

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

    const finalAlamat = (ongkirData.alamatDetail || formData.lokasiPickup || '').trim();
    const isKurirNeeded = ongkirData.metodePickup === 'PICKUP' || ongkirData.metodeDelivery === 'DELIVERY';

    if (isKurirNeeded && !finalAlamat) {
      setError('Harap lengkapi alamat detail penjemputan / pengantaran kos Anda.');
      return;
    }

    if (isKurirNeeded && ongkirData.isOutOfRange) {
      setError(
        `Lokasi penjemputan/pengantaran (${ongkirData.jarakKm} km) di luar batas operasional kurir Kosinaja (Maksimal ${ongkirData.maxDistanceKm} km). Silakan tentukan lokasi di area Kota Padang atau pilih metode Antar Sendiri ke Gudang.`
      );
      return;
    }

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
          lokasiPickup: finalAlamat,
          metodePickup: ongkirData.metodePickup,
          metodeDelivery: ongkirData.metodeDelivery,
          jarakKm: ongkirData.jarakKm,
          ongkirPickup: ongkirData.ongkirPickup,
          ongkirDelivery: ongkirData.ongkirDelivery,
          totalOngkir: ongkirData.totalOngkir,
          surchargeKategori: ongkirData.surchargeKategori,
          latitude: ongkirData.coordinate.lat,
          longitude: ongkirData.coordinate.lng,
          mapsUrl: ongkirData.mapsUrl,
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B14] font-sans flex flex-col justify-between selection:bg-[#B86B35] selection:text-white">
      <Navbar />

      <main className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Visual Hero Banner: Penjemputan Kosinaja */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8DDD3] shadow-lg bg-gradient-to-r from-[#B86B35] via-[#A85E2B] to-[#1E1510] text-white mb-8 group">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-7 p-6 sm:p-8 space-y-3 z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#FAF6F0] text-xs font-extrabold border border-white/30">
                <span className="w-2 h-2 rounded-full bg-[#E69526] animate-pulse"></span>
                Armada Penjemputan Kota Padang Siaga
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Kurir Jemput Langsung ke Pintu Lokasi Anda
              </h1>
              <p className="text-xs sm:text-sm text-[#F6ECE1] leading-relaxed">
                Pilihan durasi fleksibel Harian, Mingguan, dan Bulanan untuk kos mahasiswa, rumah tinggal, maupun kantor di seluruh area Kota Padang.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">calendar_month</span>
                  Harian, Mingguan & Bulanan
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
                  <span className="material-symbols-outlined text-[#E69526] text-[16px]">photo_camera</span>
                  Foto Berita Acara Digital
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
                  <span className="material-symbols-outlined text-amber-300 text-[16px]">bolt</span>
                  Hitung Biaya Otomatis
                </span>
              </div>
            </div>
            <div className="md:col-span-5 relative h-48 md:h-full min-h-[200px] overflow-hidden">
              <img
                src="/images/courier.jpg"
                alt="Kurir Kosinaja Siap Jemput"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1E1510]/90 md:from-[#1E1510] via-transparent to-transparent"></div>
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold text-[#2A1B14] shadow-md">
                📍 Wilayah Layanan: Kota Padang
              </div>
            </div>
          </div>
        </div>

        {/* Notifikasi Pengalihan ke Halaman Pendaftaran */}
        {redirectingToRegister && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F6ECE1] border-2 border-[#B86B35]/80 shadow-md flex items-center gap-3 animate-pulse text-[#421E0B]">
            <span className="material-symbols-outlined text-[#B86B35] text-[26px]">account_circle</span>
            <div className="text-xs sm:text-sm">
              <p className="font-extrabold">Mengarahkan ke Pendaftaran Akun...</p>
              <p className="text-[#7E3F18] text-xs">
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
          <div className="mb-6 p-4 rounded-2xl bg-[#F6ECE1]/80 border border-[#EBD8C6] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#B86B35] text-white flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </div>
              <div>
                <p className="font-extrabold text-[#2A1B14] text-sm">
                  Alur Pemesanan Cepat & Fleksibel
                </p>
                <p className="text-[#705E54] text-xs mt-0.5">
                  Silakan tentukan durasi (harian, mingguan, atau bulanan) dan barang Anda. Jika belum memiliki akun, sistem akan otomatis mengarahkan Anda mendaftar saat menekan tombol pesan.
                </p>
              </div>
            </div>
            <Link
              href="/login?mode=register&from=booking"
              className="px-3.5 py-2 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Daftar / Masuk Akun</span>
            </Link>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-[#E8DDD3] shadow-xl overflow-hidden">
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
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B14] mt-2">
                  {result.booking?.kategori === 'CUSTOM'
                    ? 'Permintaan Kuotasi Khusus Diterima!'
                    : 'Pesanan Berhasil Masuk Antrean! 🎉'}
                </h2>
                <p className="text-sm text-[#705E54] max-w-md mx-auto mt-1 leading-relaxed">
                  Data pemesanan Anda telah tersimpan di sistem Kosinaja. Kurir kami akan segera menghubungi nomor WhatsApp Anda untuk konfirmasi jadwal jemput.
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
                    <p className="font-extrabold text-[#B86B35] text-base">
                      {result.booking?.totalHarga === 0
                        ? 'Dihubungi Admin'
                        : `Rp ${result.booking?.totalHarga?.toLocaleString('id-ID')}`}
                    </p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                    <p>
                      <strong>Metode Penjemputan:</strong>{' '}
                      {result.booking?.metodePickup === 'PICKUP'
                        ? `Dijemput Kurir (${result.booking?.jarakKm || 0} km, Ongkir: Rp ${result.booking?.ongkirPickup?.toLocaleString('id-ID') || 0})`
                        : 'Antar Sendiri ke Gudang (Gratis)'}
                    </p>
                    <p>
                      <strong>Metode Pengembalian:</strong>{' '}
                      {result.booking?.metodeDelivery === 'DELIVERY'
                        ? `Diantar Kembali (Ongkir: Rp ${result.booking?.ongkirDelivery?.toLocaleString('id-ID') || 0})`
                        : 'Ambil Sendiri di Gudang (Gratis)'}
                    </p>
                    {result.booking?.mapsUrl && (
                      <p className="pt-1">
                        <a
                          href={result.booking.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#B86B35] hover:underline"
                        >
                          <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                          <span>Buka Titik Lokasi di Google Maps</span>
                        </a>
                      </p>
                    )}
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
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B86B35]/30 focus:border-[#B86B35] transition-all font-medium"
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
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B86B35]/30 focus:border-[#B86B35] transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Durasi & Lokasi Penjemputan Google Maps */}
              <div className="space-y-6">
                <h2 className="text-base font-extrabold text-[#2A1B14] flex items-center gap-2 border-b border-[#E8DDD3] pb-2">
                  <span className="w-6 h-6 rounded-lg bg-[#F6ECE1] text-[#7E3F18] flex items-center justify-center text-xs font-bold">2</span>
                  Durasi Penitipan & Titik Penjemputan Maps
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="tanggalPickup">
                      Tanggal Penjemputan / Mulai Titip *
                    </label>
                    <input
                      id="tanggalPickup"
                      required
                      type="date"
                      name="tanggalPickup"
                      min={todayStr}
                      value={formData.tanggalPickup}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#B86B35]/30 font-medium"
                    />
                  </div>

                  {/* Satuan Durasi (Harian, Mingguan, Bulanan) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pilihan Satuan Durasi *
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F6ECE1]/70 rounded-xl border border-[#E8DDD3] h-11 items-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipeDurasi: 'HARI', durasiNilai: 1 })}
                        className={`h-9 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                          formData.tipeDurasi === 'HARI'
                            ? 'bg-[#B86B35] text-white shadow-xs font-extrabold'
                            : 'text-[#705E54] hover:text-[#2A1B14] hover:bg-[#F6ECE1]'
                        }`}
                      >
                        Harian
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipeDurasi: 'MINGGU', durasiNilai: 1 })}
                        className={`h-9 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                          formData.tipeDurasi === 'MINGGU'
                            ? 'bg-[#B86B35] text-white shadow-xs font-extrabold'
                            : 'text-[#705E54] hover:text-[#2A1B14] hover:bg-[#F6ECE1]'
                        }`}
                      >
                        Mingguan
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipeDurasi: 'BULAN', durasiNilai: 1 })}
                        className={`h-9 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                          formData.tipeDurasi === 'BULAN'
                            ? 'bg-[#B86B35] text-white shadow-xs font-extrabold'
                            : 'text-[#705E54] hover:text-[#2A1B14] hover:bg-[#F6ECE1]'
                        }`}
                      >
                        Bulanan
                      </button>
                    </div>
                  </div>

                  {/* Jumlah Durasi Sesuai Satuan */}
                  <div className="sm:col-span-2">
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
                        <option value={2}>2 Bulan (Paket Hemat - Diskon Spesial)</option>
                        <option value={3}>3 Bulan (Paket Semester Penuh - Super Hemat)</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Location Picker Component dengan Google Maps & Ongkir Terintegrasi */}
                <LocationPicker
                  kategori={liveClassification.kategori}
                  initialAlamat={formData.lokasiPickup}
                  onChangeOngkir={(res) => {
                    setOngkirData(res);
                    setFormData((prev) => ({ ...prev, lokasiPickup: res.alamatDetail }));
                  }}
                />
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
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF6F0] via-[#F6ECE1]/70 to-[#F6ECE1] border-2 border-[#EBD8C6] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#EBD8C6] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#B86B35] text-[22px]">price_check</span>
                    <h3 className="font-extrabold text-[#2A1B14] text-base">
                      Simulasi Biaya & Kategori Otomatis
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#7E3F18] bg-white px-2.5 py-1 rounded-full border border-[#EBD8C6] shadow-xs">
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EBD8C6] shadow-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Klasifikasi:</span>
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                              liveClassification.kategori === 'A'
                                ? 'bg-[#F6ECE1] text-[#7E3F18] border border-[#EBD8C6]'
                                : 'bg-[#F6ECE1] text-[#9B5424] border border-[#EBD8C6]'
                            }`}
                          >
                            Kategori {liveClassification.kategori}
                          </span>
                        </div>
                        <p className="text-xs text-[#705E54]">{liveClassification.alasan}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Durasi Penitipan: <strong>{liveClassification.quotation?.labelDurasi || `${formData.durasiNilai} ${formData.tipeDurasi === 'HARI' ? 'Hari' : formData.tipeDurasi === 'MINGGU' ? 'Minggu' : 'Bulan'}`}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Biaya Keseluruhan</p>
                        <p className="text-3xl font-extrabold text-[#B86B35] tracking-tight">
                          Rp {((liveClassification.quotation?.totalHarga || 0) + ongkirData.totalOngkir).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          (Titip: Rp {liveClassification.quotation?.totalHarga.toLocaleString('id-ID')} + Ongkir: Rp {ongkirData.totalOngkir.toLocaleString('id-ID')})
                        </p>
                      </div>
                    </div>

                    {/* Rincian Komponen Biaya */}
                    <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EBD8C6] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Biaya Titip Barang:</span>
                        <span className="font-extrabold text-[#2A1B14]">
                          Rp {liveClassification.quotation?.totalHarga.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Ongkir Penjemputan:</span>
                        <span className="font-extrabold text-[#2A1B14]">
                          {ongkirData.metodePickup === 'PICKUP'
                            ? ongkirData.ongkirPickup === 0
                              ? 'Gratis (≤ 1km)'
                              : `Rp ${ongkirData.ongkirPickup.toLocaleString('id-ID')}`
                            : 'Rp 0 (Antar Sendiri)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Ongkir Pengantaran:</span>
                        <span className="font-extrabold text-[#2A1B14]">
                          {ongkirData.metodeDelivery === 'DELIVERY'
                            ? ongkirData.ongkirDelivery === 0
                              ? 'Gratis (≤ 1km)'
                              : `Rp ${ongkirData.ongkirDelivery.toLocaleString('id-ID')}`
                            : 'Rp 0 (Ambil Sendiri)'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {liveClassification.kategori === 'BELUM_ADA' && (
                  <div className="p-4 rounded-2xl bg-white/70 border border-dashed border-[#EBD8C6] text-center text-xs text-[#705E54]">
                    Tuliskan nama barang di atas untuk melihat klasifikasi kategori dan estimasi biaya secara otomatis.
                  </div>
                )}

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-[#B86B35] focus:ring-[#B86B35] mt-0.5"
                    />
                    <span className="text-xs text-[#421E0B] font-semibold leading-relaxed">
                      Saya menyetujui rincian estimasi biaya di atas dan syarat & ketentuan layanan penjemputan Kosinaja.
                    </span>
                  </label>
                </div>
              </div>

              {/* Hidden Inputs untuk Form Submit */}
              <input type="hidden" name="latitude" value={ongkirData.coordinate.lat} />
              <input type="hidden" name="longitude" value={ongkirData.coordinate.lng} />
              <input type="hidden" name="jarakKm" value={ongkirData.jarakKm} />
              <input type="hidden" name="totalOngkir" value={ongkirData.totalOngkir} />

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                {((ongkirData.metodePickup === 'PICKUP' || ongkirData.metodeDelivery === 'DELIVERY') && ongkirData.isOutOfRange) && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
                    ⚠️ Lokasi berada di luar batas operasional kurir Kosinaja (Maksimal {ongkirData.maxDistanceKm} km). Silakan tentukan lokasi di Padang atau pilih metode &quot;Antar Sendiri ke Gudang&quot;.
                  </div>
                )}

                <button
                  disabled={
                    loading ||
                    redirectingToRegister ||
                    liveClassification.kategori === 'REJECT' ||
                    !agreeTerms ||
                    ((ongkirData.metodePickup === 'PICKUP' || ongkirData.metodeDelivery === 'DELIVERY') && ongkirData.isOutOfRange)
                  }
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-[#B86B35] hover:bg-[#9B5424] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#B86B35]/25 active:translate-y-0.5 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {currentUser ? 'local_shipping' : 'login'}
                  </span>
                  <span>
                    {loading
                      ? 'Memasukkan ke Antrean...'
                      : redirectingToRegister
                      ? 'Mengalihkan ke Pendaftaran Akun...'
                      : ((ongkirData.metodePickup === 'PICKUP' || ongkirData.metodeDelivery === 'DELIVERY') && ongkirData.isOutOfRange)
                      ? 'Lokasi di Luar Jangkauan Kurir'
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
