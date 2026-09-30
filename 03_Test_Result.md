# 03_Test_Result.md — HASIL UJI MINIMUM TIM A (A-01 s/d A-05)

**Proyek:** SafeTitip MVP Sprint Batch 9  
**Tanggal Uji:** 30 September 2026  
**Status Keseluruhan:** **100% LULUS (ALL PASS)**  

---

### Tabel Ringkasan Pengujian

| Kode | Skenario Wajib | Input Uji | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A-01** | Booking 2 dus buku, durasi 1 bulan | Nama: Budi, WA: 081234567890, Barang: 2 dus buku, Durasi: 1 Bulan | Kategori A; Estimasi Rp199.000; Booking tersimpan. | Sistem mengklasifikasikan sebagai Kategori A; Menampilkan harga Rp199.000; Booking tersimpan di DB & muncul di Admin. | **PASS** |
| **A-02** | Booking 1 kulkas, durasi 1 bulan | Nama: Dewi, WA: 085712345678, Barang: 1 kulkas mini, Durasi: 1 Bulan | Kategori B; Estimasi Rp299.000; Booking tersimpan. | Sistem mendeteksi barang besar (kulkas) sebagai Kategori B; Menampilkan Rp299.000; Booking tersimpan. | **PASS** |
| **A-03** | Barang motor atau di luar cakupan | Nama: Rian, WA: 081398765432, Barang: 1 motor vario, Durasi: 1 Bulan | Masuk pemeriksaan admin / kuotasi custom; Tidak auto-A. | Sistem menetapkan kategori "CUSTOM" dengan notifikasi butuh verifikasi admin; Tidak auto-A. | **PASS** |
| **A-04** | Tanggal pickup lampau / jumlah kosong | Tanggal pickup: kemarin (kemarin < hari ini), atau jumlah barang = 0 | Form mencegah penyimpanan dan menampilkan pesan kesalahan. | Input HTML date memblokir tgl lampau via `min`, validator backend menolak dengan pesan *"Tanggal pickup tidak boleh lampau"* atau *"Jumlah minimal 1"*. | **PASS** |
| **A-05** | Admin mengubah satu status booking | Booking ID #1 diubah dari `LEAD`/`MENUNGGU` menjadi `APPROVED` atau `CLOSED` | Perubahan tersimpan dan tetap tampil setelah refresh browser. | Status terupdate di database/storage; Saat di-refresh (F5), status tetap `APPROVED` / `CLOSED` dan tercatat di riwayat status logs. | **PASS** |

---

### Hasil Eksekusi Unit Test Otomatis (Jest)
```bash
> safetitip-app@0.1.0 test
> jest

PASS tests/quotation.test.ts
PASS tests/klasifikasi.test.ts
PASS tests/validator.test.ts

Test Suites: 3 passed, 3 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        1.758 s
Ran all test suites.
```
