'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { klasifikasiDanValidasi } from '../Lib/klasifikasi';
import { deteksiOtomatisBarang } from '../Lib/utils/klasifikasiHelper';

export default function Home() {
  const [formData, setFormData] = useState({
    nama: '',
    noWa: '',
    persona: '',
    alamat: '',
    tanggalPickup: '',
    lokasiPickup: '',
    durasiBulan: 1,
  });

  const [items, setItems] = useState([{ nama: '', jumlah: 1 }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Ambil data prefilled jika user datang dari halaman /klasifikasi
  useEffect(() => {
    try {
      const saved = localStorage.getItem('safetitip_prefilled_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          localStorage.removeItem('safetitip_prefilled_items');
        }
      }
      const savedDurasi = localStorage.getItem('safetitip_prefilled_durasi');
      if (savedDurasi) {
        setFormData((prev) => ({ ...prev, durasiBulan: Number(savedDurasi) }));
        localStorage.removeItem('safetitip_prefilled_durasi');
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  // Hitung klasifikasi barang secara real-time berdasarkan input barang
  const totalVolume = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.jumlah) || 1), 0);
  }, [items]);

  const liveKlasifikasi = useMemo(() => {
    const daftarBarang: any[] = [];
    items.forEach((item) => {
      const count = Number(item.jumlah) || 1;
      const detected = deteksiOtomatisBarang(item.nama);
      for (let i = 0; i < count; i++) {
        daftarBarang.push({
          nama: item.nama || '',
          tipe: detected.tipe || 'PAKAIAN',
          isKecilPengecualian: detected.isKecilPengecualian,
          isKendaraanBermotor: detected.isKendaraanBermotor,
          isTerlarangAtauBusuk: detected.isTerlarangAtauBusuk,
        });
      }
    });

    return klasifikasiDanValidasi({
      totalJumlahBarang: totalVolume,
      daftarBarang,
    });
  }, [items, totalVolume]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { nama: '', jumlah: 1 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          durasiBulan: Number(formData.durasiBulan),
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (data.errors ? data.errors.join(', ') : 'Terjadi kesalahan'));
      } else {
        setResult(data);
        // Reset form
        setFormData({
          nama: '', noWa: '', persona: '', alamat: '',
          tanggalPickup: '', lokasiPickup: '', durasiBulan: 1
        });
        setItems([{ nama: '', jumlah: 1 }]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            SafeTitip.
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
            Express & Care
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/klasifikasi"
            id="nav-to-klasifikasi"
            className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 transition-all text-xs sm:text-sm font-semibold text-cyan-200 flex items-center gap-1.5"
          >
            <span>🔍</span>
            <span>Simulasi & Cek Klasifikasi</span>
          </Link>
          <Link href="/admin" className="px-5 py-2 rounded-full border border-blue-400/30 hover:bg-blue-500/10 transition-all text-xs sm:text-sm font-medium text-blue-200">
            Admin &rarr;
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-24 pt-12 grid lg:grid-cols-2 gap-12 items-start">
        {/* Hero Section */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Tersedia untuk Mahasiswa Kos
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Tinggalkan Kos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tanpa Beban.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Layanan penitipan barang aman & terpercaya untuk mahasiswa yang akan KKN, PKL, magang, atau libur semester.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-800/50">
            <div>
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-slate-500 text-sm">Aman & Terverifikasi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Rp199k</div>
              <div className="text-slate-500 text-sm">Mulai dari per bulan</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl">
            
            {result ? (
              <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Booking Berhasil!</h2>
                  <p className="text-slate-400">Kode Booking: <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded">{result.booking?.kodeBooking}</span></p>
                </div>
                
                {result.kategori === 'CUSTOM' ? (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-200">
                    Sistem mendeteksi barang Anda (Kategori CUSTOM). Tim admin kami akan segera menghubungi nomor WA Anda untuk penawaran harga khusus.
                  </div>
                ) : (
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Estimasi Total Harga ({result.quotation?.durasiBulan} Bulan)</p>
                    <p className="text-4xl font-bold text-blue-400">
                      Rp {result.quotation?.totalHarga?.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">Kategori {result.kategori}</p>
                  </div>
                )}
                
                <button onClick={() => setResult(null)} className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all">
                  Buat Booking Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Mulai Titip Barang</h2>
                  <p className="text-slate-400 text-sm mt-1">Isi formulir di bawah ini untuk estimasi harga dan jadwal penjemputan.</p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Data Diri */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Nama Lengkap *</label>
                      <input required name="nama" value={formData.nama} onChange={handleInputChange} type="text" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Budi Santoso" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">No WhatsApp *</label>
                      <input required name="noWa" value={formData.noWa} onChange={handleInputChange} type="tel" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="08123456789" />
                    </div>
                  </div>

                  {/* Pickup */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Tgl Pickup *</label>
                      <input required name="tanggalPickup" value={formData.tanggalPickup} onChange={handleInputChange} type="date" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Durasi Titip *</label>
                      <select name="durasiBulan" value={formData.durasiBulan} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none">
                        <option value={1}>1 Bulan</option>
                        <option value={2}>2 Bulan</option>
                        <option value={3}>3 Bulan</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Detail Lokasi Kos (Opsional)</label>
                    <textarea name="lokasiPickup" value={formData.lokasiPickup} onChange={handleInputChange} rows={2} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none" placeholder="Nama kos, kamar nomor, patokan jalan..." />
                  </div>

                  {/* Items */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Daftar Barang *</label>
                      <button type="button" onClick={addItem} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                        + Tambah Barang
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start animate-in slide-in-from-left-4 duration-300">
                          <div className="flex-1">
                            <input required value={item.nama} onChange={(e) => handleItemChange(index, 'nama', e.target.value)} type="text" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Misal: Kulkas mini, 2 dus buku..." />
                          </div>
                          <div className="w-24">
                            <input required value={item.jumlah} onChange={(e) => handleItemChange(index, 'jumlah', Number(e.target.value))} min="1" type="number" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                          </div>
                          {items.length > 1 && (
                            <button type="button" onClick={() => removeItem(index)} className="p-3 text-slate-500 hover:text-red-400 transition-colors mt-0.5">
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-Time Classification Preview Box */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Hasil Klasifikasi Sistem (P0):
                      </label>
                      <Link
                        href="/klasifikasi"
                        id="link-simulator-from-form"
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        Detail & Simulator Lengkap &rarr;
                      </Link>
                    </div>

                    <div className={`p-4 rounded-2xl border transition-all ${
                      liveKlasifikasi.kategori === 'KATEGORI_A'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : liveKlasifikasi.kategori === 'KATEGORI_B'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                        : liveKlasifikasi.kategori === 'CUSTOM_QUOTATION'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {liveKlasifikasi.kategori === 'KATEGORI_A' ? '🎒' : liveKlasifikasi.kategori === 'KATEGORI_B' ? '📦' : liveKlasifikasi.kategori === 'CUSTOM_QUOTATION' ? '🛵' : '🚫'}
                          </span>
                          <span className="font-extrabold text-sm tracking-wide">
                            {liveKlasifikasi.kategori.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-900/80 border border-slate-700">
                          Status: {liveKlasifikasi.status}
                        </span>
                      </div>

                      <p className="text-xs font-mono text-[11px] opacity-90 leading-relaxed">
                        {liveKlasifikasi.pesan}
                      </p>

                      {liveKlasifikasi.membutuhkanPersetujuanMentor && (
                        <div className="mt-2 text-[11px] font-semibold flex items-center gap-1.5 text-amber-300">
                          <span>⚠️</span>
                          <span>Memerlukan persetujuan khusus mentor SafeTitip sebelum penjemputan.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading || liveKlasifikasi.kategori === 'REJECT'}
                  type="submit"
                  className={`w-full relative group overflow-hidden rounded-xl font-bold py-4 transition-all shadow-lg ${
                    liveKlasifikasi.kategori === 'REJECT'
                      ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50 cursor-not-allowed opacity-80'
                      : 'bg-blue-600 text-white hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-blue-900/30'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 ${liveKlasifikasi.kategori !== 'REJECT' ? 'group-hover:opacity-100' : ''} transition-opacity`}></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Memproses...
                      </>
                    ) : liveKlasifikasi.kategori === 'REJECT' ? (
                      'Pengajuan Ditolak (Periksa Barang Terlarang)'
                    ) : (
                      'Simpan Penitipan'
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}