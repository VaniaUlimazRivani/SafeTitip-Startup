export type TipeDurasi = 'HARI' | 'MINGGU' | 'BULAN';

export const TARIF_DASAR: Record<'A' | 'B', Record<TipeDurasi, number>> = {
  A: {
    HARI: 10000,
    MINGGU: 55000,
    BULAN: 199000,
  },
  B: {
    HARI: 18000,
    MINGGU: 95000,
    BULAN: 299000,
  },
};

// Paket khusus durasi bulanan (1, 2, 3 bulan)
export const HARGA_BULANAN: Record<string, Record<number, number>> = {
  A: { 1: 199000, 2: 379000, 3: 499000 },
  B: { 1: 299000, 2: 499000, 3: 699000 },
};

// Kompatibilitas mundur
export const HARGA: Record<string, Record<number, number>> = HARGA_BULANAN;
