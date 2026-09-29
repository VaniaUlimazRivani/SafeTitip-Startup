import { HARGA } from '../constants/harga';

export type QuotationResult = {
  kategori: string;
  durasiBulan: number;
  hargaPerBulan: number;
  totalHarga: number;
  isCustom: boolean;
};

export function hitungQuotation(
  kategori: 'A' | 'B',
  durasiBulan: 1 | 2 | 3
): QuotationResult | null {
  if (!HARGA[kategori]) return null;
  if (![1, 2, 3].includes(durasiBulan)) return null;

  const totalHarga = HARGA[kategori][durasiBulan];
  return {
    kategori,
    durasiBulan,
    hargaPerBulan: Math.round(totalHarga / durasiBulan),
    totalHarga,
    isCustom: false,
  };
}

export function buatQuotationCustom(): QuotationResult {
  return {
    kategori: 'CUSTOM',
    durasiBulan: 0,
    hargaPerBulan: 0,
    totalHarga: 0,
    isCustom: true,
  };
}
