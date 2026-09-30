'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function AdminBookingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [catatan, setCatatan] = useState('');

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) throw new Error('Booking tidak ditemukan');
      const data = await res.json();
      setBooking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (statusBaru: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusBaru,
          catatan: catatan || `Status diubah menjadi ${statusBaru} oleh Admin`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengubah status');
      }

      setCatatan('');
      await fetchDetail();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-500">Memuat rincian booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center max-w-md shadow-sm space-y-4">
          <span className="material-symbols-outlined text-[48px] text-rose-500">error</span>
          <h2 className="text-lg font-bold text-slate-900">Booking Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">{error || 'Data dengan ID tersebut tidak ada di sistem.'}</p>
          <Link
            href="/admin"
            className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Daftar Booking</span>
            </Link>
            <div className="h-5 w-px bg-slate-200"></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Detail Booking</p>
              <p className="font-mono text-base font-extrabold text-blue-700">{booking.kodeBooking}</p>
            </div>
          </div>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-extrabold border ${
              booking.status === 'APPROVED' || booking.status === 'DIKONFIRMASI'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : booking.status === 'CLOSED' || booking.status === 'SELESAI'
                ? 'bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {booking.status}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identitas Pemesan */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">person</span>
              Informasi Pemesan
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Nama Mahasiswa</p>
                <p className="font-bold text-slate-900 text-base">{booking.user?.nama}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold">Nomor WhatsApp</p>
                <a
                  href={`https://wa.me/${(booking.user?.noWa || '').replace(/^0/, '62')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-0.5"
                >
                  <span>{booking.user?.noWa}</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold">Alamat / Lokasi Kos</p>
                <p className="text-slate-700 mt-0.5 font-medium">{booking.lokasiPickup || '-'}</p>
              </div>
            </div>
          </div>

          {/* Rincian Layanan & Harga */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">receipt_long</span>
              Paket & Estimasi Biaya
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Kategori Barang</p>
                <span className="inline-block mt-1 font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  Kategori {booking.kategori}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold">Durasi Penitipan</p>
                <p className="font-extrabold text-slate-900 text-base mt-1">{booking.durasiBulan} Bulan</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold">Jadwal Penjemputan</p>
                <p className="font-bold text-slate-800 mt-1">
                  {booking.tanggalPickup
                    ? new Date(booking.tanggalPickup).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold">Estimasi Total</p>
                <p className="font-extrabold text-emerald-600 text-xl mt-1">
                  {Number(booking.totalHarga) === 0
                    ? 'Custom Nego'
                    : `Rp ${Number(booking.totalHarga).toLocaleString('id-ID')}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Barang */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">inventory_2</span>
            Daftar Barang Titipan ({booking.items?.length || 0} Item)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {booking.items?.map((it: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{it.namaBarang}</p>
                    <p className="text-[11px] text-slate-500">Tipe: {it.tipe || 'STANDAR'}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-extrabold text-slate-700">
                  {it.jumlah} Unit
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Aksi Perubahan Status (A-05) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">edit_calendar</span>
            Ubah Status Booking (Skenario A-05)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Catatan Perubahan (Opsional):</label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Misal: Sudah diverifikasi admin via WhatsApp..."
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                disabled={updating || booking.status === 'LEAD' || booking.status === 'MENUNGGU'}
                onClick={() => handleUpdateStatus('LEAD')}
                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold disabled:opacity-40"
              >
                Set Menunggu
              </button>
              <button
                disabled={updating || booking.status === 'APPROVED' || booking.status === 'DIKONFIRMASI'}
                onClick={() => handleUpdateStatus('APPROVED')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-40"
              >
                Set Dikonfirmasi
              </button>
              <button
                disabled={updating || booking.status === 'CLOSED' || booking.status === 'SELESAI'}
                onClick={() => handleUpdateStatus('CLOSED')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40"
              >
                Set Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Riwayat Status Log */}
        {booking.statusLogs && booking.statusLogs.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">history</span>
              Riwayat Perubahan Status ({booking.statusLogs.length})
            </h3>

            <div className="space-y-2">
              {booking.statusLogs.map((log: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{log.statusBaru}</span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span className="text-slate-600">{log.catatan || 'Diubah'}</span>
                  </div>
                  <span className="text-slate-400 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
