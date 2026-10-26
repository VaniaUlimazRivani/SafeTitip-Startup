/**
 * Ongkir & Maps Service untuk Kosinaja (Kota Padang)
 * 
 * Pusat Patokan Penjemputan / Gudang Kosinaja:
 * Hotel Ibis Padang (Jl. Tamansiswa No.1A, Alai Parak Kopi, Kec. Padang Utara, Kota Padang)
 * Koordinat: -0.9294, 100.3632
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

export const KOSINAJA_WAREHOUSE: Coordinate & { nama: string; alamat: string } = {
  nama: 'Kosinaja Central Hub (Patokan: Hotel Ibis Padang)',
  alamat: 'Jl. Tamansiswa No.1A (Area Hotel Ibis), Alai Parak Kopi, Kec. Padang Utara, Kota Padang',
  lat: -0.9294,
  lng: 100.3632,
};

// Preset Titik Populer Mahasiswa di Padang
export interface PresetLokasi {
  id: string;
  nama: string;
  area: string;
  kategori: 'Kampus' | 'Kawasan Kos' | 'Area / Landmark';
  deskripsi: string;
  lat: number;
  lng: number;
}

export const PRESET_LOKASI_PADANG: PresetLokasi[] = [
  // Kampus & Perguruan Tinggi
  { id: 'unp_air_tawar', nama: 'Universitas Negeri Padang (UNP)', area: 'Padang Utara', kategori: 'Kampus', deskripsi: 'Kampus Utama UNP Air Tawar, Jl. Prof. Dr. Hamka', lat: -0.8970, lng: 100.3520 },
  { id: 'unand_limau_manis', nama: 'Universitas Andalas (UNAND)', area: 'Pauh', kategori: 'Kampus', deskripsi: 'Kampus Limau Manis, Gedung Perkuliahan & Asrama', lat: -0.9146, lng: 100.4586 },
  { id: 'upi_yptk', nama: 'UPI YPTK Padang', area: 'Lubuk Begalung', kategori: 'Kampus', deskripsi: 'Jl. Raya Lubuk Begalung No. 1', lat: -0.9620, lng: 100.3950 },
  { id: 'ubh_ulak_karang', nama: 'Universitas Bung Hatta (Kampus 1)', area: 'Padang Barat', kategori: 'Kampus', deskripsi: 'Jl. Sumatera, Ulak Karang', lat: -0.9150, lng: 100.3540 },
  { id: 'ubh_aiapacah', nama: 'Universitas Bung Hatta (Kampus 2)', area: 'Koto Tangah', kategori: 'Kampus', deskripsi: 'Jl. Bypass Aia Pacah', lat: -0.8520, lng: 100.3700 },
  { id: 'pnp_limau_manis', nama: 'Politeknik Negeri Padang (PNP)', area: 'Limau Manis', kategori: 'Kampus', deskripsi: 'Kampus Limau Manis Pauh', lat: -0.9135, lng: 100.4605 },
  { id: 'itp_gunung_pangilun', nama: 'Institut Teknologi Padang (ITP)', area: 'Padang Utara', kategori: 'Kampus', deskripsi: 'Jl. Gajah Mada, Gn. Pangilun', lat: -0.9090, lng: 100.3750 },
  { id: 'uin_lubuk_lintah', nama: 'UIN Imam Bonjol (Kampus 2)', area: 'Kuranji', kategori: 'Kampus', deskripsi: 'Jl. Prof. Mahmud Yunus, Lubuk Lintah', lat: -0.9320, lng: 100.3980 },
  { id: 'poltekkes_padang', nama: 'Poltekkes Kemenkes Padang', area: 'Nanggalo', kategori: 'Kampus', deskripsi: 'Jl. Simpang Pondok Kopi, Siteba', lat: -0.8920, lng: 100.3780 },
  { id: 'fk_unand_jati', nama: 'Fakultas Kedokteran UNAND (Jati)', area: 'Padang Timur', kategori: 'Kampus', deskripsi: 'Jl. Perintis Kemerdekaan, Jati (RSUP M. Djamil)', lat: -0.9380, lng: 100.3680 },

  // Kawasan Kos Mahasiswa Populer
  { id: 'kos_air_tawar_barat', nama: 'Kawasan Kos Air Tawar Barat (UNP)', area: 'Padang Utara', kategori: 'Kawasan Kos', deskripsi: 'Jl. Cendrawasih, Merpati, Belibis, Cendrawasih Baru', lat: -0.8950, lng: 100.3480 },
  { id: 'kos_air_tawar_timur', nama: 'Kawasan Kos Air Tawar Timur', area: 'Padang Utara', kategori: 'Kawasan Kos', deskripsi: 'Jl. Tunggul Hitam & belakang UNP', lat: -0.8980, lng: 100.3560 },
  { id: 'kos_pasar_baru_unand', nama: 'Kawasan Kos Pasar Baru (UNAND)', area: 'Pauh', kategori: 'Kawasan Kos', deskripsi: 'Gerbang Bawah Unand, sentra kos & kuliner mahasiswa', lat: -0.9250, lng: 100.4420 },
  { id: 'kos_kapalo_koto', nama: 'Kawasan Kos Kapalo Koto & Laluan', area: 'Pauh', kategori: 'Kawasan Kos', deskripsi: 'Kawasan kos perumahan mahasiswa Pauh', lat: -0.9310, lng: 100.4350 },
  { id: 'kos_piai_limau_manis', nama: 'Kawasan Kos Piai Tangah', area: 'Pauh', kategori: 'Kawasan Kos', deskripsi: 'Dekat kampus Unand & Politeknik', lat: -0.9350, lng: 100.4480 },
  { id: 'kos_lubeg_gurun_laweh', nama: 'Kawasan Kos Lubuk Begalung (UPI)', area: 'Lubuk Begalung', kategori: 'Kawasan Kos', deskripsi: 'Gurun Laweh, Banuaran dekat kampus UPI YPTK', lat: -0.9580, lng: 100.3920 },
  { id: 'kos_ulak_karang', nama: 'Kawasan Kos Ulak Karang (UBH)', area: 'Padang Barat', kategori: 'Kawasan Kos', deskripsi: 'Jl. Bahari, Medan, sekitar UBH Kampus 1', lat: -0.9170, lng: 100.3520 },
  { id: 'kos_gunung_pangilun', nama: 'Kawasan Kos Gunung Pangilun', area: 'Padang Utara', kategori: 'Kawasan Kos', deskripsi: 'Sekitar ITP, STIKES, dan RS Ibnu Sina', lat: -0.9120, lng: 100.3700 },
  { id: 'kos_siteba', nama: 'Kawasan Kos Siteba & Nanggalo', area: 'Nanggalo', kategori: 'Kawasan Kos', deskripsi: 'Jl. Raya Siteba & Pasar Nanggalo', lat: -0.8880, lng: 100.3800 },
  { id: 'kos_lapai', nama: 'Kawasan Kos Kampung Lapai', area: 'Nanggalo', kategori: 'Kawasan Kos', deskripsi: 'Kawasan strategis dekat Jl. Khatib Sulaiman', lat: -0.9020, lng: 100.3680 },
  { id: 'kos_kuranji', nama: 'Kawasan Kos Kuranji / Kalumbuk', area: 'Kuranji', kategori: 'Kawasan Kos', deskripsi: 'Korong Gadang & Kalumbuk', lat: -0.9180, lng: 100.4050 },
  { id: 'kos_tarandam_sawahan', nama: 'Kawasan Kos Sawahan / Tarandam', area: 'Padang Timur', kategori: 'Kawasan Kos', deskripsi: 'Pusat kota, Simpang Haru, Stasiun Padang', lat: -0.9450, lng: 100.3680 },
  { id: 'kos_tabing', nama: 'Kawasan Kos Tabing & Asrama Haji', area: 'Koto Tangah', kategori: 'Kawasan Kos', deskripsi: 'Jl. Adinegoro, Lanud Sutan Sjahrir', lat: -0.8650, lng: 100.3510 },
  { id: 'kos_lubuk_buaya', nama: 'Kawasan Kos Lubuk Buaya', area: 'Koto Tangah', kategori: 'Kawasan Kos', deskripsi: 'Pasar Lubuk Buaya & sekitarnya', lat: -0.8350, lng: 100.3280 },
  { id: 'kos_indarung', nama: 'Kawasan Kos Indarung (Semen Padang)', area: 'Lubuk Kilangan', kategori: 'Kawasan Kos', deskripsi: 'Area Semen Padang & Lubuk Kilangan', lat: -0.9580, lng: 100.4650 },
  { id: 'kos_teluk_bayur', nama: 'Kawasan Kos Teluk Bayur', area: 'Padang Selatan', kategori: 'Kawasan Kos', deskripsi: 'Seberang Padang & pelabuhan Teluk Bayur', lat: -0.9750, lng: 100.3780 },

  // Patokan Pusat / Area Khusus
  { id: 'hotel_ibis_area', nama: 'Area Hotel Ibis Padang (Hub Pusat)', area: 'Padang Utara', kategori: 'Area / Landmark', deskripsi: 'Jl. Tamansiswa No. 1A, Alai Parak Kopi (Gratis Ongkir)', lat: -0.9294, lng: 100.3632 },
];

/**
 * Menghitung jarak garis lurus (Haversine) dalam KM antara 2 koordinat
 * dan dikalikan faktor rute jalan raya (road winding factor ~1.25)
 */
export function hitungJarakKm(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371; // Radius bumi dalam KM
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;

  // Faktor koreksi rute jalan raya Kota Padang (berliku / rute jalan riil)
  const roadKm = straightKm * 1.25;
  return Math.round(roadKm * 10) / 10; // Pembulatan 1 angka desimal
}

/**
 * Menghitung ongkir dasar berdasarkan jarak riil (sesuai tabel resmi user):
 * - <= 1.0 km ➜ Gratis (Rp 0)
 * - 1.1 - 2.2 km ➜ Rp 5.000
 * - 2.3 – 3.0 km ➜ Rp 7.000
 * - 3.1 – 4.0 km ➜ Rp 8.000
 * - 4.1 – 4.5 km ➜ Rp 9.000
 * - 4.6 – 5.0 km ➜ Rp 10.000
 * - 5.1 – 5.5 km ➜ Rp 11.000
 * - 5.6 – 6.0 km ➜ Rp 12.000
 * - 6.1 – 6.5 km ➜ Rp 13.000
 * - 6.6 – 7.0 km ➜ Rp 14.000
 * - 7.1 – 7.5 km ➜ Rp 15.000
 * - 7.6 – 8.0 km ➜ Rp 16.000
 * - 8.1 – 8.5 km ➜ Rp 17.000
 * - 8.6 – 9.0 km ➜ Rp 18.000
 * - 9.1 – 9.5 km ➜ Rp 19.000
 * - 9.6 – 10.0 km ➜ Rp 20.000
 * - 10.1 - 11.0 km ➜ Rp 24.000
 * - 11.1 - 12.0 km ➜ Rp 26.000
 * - 12.1 - 13.0 km ➜ Rp 28.000
 * - 13.1 - 14.0 km ➜ Rp 30.000
 * - 14.1 - 15.0 km ➜ Rp 32.000
 * - 15.1 - 16.0 km ➜ Rp 34.000
 * - 16.1 - 17.0 km ➜ Rp 36.000
 * - 17.1 - 18.0 km ➜ Rp 38.000
 * - 18.1 - 19.0 km ➜ Rp 40.000
 * - 19.1 - 20.0 km ➜ Rp 43.000
 * - 20.1 - 21.0 km ➜ Rp 45.000
 * - 21.1 - 22.0 km ➜ Rp 47.000
 * - 22.1 - 23.0 km ➜ Rp 49.000
 * - 23.1 - 24.0 km ➜ Rp 51.000
 * - 24.1 - 25.0 km ➜ Rp 55.000
 * - > 25.0 km ➜ Rp 55.000 + Rp 2.500 / km berikutnya
 */
export function hitungTarifDasarOngkir(jarakKm: number): number {
  if (jarakKm <= 1.0) return 0; // 1km pertama GRATIS
  if (jarakKm <= 2.2) return 5000;
  if (jarakKm <= 3.0) return 7000;
  if (jarakKm <= 4.0) return 8000;
  if (jarakKm <= 4.5) return 9000;
  if (jarakKm <= 5.0) return 10000;
  if (jarakKm <= 5.5) return 11000;
  if (jarakKm <= 6.0) return 12000;
  if (jarakKm <= 6.5) return 13000;
  if (jarakKm <= 7.0) return 14000;
  if (jarakKm <= 7.5) return 15000;
  if (jarakKm <= 8.0) return 16000;
  if (jarakKm <= 8.5) return 17000;
  if (jarakKm <= 9.0) return 18000;
  if (jarakKm <= 9.5) return 19000;
  if (jarakKm <= 10.0) return 20000;
  if (jarakKm <= 11.0) return 24000;
  if (jarakKm <= 12.0) return 26000;
  if (jarakKm <= 13.0) return 28000;
  if (jarakKm <= 14.0) return 30000;
  if (jarakKm <= 15.0) return 32000;
  if (jarakKm <= 16.0) return 34000;
  if (jarakKm <= 17.0) return 36000;
  if (jarakKm <= 18.0) return 38000;
  if (jarakKm <= 19.0) return 40000;
  if (jarakKm <= 20.0) return 43000;
  if (jarakKm <= 21.0) return 45000;
  if (jarakKm <= 22.0) return 47000;
  if (jarakKm <= 23.0) return 49000;
  if (jarakKm <= 24.0) return 51000;
  if (jarakKm <= 25.0) return 55000;

  // Di atas 25 km
  const extraKm = Math.ceil(jarakKm - 25);
  return 55000 + extraKm * 2500;
}

// Konfigurasi Tarif & Operasional Ongkir
export const ONGKIR_CONFIG = {
  originWarehouse: KOSINAJA_WAREHOUSE,
  maxDistanceKm: 35, // Batas jangkauan maksimal kurir (Kota Padang & sekitarnya)
  freeDistanceKm: 1.0, // Jarak <= 1.0 km gratis
  surchargeKategoriB: 3000, // Surcharge untuk paket B atau CUSTOM
  speedKmPerHour: 25, // Kecepatan rata-rata kurir motor Padang untuk estimasi durasi fallback
};

export type TipeMetodePickup = 'PICKUP' | 'SELF_DROPOFF';
export type TipeMetodeDelivery = 'DELIVERY' | 'SELF_PICKUP';

export interface KalkulasiOngkirResult {
  jarakKm: number;
  tarifDasarPerTrip: number;
  surchargeKategori: number;
  ongkirPerTrip: number;
  metodePickup: TipeMetodePickup;
  metodeDelivery: TipeMetodeDelivery;
  ongkirPickup: number;
  ongkirDelivery: number;
  totalOngkir: number;
  mapsUrl: string;
  isFreePickup: boolean;
  estimasiWaktuMenit: number;
  isRealRoute: boolean;
  isOutOfRange: boolean;
  maxDistanceKm: number;
}

/**
 * Kalkulasi Ongkir Komprehensif
 * - Menangani surcharge Kategori B (+Rp 3.000)
 * - Menangani pilihan Penjemputan (Jemput vs Antar Sendiri)
 * - Menangani pilihan Pengantaran Kembali (Diantar vs Ambil Sendiri)
 * - Menerima jarak rute jalan riil (dari routing OSRM) atau estimasi Haversine fallback
 */
export function kalkulasiOngkirLengkap(
  userCoord: Coordinate,
  kategori: string, // 'A' | 'B' | 'CUSTOM'
  metodePickup: TipeMetodePickup = 'PICKUP',
  metodeDelivery: TipeMetodeDelivery = 'DELIVERY',
  customJarakKm?: number,
  estimasiMenit?: number,
  isRealRoute: boolean = false
): KalkulasiOngkirResult {
  const jarakKm =
    typeof customJarakKm === 'number' && !isNaN(customJarakKm)
      ? Math.round(customJarakKm * 10) / 10
      : hitungJarakKm(KOSINAJA_WAREHOUSE, userCoord);

  const isOutOfRange = jarakKm > ONGKIR_CONFIG.maxDistanceKm;
  const tarifDasarPerTrip = hitungTarifDasarOngkir(jarakKm);

  // Surcharge tipe paket: Paket B (furniture / barang sedang-besar) lebih berat/susah (+Rp 3.000)
  const isKategoriBerat = kategori === 'B' || kategori === 'CUSTOM';
  // Surcharge hanya berlaku jika tarif dasar bukan 0 (atau jika jarak > 1 km)
  const surchargeKategori = isKategoriBerat && jarakKm > ONGKIR_CONFIG.freeDistanceKm ? ONGKIR_CONFIG.surchargeKategoriB : 0;

  const ongkirPerTrip = tarifDasarPerTrip + surchargeKategori;

  const ongkirPickup = metodePickup === 'PICKUP' ? ongkirPerTrip : 0;
  const ongkirDelivery = metodeDelivery === 'DELIVERY' ? ongkirPerTrip : 0;
  const totalOngkir = ongkirPickup + ongkirDelivery;

  // Estimasi durasi tempuh (menit)
  const estimasiWaktuMenit =
    typeof estimasiMenit === 'number' && !isNaN(estimasiMenit)
      ? Math.round(estimasiMenit)
      : Math.max(5, Math.round((jarakKm / ONGKIR_CONFIG.speedKmPerHour) * 60));

  // Link resmi Google Maps untuk rute navigasi kurir
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${KOSINAJA_WAREHOUSE.lat},${KOSINAJA_WAREHOUSE.lng}&destination=${userCoord.lat},${userCoord.lng}`;

  return {
    jarakKm,
    tarifDasarPerTrip,
    surchargeKategori,
    ongkirPerTrip,
    metodePickup,
    metodeDelivery,
    ongkirPickup,
    ongkirDelivery,
    totalOngkir,
    mapsUrl,
    isFreePickup: jarakKm <= ONGKIR_CONFIG.freeDistanceKm,
    estimasiWaktuMenit,
    isRealRoute,
    isOutOfRange,
    maxDistanceKm: ONGKIR_CONFIG.maxDistanceKm,
  };
}
