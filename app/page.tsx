// app/page.tsx
'use client';

import { useState } from 'react';
import { useBooking } from '../lib/useBooking';
import { cekKlasifikasi, hitungHarga } from '../lib/rules';
import Link from 'next/link';

export default function Home() {
  const { tambahBooking, isLoaded } = useBooking();
  
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [durasi, setDurasi] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasil = cekKlasifikasi(namaBarang, jumlah);
    if (hasil.status === 'REJECT') {
      alert(hasil.pesan);
      return; 
    }

    const hargaFinal = hitungHarga(hasil.kategori, durasi);

    tambahBooking({
      namaPemesanan: nama,
      nomorWA: wa,
      kategoriBarang: hasil.kategori,
      totalHarga: hargaFinal
    });

    alert(`Tersimpan! ${hasil.pesan} Total: Rp ${hargaFinal.toLocaleString('id-ID')}`);
    setNama(''); setWa(''); setNamaBarang(''); setJumlah(1); setDurasi(1);
  };

  if (!isLoaded) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="flex justify-end">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-600">
            Login Admin &rarr;
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600">SafeTitip</h1>
          <p className="mt-2 text-gray-600">Solusi Penitipan Barang Aman & Terpercaya</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">Form Formulir Penitipan P0</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" className="w-full p-3 border rounded-lg" placeholder="Nama Lengkap" value={nama} onChange={e=>setNama(e.target.value)} />
            <input required type="tel" className="w-full p-3 border rounded-lg" placeholder="No WA" value={wa} onChange={e=>setWa(e.target.value)} />
            <input required type="text" className="w-full p-3 border rounded-lg" placeholder="Nama Barang (mis: Kulkas, Makanan)" value={namaBarang} onChange={e=>setNamaBarang(e.target.value)} />
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-gray-600 mb-1 block">Jumlah Barang</label>
                <input required type="number" min="1" className="w-full p-3 border rounded-lg" value={jumlah} onChange={e=>setJumlah(Number(e.target.value))} />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-gray-600 mb-1 block">Durasi</label>
                <select className="w-full p-3 border rounded-lg" value={durasi} onChange={e=>setDurasi(Number(e.target.value))}>
                  <option value={1}>1 Bulan</option>
                  <option value={2}>2 Bulan</option>
                  <option value={3}>3 Bulan</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition">Simpan Penitipan</button>
          </form>
        </div>

      </div>
    </div>
  );
}