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

  test('Kategori A, 3 hari → Rp30.000', () => {
    const q = hitungQuotation('A', 3, 'HARI');
    expect(q?.totalHarga).toBe(30000);
    expect(q?.labelDurasi).toBe('3 Hari');
  });

  test('Kategori A, 2 minggu → Rp110.000', () => {
    const q = hitungQuotation('A', 2, 'MINGGU');
    expect(q?.totalHarga).toBe(110000);
    expect(q?.labelDurasi).toBe('2 Minggu');
  });

  test('Kategori B, 2 hari → Rp36.000', () => {
    const q = hitungQuotation('B', 2, 'HARI');
    expect(q?.totalHarga).toBe(36000);
    expect(q?.labelDurasi).toBe('2 Hari');
  });

  test('Durasi tidak valid → null', () => {
    const q = hitungQuotation('A', 5 as any);
    expect(q).toBeNull();
  });
});
