import Image from "next/image";
import { klasifikasiDanValidasi, InputBooking } from "@/Lib/klasifikasi";

export default function Home() {
  // Skenario Test 1: Kipas angin kecil (Kategori A - BR-A-P0-02a)
  const test1: InputBooking = {
    totalJumlahBarang: 2,
    daftarBarang: [
      { nama: "Kipas Angin Meja", tipe: "KECIL_ELEKTRONIK", isKecilPengecualian: true }
    ]
  };

  // Skenario Test 2: Motor (Custom Quotation - BR-A-P0-04a & BR-A-P0-10)
  const test2: InputBooking = {
    totalJumlahBarang: 1,
    daftarBarang: [
      { nama: "Motor Beat", tipe: "KENDARAAN", isKendaraanBermotor: true }
    ]
  };

  // Skenario Test 3: Barang Terlarang (Reject - BR-A-P0-04)
  const test3: InputBooking = {
    totalJumlahBarang: 1,
    daftarBarang: [
      { nama: "Durian Busuk", tipe: "LAINNYA", isTerlarangAtauBusuk: true }
    ]
  };

  const hasil1 = klasifikasiDanValidasi(test1);
  const hasil2 = klasifikasiDanValidasi(test2);
  const hasil3 = klasifikasiDanValidasi(test3);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-6">
      <main className="flex flex-col w-full max-w-2xl gap-8 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            🛡️ SafeTitip - Test Modul Klasifikasi (P0 v1.4)
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Halaman uji coba otomatis untuk validasi Business Rules P0.
          </p>
        </div>

        {/* Hasil Test 1 */}
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
          <h2 className="font-semibold text-blue-600 dark:text-blue-400">Test 1: Kipas Angin Kecil (Kategori A)</h2>
          <p className="text-xs text-zinc-500 mt-1">Input: Kipas angin kecil (Pengecualian BR-A-P0-02a)</p>
          <pre className="mt-2 p-2 bg-black text-green-400 text-xs rounded overflow-x-auto">
            {JSON.stringify(hasil1, null, 2)}
          </pre>
        </div>

        {/* Hasil Test 2 */}
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
          <h2 className="font-semibold text-amber-600 dark:text-amber-400">Test 2: Motor (Custom Quotation)</h2>
          <p className="text-xs text-zinc-500 mt-1">Input: Motor Beat (BR-A-P0-04a & BR-A-P0-10)</p>
          <pre className="mt-2 p-2 bg-black text-green-400 text-xs rounded overflow-x-auto">
            {JSON.stringify(hasil2, null, 2)}
          </pre>
        </div>

        {/* Hasil Test 3 */}
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
          <h2 className="font-semibold text-red-600 dark:text-red-400">Test 3: Barang Terlarang / Makanan (Reject)</h2>
          <p className="text-xs text-zinc-500 mt-1">Input: Durian Busuk (BR-A-P0-04)</p>
          <pre className="mt-2 p-2 bg-black text-green-400 text-xs rounded overflow-x-auto">
            {JSON.stringify(hasil3, null, 2)}
          </pre>
        </div>

      </main>
    </div>
  );
}