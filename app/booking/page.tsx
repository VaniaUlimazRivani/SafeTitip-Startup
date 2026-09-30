'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { klasifikasiBarang } from '@/lib/services/klasifikasiService';
import { hitungQuotation } from '@/lib/services/quotationService';

export default function BookingPage() {
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
    durasiBulan: 1,
    campusArea: 'limau_manis',
    customArea: '',
  });

  const [items, setItems] = useState<Array<{ nama: string; jumlah: number }>>([
    { nama: '', jumlah: 1 },
  ]);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Live Classification & Quotation (Sebelum Submit)
  const liveClassification = useMemo(() => {
    const validItems = items.filter((i) => i.nama.trim().length > 0);
    if (validItems.length === 0) {
      return {
        kategori: 'BELUM_ADA',
        alasan: 'Masukkan minimal satu nama barang untuk melihat estimasi harga.',
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

  // Quick Preset Helper untuk Demo Pengujian
  const applyPreset = (type: 'A01' | 'A02' | 'A03' | 'A04') => {
    if (type === 'A01') {
      setFormData((prev) => ({
        ...prev,
        nama: 'Budi Santoso (Demo A-01)',
        noWa: '081234567890',
        durasiBulan: 1,
        campusArea: 'limau_manis',
        customArea: '',
        lokasiPickup: 'Kos Putra Andalas, Jl. Pasar Baru No. 12, Limau Manis',
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
        campusArea: 'air_tawar',
        customArea: '',
        lokasiPickup: 'Kos Putri Cenderawasih, Air Tawar Barat',
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
        campusArea: 'lubuk_begalung',
        customArea: '',
        lokasiPickup: 'Kos Kurnia, Lubuk Begalung (Dekat UPI)',
        tanggalPickup: todayStr,
      }));
      setItems([{ nama: 'motor vario', jumlah: 1 }]);
      setAgreeTerms(true);
    } else if (type === 'A04') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      setFormData((prev) => ({
        ...prev,
        nama: 'Test Validasi (Demo A-04)',
        noWa: '081234567890',
        durasiBulan: 1,
        campusArea: 'limau_manis',
        customArea: '',
        lokasiPickup: 'Kos Coba, Padang',
        tanggalPickup: yStr,
      }));
      setItems([{ nama: 'dus pakaian', jumlah: 1 }]);
      setAgreeTerms(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.tanggalPickup) {
      setError('Tanggal penjemputan wajib diisi.');
      return;
    }
    if (formData.tanggalPickup < todayStr) {
      setError('Tanggal penjemputan tidak boleh tanggal lampau (Skenario A-04).');
      return;
    }
    if (formData.campusArea === 'lainnya' && !formData.customArea.trim()) {
      setError('Harap masukkan nama wilayah atau kota Anda pada kolom yang disediakan.');
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

    const areaLabelMap: Record<string, string> = {
      limau_manis: 'Limau Manis (UNAND/PNP)',
      air_tawar: 'Air Tawar (UNP)',
      lubuk_begalung: 'Lubuk Begalung (UPI YPTK)',
      ulak_karang: 'Ulak Karang (UBH)',
      kuranji: 'Kuranji / Gn Pangilun (UIN IB)',
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
          durasiBulan: Number(formData.durasiBulan),
          lokasiPickup: `[${finalArea}] ${formData.lokasiPickup}`,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header Halaman */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
            Halaman Formulir Pemesanan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Booking Penjemputan Kamar Kos
          </h1>
          <p className="text-sm text-slate-600">
            Lengkapi data pemesanan di bawah. Estimasi harga dihitung secara otomatis dan disetujui sebelum booking dikirimkan.
          </p>
        </div>

        {/* Demo Preset Bar untuk Reviewer/Mentor */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">smart_toy</span>
              Tombol Preset Uji Coba Cepat (Demo Mode):
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              A-01 s/d A-04 Ready
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('A01')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
            >
              A-01: 2 Dus Buku (Kat A - Rp 199k)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('A02')}
              className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors"
            >
              A-02: 1 Kulkas (Kat B - Rp 299k)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('A03')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 transition-colors"
            >
              A-03: Motor (Custom Quotation)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('A04')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
            >
              A-04: Tgl Lampau (Test Error)
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {result ? (
            /* SUKSES RESULT */
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
                  Data booking telah tersimpan di sistem dan dapat dicek langsung di halaman admin.
                </p>
              </div>

              <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kode Booking</p>
                    <p className="font-mono text-lg font-extrabold text-blue-700">{result.booking?.kodeBooking}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</p>
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
                      campusArea: 'limau_manis',
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

              {/* Bagian 2: Alamat & Jadwal */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                  Lokasi Kos & Jadwal Penjemputan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="campusArea">
                      Wilayah Kampus (Kota Padang) *
                    </label>
                    <select
                      id="campusArea"
                      name="campusArea"
                      value={formData.campusArea}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-medium"
                    >
                      <option value="limau_manis">Limau Manis & Pauh (UNAND / PNP)</option>
                      <option value="air_tawar">Air Tawar & Padang Utara (UNP)</option>
                      <option value="lubuk_begalung">Lubuk Begalung / Lubeg (UPI YPTK)</option>
                      <option value="ulak_karang">Ulak Karang & Padang Barat (UBH)</option>
                      <option value="kuranji">Kuranji / Gunung Pangilun (UIN IB / ITP)</option>
                      <option value="lainnya">Wilayah Lainnya (Ketik Manual)</option>
                    </select>
                  </div>

                  {formData.campusArea === 'lainnya' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="customArea">
                        Nama Wilayah / Kota Anda *
                      </label>
                      <input
                        id="customArea"
                        required
                        type="text"
                        name="customArea"
                        value={formData.customArea}
                        onChange={handleInputChange}
                        placeholder="Contoh: Koto Tangah, Nanggalo, Pariaman, Solok, Bukittinggi, dll..."
                        className="w-full h-11 px-3.5 rounded-xl border border-blue-400 bg-blue-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold"
                      />
                    </div>
                  )}

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
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
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
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-semibold"
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
                      placeholder="Tuliskan nama jalan, kos, dan nomor kamar..."
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Daftar Barang */}
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
                          placeholder="Nama barang (misal: dus buku, kulkas mini, kipas angin, motor)"
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
                    <h4 className="font-extrabold text-slate-900 text-base">
                      Simulasi Quotation Real-time (Sebelum Submit)
                    </h4>
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-xs">
                    Aturan Kode P0
                  </span>
                </div>

                {liveClassification.kategori === 'REJECT' && (
                  <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 space-y-1">
                    <p className="font-extrabold text-sm flex items-center gap-1.5 text-rose-700">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Ditolak Sistem (BR-A-P0-04)
                    </p>
                    <p className="text-xs">{liveClassification.alasan}</p>
                  </div>
                )}

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

                {liveClassification.kategori === 'BELUM_ADA' && (
                  <div className="p-4 rounded-2xl bg-white/70 border border-dashed border-blue-200 text-center text-xs text-slate-500">
                    Tuliskan nama barang di atas untuk melihat klasifikasi kategori dan estimasi harga otomatis.
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
                      Saya menyetujui rincian estimasi biaya di atas dan ketentuan penjemputan layanan SafeTitip Express & Care.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  disabled={loading || liveClassification.kategori === 'REJECT' || !agreeTerms}
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:translate-y-0.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>{loading ? 'Menyimpan Booking...' : 'Kirim Booking Penitipan'}</span>
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
