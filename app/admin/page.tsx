'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { STATUS_FLOW, statusBerikutnya } from '../../lib/constants/status';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Gagal mengambil data booking');
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

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    const nextStatus = statusBerikutnya(currentStatus);
    if (!nextStatus) return;
    
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, catatan: 'Diupdate dari dashboard admin' }),
      });
      if (!res.ok) throw new Error('Gagal update status');
      await fetchBookings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      LEAD: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      QUOTATION: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      APPROVED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      PICKUP_VERIFIED: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      STORED: 'bg-green-500/20 text-green-300 border-green-500/30',
      RETURNED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      CLOSED: 'bg-slate-800 text-slate-500 border-slate-700',
      DISPUTE: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              &larr; Ke Landing Page
            </Link>
            <div className="h-6 w-px bg-slate-700"></div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/klasifikasi" className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors">
              🔍 Engine Klasifikasi
            </Link>
            <div className="text-sm px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              Internal System
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Daftar Penitipan Masuk</h2>
              <p className="text-slate-400">Kelola dan pantau seluruh data penitipan pelanggan dari satu tempat.</p>
            </div>
            <button onClick={fetchBookings} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 text-sm font-medium">
              Refresh Data
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-slate-400">Memuat data dari database...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-slate-950/50 rounded-2xl border border-dashed border-slate-700">
              <p className="text-slate-500">Belum ada data booking masuk hari ini.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((b) => {
                const nextStat = statusBerikutnya(b.status);
                return (
                  <div key={b.id} className="group relative bg-slate-950/50 hover:bg-slate-800/80 p-6 rounded-2xl border border-slate-800 transition-all duration-300 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700">
                          {b.kodeBooking}
                        </span>
                        <h3 className="text-lg font-bold text-white capitalize">{b.user?.nama || 'Unknown'}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          Kat: <strong className={b.kategori === 'CUSTOM' ? 'text-orange-400' : 'text-blue-400'}>{b.kategori}</strong>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-400">
                        <div>
                          <span className="block text-slate-500 text-xs uppercase mb-0.5">Kontak WA</span>
                          <span className="text-slate-200">{b.user?.noWa}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 text-xs uppercase mb-0.5">Tgl Pickup</span>
                          <span className="text-slate-200">{new Date(b.tanggalPickup).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 text-xs uppercase mb-0.5">Barang</span>
                          <span className="text-slate-200">{b.items?.map((i: any) => `${i.jumlah}x ${i.namaBarang}`).join(', ')}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 text-xs uppercase mb-0.5">Durasi & Harga</span>
                          <span className="text-slate-200 font-semibold">{b.durasiBulan} Bulan - Rp {b.totalHarga.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(b.status)}`}>
                        {b.status}
                      </div>
                      
                      {nextStat && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, b.status)}
                          disabled={updatingId === b.id}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                          {updatingId === b.id ? 'Memproses...' : `Update ➔ ${nextStat}`}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}