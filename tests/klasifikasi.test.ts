import { klasifikasiBarang } from '@/lib/services/klasifikasiService';

describe('Klasifikasi Barang', () => {
  test('A-01: 2 dus buku → Kategori A', () => {
    const result = klasifikasiBarang([{ nama: 'dus buku', jumlah: 2 }]);
    expect(result.kategori).toBe('A');
  });

  test('A-02: 1 kulkas → Kategori B', () => {
    const result = klasifikasiBarang([{ nama: 'kulkas', jumlah: 1 }]);
    expect(result.kategori).toBe('B');
  });

  test('A-03: 1 motor → CUSTOM', () => {
    const result = klasifikasiBarang([{ nama: 'motor', jumlah: 1 }]);
    expect(result.kategori).toBe('CUSTOM');
  });

  test('Barang terlarang → REJECT', () => {
    const result = klasifikasiBarang([{ nama: 'narkotika', jumlah: 1 }]);
    expect(result.kategori).toBe('REJECT');
  });

  test('Kipas angin kecil → Kategori A (pengecualian)', () => {
    const result = klasifikasiBarang([{ nama: 'kipas angin kecil', jumlah: 1 }]);
    expect(result.kategori).toBe('A');
  });

  test('Volume >7 → CUSTOM', () => {
    const result = klasifikasiBarang(
      Array(8).fill({ nama: 'dus buku', jumlah: 1 })
    );
    expect(result.kategori).toBe('CUSTOM');
  });
});
