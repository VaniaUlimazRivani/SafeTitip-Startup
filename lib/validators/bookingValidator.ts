import { z } from 'zod';

export const bookingSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  noWa: z
    .string()
    .regex(/^08\d{8,12}$/, 'No WA tidak valid (format 08xxx)'),
  persona: z.string().optional(),
  alamat: z.string().optional(),
  tanggalPickup: z.string().refine((val) => {
    // Parse tanggal dengan aman tanpa bias UTC
    const parts = val.split('T')[0].split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
      return false;
    }
    const inputDate = new Date(parts[0], parts[1] - 1, parts[2]);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate.getTime() >= today.getTime();
  }, 'Tanggal pickup tidak boleh lampau'),
  lokasiPickup: z.string().optional(),
  items: z
    .array(
      z.object({
        nama: z.string().min(1, 'Nama barang wajib diisi'),
        jumlah: z.number().min(1, 'Jumlah minimal 1'),
      })
    )
    .min(1, 'Minimal 1 barang'),
  durasiBulan: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type BookingInput = z.infer<typeof bookingSchema>;
