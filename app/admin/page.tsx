// app/admin/page.tsx
'use client';

import { useBooking } from '../../lib/useBooking';
import Link from 'next/link';

export default function AdminDashboard() {
  const { bookings, isLoaded } = useBooking();

  if (!isLoaded) return <div className="p-10 text-center">Memuat sistem...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Dashboard Admin SafeTitip</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Ke Halaman Pelanggan
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Daftar Penitipan Masuk</h2>
          
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center italic">Belum ada data masuk.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="p-4 border rounded-lg flex justify-between bg-gray-50 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-bold text-lg">{b.namaPemesanan} <span className="font-normal text-sm text-gray-600">({b.kategoriBarang})</span></p>
                    <p className="text-sm text-gray-600 mt-1">WA: {b.nomorWA} | ID: {b.id}</p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">Total: Rp {b.totalHarga.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">{b.status}</span>
                    <span className="text-xs text-gray-400 mt-2">{new Date(b.tanggalDibuat).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}