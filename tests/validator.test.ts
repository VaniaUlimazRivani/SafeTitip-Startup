import { bookingSchema } from '@/lib/validators/bookingValidator';

describe('Skenario A-04: Validasi Form Booking', () => {
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getTodayStr = () => formatLocalDate(new Date());

  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatLocalDate(d);
  };

  test('Tanggal pickup lampau harus ditolak', () => {
    const input = {
      nama: 'Budi Santoso',
      noWa: '081234567890',
      tanggalPickup: getYesterdayStr(),
      durasiBulan: 1,
      items: [{ nama: 'dus buku', jumlah: 2 }],
    };

    const parsed = bookingSchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message);
      expect(messages).toContain('Tanggal pickup tidak boleh lampau');
    }
  });

  test('Jumlah barang 0 atau kosong harus ditolak', () => {
    const input = {
      nama: 'Budi Santoso',
      noWa: '081234567890',
      tanggalPickup: getTodayStr(),
      durasiBulan: 1,
      items: [{ nama: 'dus buku', jumlah: 0 }],
    };

    const parsed = bookingSchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message);
      expect(messages).toContain('Jumlah minimal 1');
    }
  });

  test('Input valid harus diterima', () => {
    const input = {
      nama: 'Budi Santoso',
      noWa: '081234567890',
      tanggalPickup: getTodayStr(),
      durasiBulan: 1,
      items: [{ nama: 'dus buku', jumlah: 2 }],
    };

    const parsed = bookingSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });
});
