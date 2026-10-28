# Panduan Integrasi Backend SafeTitip ke Aplikasi Mobile

Dokumentasi ini dibuat untuk mempermudah developer aplikasi Mobile (Flutter / React Native / Android Native / iOS) dalam menghubungkan aplikasi ke backend SafeTitip.

---

## 1. Konfigurasi Base URL

| Environment | Base URL | Keterangan |
| :--- | :--- | :--- |
| **Production (Vercel)** | `https://<your-vercel-domain>.vercel.app` | URL backend yang sudah dideploy ke Vercel |
| **Android Emulator** | `http://10.0.2.2:3000` | Localhost khusus emulator Android |
| **iOS Simulator** | `http://localhost:3000` | Localhost khusus simulator iOS |
| **Physical Device (WiFi)** | `http://<IP-Laptop-Kamu>:3000` | Pastikan HP dan laptop dalam 1 jaringan Wi-Fi |

> **Header Standar**:
> Setiap request ke backend disarankan menyertakan header:
> ```http
> Content-Type: application/json
> Accept: application/json
> ```

---

## 2. Autentikasi (Auth)

### A. Register Akun Mahasiswa
* **Endpoint**: `POST /api/auth/register`
* **Request Body**:
```json
{
  "nama": "Ahmad Zaky",
  "email": "zaky@example.com",
  "noWa": "081234567890",
  "password": "passwordRahasia",
  "alamat": "Jl. Kaliurang KM 5, Sleman, Yogyakarta"
}
```
* **Response (201 Created)**:
```json
{
  "message": "Registrasi akun berhasil!",
  "user": {
    "id": "671fb2c098a...",
    "nama": "Ahmad Zaky",
    "email": "zaky@example.com",
    "noWa": "081234567890",
    "role": "USER"
  }
}
```

---

### B. Login Akun
* **Endpoint**: `POST /api/auth/login`
* **Request Body**:
```json
{
  "email": "zaky@example.com",
  "password": "passwordRahasia"
}
```
* **Response (200 OK)**:
```json
{
  "message": "Login mahasiswa berhasil!",
  "accountType": "USER",
  "user": {
    "id": "671fb2c098a...",
    "nama": "Ahmad Zaky",
    "email": "zaky@example.com",
    "noWa": "081234567890",
    "role": "USER"
  }
}
```

---

## 3. Halaman Profil (User Profile)

### A. Mengambil Data Profil & Statistik Penitipan
* **Endpoint**: `GET /api/user/profile?userId={USER_ID}`
* **Headers Alternatif**: `x-user-id: {USER_ID}`
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "user": {
    "id": "671fb2c098a...",
    "nama": "Ahmad Zaky",
    "email": "zaky@example.com",
    "noWa": "081234567890",
    "alamat": "Jl. Kaliurang KM 5, Sleman",
    "createdAt": "2026-10-28T04:14:36.000Z"
  },
  "stats": {
    "totalBookings": 4,
    "activeBookings": 1,
    "completedBookings": 3
  }
}
```

---

### B. Memperbarui Data Profil (Update Nama, No WA, Alamat, Password)
* **Endpoint**: `PUT /api/user/profile`
* **Request Body**:
```json
{
  "userId": "671fb2c098a...",
  "nama": "Ahmad Zaky M",
  "noWa": "081299887766",
  "alamat": "Kost Putra Asri, Sleman",
  "currentPassword": "passwordLama",       // Opsional (diisi hanya jika ingin ubah sandi)
  "newPassword": "passwordBaru123"        // Opsional (min 6 karakter)
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui!",
  "user": {
    "id": "671fb2c098a...",
    "nama": "Ahmad Zaky M",
    "email": "zaky@example.com",
    "noWa": "081299887766",
    "alamat": "Kost Putra Asri, Sleman",
    "createdAt": "2026-10-28T04:14:36.000Z"
  }
}
```

---

## 4. History Penitipan & Peminjaman (Bookings)

### A. Mendapatkan Daftar Riwayat Penitipan User
* **Endpoint**: `GET /api/bookings?userId={USER_ID}`
* **Query Filter Opsional**:
  - `userId`: ID pengguna
  - `status`: `LEAD`, `APPROVED`, `IN_STORAGE`, `COMPLETED`, dll.
* **Response (200 OK)**:
```json
[
  {
    "id": "671fb34098b...",
    "kodeBooking": "STP-98214",
    "userId": "671fb2c098a...",
    "kategori": "A",
    "durasiBulan": 3,
    "totalHarga": 150000,
    "status": "APPROVED",
    "paymentStatus": "PAID",
    "tanggalPickup": "2026-11-01T08:00:00.000Z",
    "lokasiPickup": "Kos Anggrek No 12",
    "metodePickup": "PICKUP",
    "metodeDelivery": "DELIVERY",
    "totalOngkir": 15000,
    "createdAt": "2026-10-28T05:00:00.000Z",
    "items": [
      {
        "id": "671fb34098c...",
        "namaBarang": "Kardus Pakaian Sedang",
        "tipe": "KECIL",
        "jumlah": 2
      }
    ],
    "quotation": {
      "hargaPerBulan": 45000,
      "totalHarga": 135000
    },
    "payment": {
      "orderId": "ST-STP-98214-9123",
      "amount": 150000,
      "status": "SETTLEMENT",
      "paymentType": "gopay"
    }
  }
]
```

---

### B. Mendapatkan Detail Penitipan Berdasarkan ID
* **Endpoint**: `GET /api/bookings/{BOOKING_ID}`
* **Response (200 OK)**:
Mengembalikan data lengkap booking meliputi:
- `user`: identitas pemilik barang
- `items`: daftar barang yang dititipkan
- `quotation`: rincian harga sewa
- `conditionReport`: dokumentasi foto barang sebelum dan sesudah packing
- `weeklyUpdates`: laporan mingguan kondisi barang di gudang
- `payment`: status transaksi Midtrans
- `statusLogs`: timeline perubahan status penitipan

---

## 5. Pembayaran dengan Midtrans

Alur kerja pembayaran di Mobile:
```
1. Mobile memanggil POST /api/payments/snap-token
   ↓
2. Backend menghasilkan Snap Token & Redirect URL dari Midtrans
   ↓
3. Mobile membuka Snap via WebView atau Midtrans Mobile SDK
   ↓
4. Pengguna menyelesaikan pembayaran (QRIS / GoPay / Transfer Bank / ShopeePay)
   ↓
5. Webhook Midtrans secara otomatis mengabari backend di /api/payments/notification
   ↓
6. Backend memverifikasi tanda tangan & mengubah paymentStatus menjadi PAID
   ↓
7. Mobile mengecek status terbaru via GET /api/payments/{BOOKING_ID}
```

### A. Membuat Snap Token Transaksi
* **Endpoint**: `POST /api/payments/snap-token`
* **Request Body**:
```json
{
  "bookingId": "671fb34098b..."
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Token pembayaran Midtrans berhasil dibuat.",
  "data": {
    "token": "d50c776e-e77c-473c-ba30-f4b93198eb5a",
    "redirectUrl": "https://app.sandbox.midtrans.com/snap/v2/vtweb/d50c776e-e77c-473c-ba30-f4b93198eb5a",
    "orderId": "ST-STP-98214-4512",
    "grossAmount": 150000,
    "bookingId": "671fb34098b...",
    "kodeBooking": "STP-98214"
  }
}
```

> **Cara Implementasi di Mobile**:
> - **Opsi 1 (Paling Mudah)**: Buka `redirectUrl` menggunakan paket `webview_flutter` atau `react-native-webview`. Saat URL selesai atau kembali ke callback, refresh halaman riwayat.
> - **Opsi 2**: Gunakan Midtrans Mobile SDK (Android/iOS/Flutter) menggunakan `token`.

---

### B. Cek Status Pembayaran Realtime
* **Endpoint**: `GET /api/payments/{BOOKING_ID}`
* **Response (200 OK)**:
```json
{
  "success": true,
  "bookingId": "671fb34098b...",
  "kodeBooking": "STP-98214",
  "totalHarga": 150000,
  "paymentStatus": "PAID",
  "payment": {
    "orderId": "ST-STP-98214-4512",
    "amount": 150000,
    "status": "SETTLEMENT",
    "paymentType": "qris",
    "transactionTime": "2026-10-28T05:10:00.000Z",
    "settlementTime": "2026-10-28T05:11:00.000Z"
  }
}
```

---

### C. Webhook Notifikasi Midtrans
* **Endpoint**: `POST /api/payments/notification`
* **URL untuk didaftarkan di Midtrans Dashboard**:
  `https://<your-domain>.vercel.app/api/payments/notification`
* Backend memverifikasi SHA-512 signature otomatis dan memperbarui status booking menjadi `PAID` begitu dana diterima.

---

## 6. Environment Variables Midtrans

Tambahkan variabel berikut pada file `.env.local` dan di dashboard Environment Variables **Vercel**:
```env
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
```
*(Gunakan key Sandbox untuk tahap development dan uji coba).*
