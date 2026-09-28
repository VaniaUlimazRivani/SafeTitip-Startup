import { klasifikasiDanValidasi, InputBooking } from './klasifikasi';

// Test Case 1: Kipas angin kecil (Harus Kategori A - Sesuai BR-A-P0-02a)
const test1: InputBooking = {
  totalJumlahBarang: 2,
  daftarBarang: [
    { nama: 'Kipas Angin Meja', tipe: 'KECIL_ELEKTRONIK', isKecilPengecualian: true }
  ]
};

// Test Case 2: Motor (Harus Custom Quotation - Sesuai BR-A-P0-04a & BR-A-P0-10)
const test2: InputBooking = {
  totalJumlahBarang: 1,
  daftarBarang: [
    { nama: 'Motor Beat', tipe: 'KENDARAAN', isKendaraanBermotor: true }
  ]
};

// Test Case 3: Makanan/Barang Terlarang (Harus Reject - Sesuai BR-A-P0-04)
const test3: InputBooking = {
  totalJumlahBarang: 1,
  daftarBarang: [
    { nama: 'Durian Busuk', tipe: 'LAINNYA', isTerlarangAtauBusuk: true }
  ]
};

console.log("--- HASIL TEST SAFE-TITIP ---");
console.log("Test 1 (Kipas Kecil):", klasifikasiDanValidasi(test1));
console.log("Test 2 (Motor):", klasifikasiDanValidasi(test2));
console.log("Test 3 (Terlarang):", klasifikasiDanValidasi(test3));