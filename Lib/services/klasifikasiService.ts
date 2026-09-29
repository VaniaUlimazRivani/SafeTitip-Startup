import {
  BARANG_TERLARANG,
  ELEKTRONIK_KECIL,
  BARANG_BESAR,
  KENDARAAN,
} from '../constants/barangKategori';

export type KategoriResult = {
  kategori: 'A' | 'B' | 'CUSTOM' | 'REJECT';
  alasan: string;
};

export function klasifikasiBarang(
  items: Array<{ nama: string; jumlah?: number }>
): KategoriResult {
  const namaLower = items.map((i) => i.nama.toLowerCase().trim());
  const totalVolume = items.reduce((sum, i) => sum + (i.jumlah || 1), 0);

  // BR-A-P0-04: Barang terlarang → REJECT
  for (const nama of namaLower) {
    if (BARANG_TERLARANG.some((b) => nama.includes(b))) {
      return { kategori: 'REJECT', alasan: `Barang terlarang: ${nama}` };
    }
  }

  // BR-A-P0-04a: Kendaraan bermotor → CUSTOM
  for (const nama of namaLower) {
    if (KENDARAAN.some((k) => nama.includes(k))) {
      return {
        kategori: 'CUSTOM',
        alasan: 'Kendaraan bermotor butuh persetujuan khusus',
      };
    }
  }

  // BR-A-P0-10: Volume >7 → CUSTOM
  if (totalVolume > 7) {
    return {
      kategori: 'CUSTOM',
      alasan: 'Volume melebihi kapasitas Kategori B',
    };
  }

  // BR-A-P0-02: Barang besar/elektronik besar → B
  for (const nama of namaLower) {
    if (BARANG_BESAR.some((b) => nama.includes(b))) {
      return { kategori: 'B', alasan: 'Ada barang besar/elektronik besar' };
    }
  }

  // BR-A-P0-02: Volume 4-7 → B
  if (totalVolume >= 4 && totalVolume <= 7) {
    return { kategori: 'B', alasan: 'Volume 4-7 barang' };
  }

  // Default: Kategori A (termasuk elektronik kecil ≤3)
  return { kategori: 'A', alasan: 'Barang kecil, volume 1-3' };
}
