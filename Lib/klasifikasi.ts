// ==========================================
// SAFETITIP EXPRESS & CARE - BUSINESS RULES P0 (v1.4)
// Modul Klasifikasi Barang & Validasi Rule
// ==========================================

export type StatusRule = 'WAJIB' | 'REJECT' | 'KONDISIONAL';

export interface Barang {
  nama: string;
  tipe: 'BESAR_ELEKTRONIK' | 'KECIL_ELEKTRONIK' | 'PAKAIAN' | 'KENDARAAN' | 'LAINNYA';
  isKecilPengecualian?: boolean; // Sesuai BR-A-P0-02a
  isKendaraanBermotor?: boolean; // Sesuai BR-A-P0-04a
  isTerlarangAtauBusuk?: boolean; // Sesuai BR-A-P0-04
}

export interface InputBooking {
  totalJumlahBarang: number;
  daftarBarang: Barang[];
}

export interface HasilKlasifikasi {
  kategori: 'KATEGORI_A' | 'KATEGORI_B' | 'CUSTOM_QUOTATION' | 'REJECT';
  status: StatusRule;
  pesan: string;
  membutuhkanPersetujuanMentor: boolean;
}

/**
 * Fungsi utama untuk mengklasifikasikan barang dan memvalidasi Business Rules P0
 */
export function klasifikasiDanValidasi(input: InputBooking): HasilKlasifikasi {
  const { totalJumlahBarang, daftarBarang } = input;

  // 1. Cek BR-A-P0-04: Barang terlarang, mudah busuk, uang tunai, dll -> REJECT
  const adaBarangTerlarang = daftarBarang.some(b => b.isTerlarangAtauBusuk);
  if (adaBarangTerlarang) {
    return {
      kategori: 'REJECT',
      status: 'REJECT',
      pesan: 'BR-A-P0-04: Barang terlarang, mudah busuk (makanan), uang tunai, perhiasan, atau hewan peliharaan ditolak otomatis.',
      membutuhkanPersetujuanMentor: false,
    };
  }

  // 2. Cek BR-A-P0-04a & BR-A-P0-10: Kendaraan Bermotor (Motor/Sepeda Motor) -> Custom Quotation
  const adaMotor = daftarBarang.some(b => b.isKendaraanBermotor || b.tipe === 'KENDARAAN');
  if (adaMotor || totalJumlahBarang > 7) {
    return {
      kategori: 'CUSTOM_QUOTATION',
      status: 'KONDISIONAL',
      pesan: adaMotor 
        ? 'BR-A-P0-04a & BR-A-P0-10: Kendaraan bermotor dialihkan ke skema Kuotasi Custom dan butuh persetujuan khusus mentor.'
        : 'BR-A-P0-10: Volume melebihi 7 barang / melebihi 1 pikap, dialihkan ke Kuotasi Custom.',
      membutuhkanPersetujuanMentor: true,
    };
  }

  // 3. Cek BR-A-P0-02 & BR-A-P0-02a: Penentuan Kategori A vs Kategori B
  let adaBarangBesar = false;
  let adaElektronikKecilNonPengecualian = false;

  for (const barang of daftarBarang) {
    if (barang.tipe === 'BESAR_ELEKTRONIK') {
      adaBarangBesar = true;
    }
    if (barang.tipe === 'KECIL_ELEKTRONIK' && !barang.isKecilPengecualian) {
      adaElektronikKecilNonPengecualian = true;
    }
  }

  // Logika Kategori B
  if (adaBarangBesar || adaElektronikKecilNonPengecualian) {
    return {
      kategori: 'KATEGORI_B',
      status: 'WAJIB',
      pesan: 'BR-A-P0-02: Barang besar/elektronik otomatis masuk Kategori B.',
      membutuhkanPersetujuanMentor: false,
    };
  }

  // 4. Jika volume total <= 3 (Kategori A)
  if (totalJumlahBarang <= 3) {
    return {
      kategori: 'KATEGORI_A',
      status: 'WAJIB',
      pesan: 'BR-A-P0-02a: Masuk dalam daftar/volume Kategori A (Elektronik kecil sah / Pakaian / Barang kecil).',
      membutuhkanPersetujuanMentor: false,
    };
  }

  // Default fallback jika jumlah 4 - 7 barang tanpa barang besar
  return {
    kategori: 'KATEGORI_B',
    status: 'WAJIB',
    pesan: 'Masuk Kategori B berdasarkan jumlah total barang.',
    membutuhkanPersetujuanMentor: false,
  };
}