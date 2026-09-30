# 📦 SAFETITIP EXPRESS & CARE — 3-DAY MVP SPRINT
**Batch 9 Inatechno — Tim A**  
*Periode Magang: 28–30 September 2026*  
**Anggota Tim:** Gilang | Fauzan | Hasan | Vania

---

## 📌 1. Deskripsi Proyek
SafeTitip adalah solusi layanan penitipan barang kos berbasis web bagi mahasiswa saat masa libur panjang semester. Sistem ini dirancang untuk mencegah pengeluaran kos kosong yang sia-sia dengan menyediakan penjemputan barang langsung ke kamar kos, klasifikasi otomatis, perhitungan estimasi harga transparan, penyimpanan aman, serta dashboard operasional admin.

---

## 🛠️ 2. Arsitektur & Teknologi (Tech Stack)
- **Framework Frontend & Backend:** Next.js 16 (App Router with Turbopack) & React 19
- **Bahasa Pemrograman:** TypeScript 5
- **Styling UI:** Tailwind CSS v4 & Google Fonts (*Plus Jakarta Sans* & *Material Symbols Outlined*)
- **Database & ORM:** Prisma ORM 5 (MySQL Adapter) dengan **Graceful Local Storage Fallback** (JSON persistence di `data/bookings.json`) agar aplikasi tetap berjalan 100% tanpa error saat database lokal belum aktif.
- **Validasi Data:** Zod Schema Validator
- **Testing Framework:** Jest & ts-jest (13 unit test skenario P0 lulus 100%)

---

## 🚀 3. Prasyarat & Cara Instalasi

### Prasyarat
- Node.js versi 18.x atau lebih baru
- npm (Node Package Manager)

### Langkah Menjalankan Aplikasi
1. **Clone Repository & Buka Folder:**
   ```bash
   git clone <URL_REPOSITORY>
   cd safetitip-app
   ```

2. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

3. **Menjalankan Unit Test:**
   ```bash
   npm test
   ```
   *Seluruh 13 unit test (Quotation, Klasifikasi, dan Validator A-04) akan dijalankan.*

4. **Menjalankan Server Pengembangan (Dev Server):**
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🖥️ 4. Panduan Uji Skenario Wajib (A-01 s/d A-05)

Aplikasi telah dilengkapi tombol **"Demo Mode Preset"** di halaman Beranda untuk mempermudah reviewer/mentor menguji kriteria kelulusan:

1. **Skenario A-01: Booking 2 Dus Buku (Kategori A, 1 Bulan)**
   - Klik preset **A-01** pada form booking.
   - Sistem otomatis mengklasifikasikan sebagai **Kategori A** dengan estimasi harga **Rp 199.000**.
   - Centang persetujuan dan klik **Kirim Booking**. Data berhasil tersimpan.

2. **Skenario A-02: Booking 1 Kulkas (Kategori B, 1 Bulan)**
   - Klik preset **A-02** pada form booking.
   - Sistem mendeteksi barang besar (kulkas mini) dan mengklasifikasikan sebagai **Kategori B** dengan harga **Rp 299.000**.
   - Kirim booking dan data tersimpan.

3. **Skenario A-03: Booking Motor (Di Luar Cakupan Standard)**
   - Klik preset **A-03** pada form booking.
   - Sistem mengarahkan ke **CUSTOM QUOTATION** (*Perlu verifikasi admin*) dan tidak auto-Kategori A.

4. **Skenario A-04: Tanggal Lampau / Jumlah Kosong**
   - Klik preset **A-04** (Tanggal disetel kemarin) atau kosongkan jumlah barang.
   - Form dan validator Zod mencegah penyimpanan dan memunculkan pesan error penolakan.

5. **Skenario A-05: Perubahan Status oleh Admin**
   - Buka halaman **Dashboard Admin** di [http://localhost:3000/admin](http://localhost:3000/admin).
   - Klik tombol **"Konfirmasi"** atau **"Selesai"** pada salah satu baris booking.
   - Lakukan refresh halaman (`F5`); status baru tetap tersimpan dan tidak berubah.

---

## 👥 5. Akun & Akses Demo
- **Landing Page & Form Booking:** [http://localhost:3000](http://localhost:3000)
- **Dashboard Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)
- *Akses demo terbuka tanpa proteksi login sesuai ruang lingkup MVP Sprint.*
