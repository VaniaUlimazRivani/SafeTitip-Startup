import { HARGA_BULANAN, TARIF_DASAR, TipeDurasi } from '../constants/harga';

export type QuotationResult = {
  kategori: string;
  tipeDurasi: TipeDurasi;
  durasiNilai: number;
  durasiBulan: number;
  labelDurasi: string;
  hargaPerSatuan: number;
  hargaPerBulan: number;
  totalHarga: number;
  isCustom: boolean;
};

export function hitungQuotation(
  kategori: 'A' | 'B',
  durasiNilai: number,
  tipeDurasi: TipeDurasi = 'BULAN'
): QuotationResult | null {
  if (!TARIF_DASAR[kategori]) return null;
  if (!durasiNilai || durasiNilai < 1 || !Number.isInteger(durasiNilai)) return null;

  let totalHarga = 0;
  let hargaPerSatuan = 0;
  let labelDurasi = '';

  if (tipeDurasi === 'HARI') {
    if (durasiNilai > 7) return null; // Maksimal 7 hari untuk paket harian
    hargaPerSatuan = TARIF_DASAR[kategori].HARI;
    totalHarga = hargaPerSatuan * durasiNilai;
    labelDurasi = `${durasiNilai} Hari`;
  } else if (tipeDurasi === 'MINGGU') {
    hargaPerSatuan = TARIF_DASAR[kategori].MINGGU;
    totalHarga = hargaPerSatuan * durasiNilai;
    labelDurasi = `${durasiNilai} Minggu`;
  } else if (tipeDurasi === 'BULAN') {
    if (![1, 2, 3].includes(durasiNilai)) return null;
    totalHarga = HARGA_BULANAN[kategori][durasiNilai];
    hargaPerSatuan = Math.round(totalHarga / durasiNilai);
    labelDurasi = `${durasiNilai} Bulan`;
  } else {
    return null;
  }

  // Hitung ekuivalen durasiBulan (integer >= 1 untuk kompatibilitas DB)
  let ekuivalenBulan = durasiNilai;
  if (tipeDurasi === 'HARI') {
    ekuivalenBulan = Math.max(1, Math.ceil(durasiNilai / 30));
  } else if (tipeDurasi === 'MINGGU') {
    ekuivalenBulan = Math.max(1, Math.ceil(durasiNilai / 4));
  }

  return {
    kategori,
    tipeDurasi,
    durasiNilai,
    durasiBulan: ekuivalenBulan,
    labelDurasi,
    hargaPerSatuan,
    hargaPerBulan: hargaPerSatuan,
    totalHarga,
    isCustom: false,
  };
}

export function buatQuotationCustom(): QuotationResult {
  return {
    kategori: 'CUSTOM',
    tipeDurasi: 'BULAN',
    durasiNilai: 0,
    durasiBulan: 0,
    labelDurasi: 'Kustom',
    hargaPerSatuan: 0,
    hargaPerBulan: 0,
    totalHarga: 0,
    isCustom: true,
  };
}
