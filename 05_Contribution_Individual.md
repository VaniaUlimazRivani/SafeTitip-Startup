# 05_Contribution_Individual.md — LAPORAN KONTRIBUSI ANGGOTA TIM A

**Proyek:** SafeTitip Express & Care MVP  
**Periode Sprint:** 28–30 September 2026  

---

### 1. Vania Ulimaz Rivani (PIC Integrasi & Frontend Developer)
- **Modul & Kode:**
  - UI Landing page utama ([app/page.tsx](file:///d:/STARTUP-TIM_A/safetitip-app/app/page.tsx)), form booking responsif, live quotation preview, persetujuan syarat, dan kalkulator harga mandiri.
  - UI Dashboard Admin ([app/admin/page.tsx](file:///d:/STARTUP-TIM_A/safetitip-app/app/admin/page.tsx)) dan Halaman Detail Booking ([app/admin/bookings/[id]/page.tsx](file:///d:/STARTUP-TIM_A/safetitip-app/app/admin/bookings/[id]/page.tsx)).
  - Desain sistem Tailwind CSS dan header navigation interaktif.
- **Masalah yang Diselesaikan:**
  - Menghubungkan seluruh alur data end-to-end dari form publik hingga ke dashboard admin.
  - Mengintegrasikan preview harga real-time sebelum submit formulir sesuai mandat Modul P0.

---

### 2. Gilang (Penyimpanan Data & Repository)
- **Modul & Kode:**
  - Model skema database Prisma ([prisma/schema.prisma](file:///d:/STARTUP-TIM_A/safetitip-app/prisma/schema.prisma)) dan arsitektur repositori terpadu ([lib/repository/bookingRepo.ts](file:///d:/STARTUP-TIM_A/safetitip-app/lib/repository/bookingRepo.ts)).
  - Endpoint REST API ([app/api/bookings/route.ts](file:///d:/STARTUP-TIM_A/safetitip-app/app/api/bookings/route.ts)) dan modul generator kode booking unik.
- **Masalah yang Diselesaikan:**
  - Menyediakan *Graceful Storage Fallback* (JSON persistence di `data/bookings.json`) agar aplikasi tidak pernah mengalami crash 500 jika MySQL lokal mentor belum dinyalakan saat demo.

---

### 3. Fauzan (Modul Quotation & Logika Harga)
- **Modul & Kode:**
  - Modul perhitungan harga dan pemetaan durasi ([lib/services/quotationService.ts](file:///d:/STARTUP-TIM_A/safetitip-app/lib/services/quotationService.ts)).
  - Tabel konstanta harga resmi MVP ([lib/constants/harga.ts](file:///d:/STARTUP-TIM_A/safetitip-app/lib/constants/harga.ts)).
  - Unit test kalkulasi harga ([tests/quotation.test.ts](file:///d:/STARTUP-TIM_A/safetitip-app/tests/quotation.test.ts)).
- **Masalah yang Diselesaikan:**
  - Memastikan harga Kategori A (Rp 199k / Rp 379k / Rp 499k) dan Kategori B (Rp 299k / Rp 499k / Rp 699k) terhitung akurat sesuai durasi 1, 2, atau 3 bulan.

---

### 4. Hasan (Klasifikasi Barang & Rule Engine P0)
- **Modul & Kode:**
  - Rule engine klasifikasi barang ([lib/services/klasifikasiService.ts](file:///d:/STARTUP-TIM_A/safetitip-app/lib/services/klasifikasiService.ts)).
  - Whitelist kategori barang ([lib/constants/barangKategori.ts](file:///d:/STARTUP-TIM_A/safetitip-app/lib/constants/barangKategori.ts)).
  - Unit test klasifikasi barang dan kasus gagal ([tests/klasifikasi.test.ts](file:///d:/STARTUP-TIM_A/safetitip-app/tests/klasifikasi.test.ts)).
- **Masalah yang Diselesaikan:**
  - Memvalidasi aturan penolakan otomatis barang berbahaya/makanan busuk (BR-A-P0-04) serta pengalihan motor ke kuotasi custom (BR-A-P0-04a).
