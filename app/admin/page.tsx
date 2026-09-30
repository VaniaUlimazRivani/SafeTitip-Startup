'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filter & Pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Gagal mengambil data booking dari server');
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update Status Booking (Memenuhi Skenario A-05)
  const handleUpdateStatus = async (id: number, statusBaru: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusBaru,
          catatan: `Status diubah menjadi ${statusBaru} oleh Admin melalui Dashboard`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal memperbarui status');
      }

      await fetchBookings();
    } catch (err: any) {
      alert(`Gagal: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrik Statistik
  const stats = useMemo(() => {
    const total = bookings.length;
    const menunggu = bookings.filter((b) => b.status === 'LEAD' || b.status === 'MENUNGGU').length;
    const dikonfirmasi = bookings.filter(
      (b) => b.status === 'APPROVED' || b.status === 'DIKONFIRMASI' || b.status === 'STORED'
    ).length;
    const selesai = bookings.filter((b) => b.status === 'CLOSED' || b.status === 'SELESAI').length;
    const omset = bookings.reduce((sum, b) => sum + (Number(b.totalHarga) || 0), 0);
    return { total, menunggu, dikonfirmasi, selesai, omset };
  }, [bookings]);

  // Data Terfilter
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        (b.kodeBooking || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.user?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.user?.noWa || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'MENUNGGU'
          ? b.status === 'LEAD' || b.status === 'MENUNGGU'
          : statusFilter === 'DIKONFIRMASI'
          ? b.status === 'APPROVED' || b.status === 'DIKONFIRMASI' || b.status === 'STORED'
          : statusFilter === 'SELESAI'
          ? b.status === 'CLOSED' || b.status === 'SELESAI'
          : b.status === statusFilter;

      const matchCategory =
        categoryFilter === 'ALL' ? true : b.kategori === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [bookings, searchTerm, statusFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED' || status === 'DIKONFIRMASI') {
      return {
        label: 'Dikonfirmasi',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    if (status === 'CLOSED' || status === 'SELESAI') {
      return {
        label: 'Selesai',
        badge: 'bg-slate-200 text-slate-800 border-slate-300',
      };
    }
    if (status === 'LEAD' || status === 'MENUNGGU') {
      return {
        label: 'Menunggu Konfirmasi',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
    if (status === 'STORED') {
      return {
        label: 'Disimpan di Gudang',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    }
    return {
      label: status,
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* HEADER DASHBOARD ADMIN                                                    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Kembali ke Website</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 leading-tight">Dashboard Admin</h1>
                  <p className="text-[10px] text-slate-500 font-semibold">SafeTitip Express & Care Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchBookings}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="Muat Ulang Data"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sistem Online</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* KONTEN UTAMA DASHBOARD                                                    */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Ringkasan Statistik */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Booking</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
            <p className="text-[11px] text-slate-400 mt-1">Keseluruhan pesanan</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Menunggu</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.menunggu}</p>
            <p className="text-[11px] text-slate-400 mt-1">Perlu tindakan</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Dikonfirmasi</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.dikonfirmasi}</p>
            <p className="text-[11px] text-slate-400 mt-1">Siap penjemputan</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Selesai</p>
            <p className="text-3xl font-extrabold text-slate-700 mt-2">{stats.selesai}</p>
            <p className="text-[11px] text-slate-400 mt-1">Selesai dititipkan</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Total Nilai</p>
            <p className="text-2xl font-extrabold text-blue-700 mt-2">
              Rp {stats.omset.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Simulasi transaksi</p>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Action Guide */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan kode booking, nama pemesan, atau WhatsApp..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Filter Status & Kategori */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="MENUNGGU">Menunggu</option>
                  <option value="DIKONFIRMASI">Dikonfirmasi</option>
                  <option value="SELESAI">Selesai</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="A">Kategori A</option>
                  <option value="B">Kategori B</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-blue-700">info</span>
              Kriteria A-05: Anda dapat mengubah status booking secara instan pada tombol aksi di tabel di bawah. Perubahan tersimpan di database/local storage.
            </span>
            <span className="text-[11px] font-bold text-blue-800">
              Menampilkan {filteredBookings.length} dari {bookings.length} data
            </span>
          </div>
        </div>

        {/* Tabel Data Booking */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-500 font-semibold">Memuat daftar booking...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3 text-rose-600">
              <span className="material-symbols-outlined text-[36px]">error</span>
              <p className="text-sm font-bold">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <span className="material-symbols-outlined text-[48px] text-slate-300">inbox</span>
              <p className="text-sm font-bold text-slate-700">Tidak ada data booking yang sesuai</p>
              <p className="text-xs text-slate-400">
                Coba ubah kata kunci pencarian atau filter status.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Booking ID & Pelanggan</th>
                    <th className="py-4 px-4">Kategori & Durasi</th>
                    <th className="py-4 px-4">Daftar Barang</th>
                    <th className="py-4 px-4">Tgl Pickup</th>
                    <th className="py-4 px-4">Estimasi Biaya</th>
                    <th className="py-4 px-4">Status Saat Ini</th>
                    <th className="py-4 px-6 text-right">Ubah Status (A-05)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => {
                    const st = getStatusBadge(b.status);
                    const isUpdating = updatingId === b.id;

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ID & Pelanggan */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {b.kodeBooking}
                            </span>
                            <p className="font-extrabold text-slate-900 text-sm mt-1">{b.user?.nama}</p>
                            <a
                              href={`https://wa.me/${(b.user?.noWa || '').replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                            >
                              <span>WA: {b.user?.noWa}</span>
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </a>
                          </div>
                        </td>

                        {/* Kategori & Durasi */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                              b.kategori === 'A'
                                ? 'bg-blue-100 text-blue-800'
                                : b.kategori === 'B'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Kat {b.kategori}
                          </span>
                          <p className="text-xs text-slate-600 mt-1 font-semibold">{b.durasiBulan} Bulan</p>
                        </td>

                        {/* Barang */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="space-y-0.5">
                            {b.items?.map((it: any, idx: number) => (
                              <p key={idx} className="text-xs text-slate-700 font-medium">
                                • {it.jumlah}x {it.namaBarang}
                              </p>
                            ))}
                          </div>
                        </td>

                        {/* Tanggal Pickup */}
                        <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                          {b.tanggalPickup
                            ? new Date(b.tanggalPickup).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </td>

                        {/* Total Harga */}
                        <td className="py-4 px-4">
                          <p className="font-extrabold text-slate-900 text-sm">
                            {Number(b.totalHarga) === 0
                              ? 'Custom'
                              : `Rp ${Number(b.totalHarga).toLocaleString('id-ID')}`}
                          </p>
                        </td>

                        {/* Status Saat Ini */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${st.badge}`}
                          >
                            {st.label}
                          </span>
                        </td>

                        {/* Aksi Perubahan Status Langsung (A-05) */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <Link
                              href={`/admin/bookings/${b.id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                              title="Lihat Rincian Lengkap"
                            >
                              Detail
                            </Link>

                            {/* Tombol Cepat: Dikonfirmasi */}
                            {b.status !== 'APPROVED' && b.status !== 'DIKONFIRMASI' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(b.id, 'APPROVED')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                                title="Ubah status ke Dikonfirmasi"
                              >
                                {isUpdating ? '...' : 'Konfirmasi'}
                              </button>
                            )}

                            {/* Tombol Cepat: Selesai */}
                            {b.status !== 'CLOSED' && b.status !== 'SELESAI' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(b.id, 'CLOSED')}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50"
                                title="Ubah status ke Selesai"
                              >
                                {isUpdating ? '...' : 'Selesai'}
                              </button>
                            )}

                            {/* Tombol Kembalikan ke Menunggu */}
                            {(b.status === 'APPROVED' || b.status === 'CLOSED') && (
                              <button
                                disabled={isUpdating}
                                onClick={() => handleUpdateStatus(b.id, 'LEAD')}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all disabled:opacity-50"
                                title="Kembalikan ke status Menunggu"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}