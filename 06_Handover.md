# 06_Handover.md — DOKUMEN SERAH-TERIMA (HANDOVER) TAHAP MVP

**Proyek:** SafeTitip Express & Care  
**Tanggal Handover:** 30 September 2026  
**Penerima Handover:** Peserta Magang Fase Oktober – Desember 2026  

---

### 1. Fitur yang Sudah Selesai (MVP P0)
1. **Landing Page Publik & Formulir Pemesanan:**
   - Desain responsif, clean, modern dengan Tailwind CSS.
   - Header terstruktur dengan tautan navigasi (Beranda, Simulasi Harga, Form Booking, Keamanan, FAQ, Admin).
   - Validasi input (nama, WA berformat 08xxx, tgl pickup tidak lampau, jumlah item minimal 1).
2. **Rule Engine Klasifikasi Otomatis:**
   - Deteksi barang Kategori A (barang kecil ≤ 3 unit).
   - Deteksi barang Kategori B (barang besar seperti kulkas/dispenser atau volume 4–7 unit).
   - Penolakan barang terlarang (narkoba, senjata, makanan busuk, uang tunai).
   - Pengalihan kendaraan bermotor & volume >7 ke skema *Custom Quotation*.
3. **Modul Quotation Real-time:**
   - Perhitungan harga simulasi ditampilkan secara langsung di formulir sebelum submit.
   - Persetujuan eksplisit syarat & harga dari pengguna.
4. **Penyimpanan Data Terpadu:**
   - Prisma ORM terhubung ke MySQL.
   - Dilengkapi fallback otomatis ke file lokal `data/bookings.json` untuk menjamin liveness aplikasi saat offline.
5. **Dashboard Admin Sederhana:**
   - Melihat daftar pemesanan masuk lengkap dengan pencarian & filter kategori/status.
   - Mengubah status pemesanan (`Menunggu` → `Dikonfirmasi` → `Selesai`) dengan penyimpanan persisten.
   - Halaman detail untuk melihat rincian pemesan, barang, dan log perubahan status.

---

### 2. Catatan & Bug Tersisa (Non-P0)
- **Otentikasi Admin:** Dashboard admin saat ini belum menggunakan otentikasi login/session JWT karena cakupan MVP disepakati open-demo. Di fase lanjutan perlu ditambahkan NextAuth / Clerk.
- **Payment Gateway:** Biaya saat ini bersifat simulasi hipotetis (belum menerima transaksi uang nyata). Integrasi payment gateway (Midtrans / Xendit) direncanakan pada fase pilot rilis komersial.

---

### 3. Rekomendasi Backlog untuk Tim Lanjutan (Oktober – Desember 2026)
1. **Modul Kurir & Mobile Web Check-in:**
   - Fitur upload foto serah terima barang langsung dari kamera ponsel kurir di kos pelanggan.
2. **Integrasi WhatsApp Business API:**
   - Pengiriman otomatis pesan konfirmasi penjemputan dan kode booking via WhatsApp API.
3. **Peta Integrasi Lokasi Kos (Google Maps / OpenStreetMap):**
   - Penentuan pin point titik jemput kos mahasiswa untuk optimasi rute armada pikap.
