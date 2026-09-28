// app/page.tsx
'use client';

import { useBooking } from '../lib/useBooking';

export default function Home() {
  const { bookings, tambahBooking, isLoaded } = useBooking();

  const handleTestSave = () => {
    tambahBooking({
      namaPemesanan: "Vania Ulimaz",
      nomorWA: "08123456789",
      kategoriBarang: "Kategori A",
      totalHarga: 50000
    });
    alert("Data berhasil disimpan ke Local Storage!");
  };

  if (!isLoaded) return <div className="p-10 text-white">Memuat sistem...</div>;

  return (
    <div className="p-10 font-sans min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Test Modul Storage (Vania)</h1>
      
      <button 
        onClick={handleTestSave}
        className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 transition mb-6"
      >
        + Simpan Data Dummy
      </button>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2 border-b border-gray-700 pb-2">Isi Database Local:</h2>
        <pre className="whitespace-pre-wrap text-green-400">
          {JSON.stringify(bookings, null, 2)}
        </pre>
      </div>
    </div>
  );
}