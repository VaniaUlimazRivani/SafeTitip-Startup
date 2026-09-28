// app/page.tsx
'use client';

import { useState } from 'react';
import { useBooking } from '../lib/useBooking';

export default function Home() {
  const { bookings, tambahBooking, isLoaded } = useBooking();
  
  // State untuk isian form
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [namaBarang, setNamaBarang] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nanti logika klasifikasi Fauzan & harga Hasan akan disisipkan di sini
    tambahBooking({
      namaPemesanan: nama,
      nomorWA: wa,
      kategoriBarang: namaBarang, // Sementara menyimpan nama barang langsung
      totalHarga: 0 // Sementara 0 sebelum digabung dengan kode Hasan
    });

    alert("Booking berhasil disimpan!");
    setNama('');
    setWa('');
    setNamaBarang('');
  };

  if (!isLoaded) return <div className="p-10 flex justify-center text-gray-800">Memuat sistem...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600">SafeTitip</h1>
          <p className="mt-2 text-gray-600">Solusi Penitipan Barang Aman & Terpercaya</p>
        </div>

        {/* FORM BOOKING (Tugas UI Gilang) */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Formulir Penitipan</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900"
                value={nama} onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
              <input 
                type="tel" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900"
                value={wa} onChange={(e) => setWa(e.target.value)}
                placeholder="Contoh: 08123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barang yang Dititipkan</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900"
                value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)}
                placeholder="Contoh: Koper, Tas Gunung, dll"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl mt-4"
            >
              Simpan Penitipan
            </button>
          </form>
        </div>

        {/* MINI ADMIN DASHBOARD */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Daftar Penitipan (Admin)</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">Belum ada data penitipan.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-bold text-gray-800">{b.namaPemesanan} <span className="text-sm font-normal text-gray-500">({b.nomorWA})</span></p>
                    <p className="text-sm text-gray-600 mt-1">Barang: <span className="font-medium">{b.kategoriBarang}</span></p>
                    <p className="text-xs text-gray-400 mt-1">ID: {b.id}</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex flex-col items-end">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      {b.status}
                    </span>
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