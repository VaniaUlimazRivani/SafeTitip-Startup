import { z } from 'zod';

export const bookingSchema = z.object({
  userId: z.string().optional(),
  nama: z.string().min(1, 'Nama wajib diisi'),
  noWa: z
    .string()
    .regex(/^08\d{8,12}$/, 'No WA tidak valid (format 08xxx)'),
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
  durasiBulan: z.coerce.number().min(1).default(1),
  tipeDurasi: z.enum(['HARI', 'MINGGU', 'BULAN']).default('BULAN'),
  durasiNilai: z.coerce.number().min(1).default(1),
  metodePickup: z.enum(['PICKUP', 'SELF_DROPOFF']).default('PICKUP'),
  metodeDelivery: z.enum(['DELIVERY', 'SELF_PICKUP']).default('DELIVERY'),
  jarakKm: z.coerce.number().optional(),
  ongkirPickup: z.coerce.number().optional().default(0),
  ongkirDelivery: z.coerce.number().optional().default(0),
  totalOngkir: z.coerce.number().optional().default(0),
  surchargeKategori: z.coerce.number().optional().default(0),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  mapsUrl: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
