// app/page.tsx
'use client';

import { useState } from 'react';
import { useBooking } from '../lib/useBooking';
import { cekKlasifikasi, hitungHarga } from '../lib/rules';

export default function Home() {
  const { bookings, tambahBooking, isLoaded } = useBooking();
  
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [durasi, setDurasi] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Panggil logika Fauzan
    const hasil = cekKlasifikasi(namaBarang, jumlah);
    if (hasil.status === 'REJECT') {
      alert(hasil.pesan);
      return; // Berhenti jika barang terlarang
    }

    // Panggil logika Hasan
    const hargaFinal = hitungHarga(hasil.kategori, durasi);

    // Panggil penyimpanan Vania
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
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-600 text-center">SafeTitip</h1>
        
        <div className="bg-white p-8 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">Form Penitipan P0</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" className="w-full p-2 border rounded" placeholder="Nama Lengkap" value={nama} onChange={e=>setNama(e.target.value)} />
            <input required type="text" className="w-full p-2 border rounded" placeholder="No WA" value={wa} onChange={e=>setWa(e.target.value)} />
            <input required type="text" className="w-full p-2 border rounded" placeholder="Nama Barang (mis: Kulkas, Makanan)" value={namaBarang} onChange={e=>setNamaBarang(e.target.value)} />
            <div className="flex gap-4">
              <input required type="number" min="1" className="w-1/2 p-2 border rounded" placeholder="Jumlah" value={jumlah} onChange={e=>setJumlah(Number(e.target.value))} />
              <select className="w-1/2 p-2 border rounded" value={durasi} onChange={e=>setDurasi(Number(e.target.value))}>
                <option value={1}>1 Bulan</option>
                <option value={2}>2 Bulan</option>
                <option value={3}>3 Bulan</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded mt-2">Simpan Penitipan</button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">Dashboard Admin</h2>
          {bookings.map(b => (
            <div key={b.id} className="p-4 border rounded mb-2 flex justify-between">
              <div>
                <p className="font-bold">{b.namaPemesanan} <span className="font-normal text-sm">({b.kategoriBarang})</span></p>
                <p className="text-sm">Rp {b.totalHarga.toLocaleString('id-ID')}</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full h-fit">{b.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}