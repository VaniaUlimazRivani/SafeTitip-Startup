import { hitungQuotation } from '@/lib/services/quotationService';

describe('Quotation', () => {
  test('Kategori A, 1 bulan → Rp199.000', () => {
    const q = hitungQuotation('A', 1);
    expect(q?.totalHarga).toBe(199000);
  });

  test('Kategori A, 2 bulan → Rp379.000', () => {
    const q = hitungQuotation('A', 2);
    expect(q?.totalHarga).toBe(379000);
  });

  test('Kategori B, 1 bulan → Rp299.000', () => {
    const q = hitungQuotation('B', 1);
    expect(q?.totalHarga).toBe(299000);
  });

  test('Durasi tidak valid → null', () => {
    const q = hitungQuotation('A', 5 as any);
    expect(q).toBeNull();
  });
});
