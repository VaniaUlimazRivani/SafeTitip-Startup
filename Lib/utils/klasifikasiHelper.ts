import { Barang } from '../klasifikasi';

export interface BarangItemUI extends Barang {
  id: string;
  jumlah: number;
}

/**
 * Deteksi otomatis tipe dan atribut barang berdasarkan kata kunci umum barang kos mahasiswa
 */
export function deteksiOtomatisBarang(nama: string): Partial<Barang> {
  const lower = nama.toLowerCase().trim();

  // 1. Cek Terlarang / Mudah Busuk (BR-A-P0-04)
  const terlarangKeywords = [
    'narkoba', 'narkotika', 'senjata', 'bom', 'peledak', 'pisau',
    'makanan', 'busuk', 'durian', 'basah', 'daging', 'sayur', 'buah',
    'uang', 'tunai', 'cash', 'perhiasan', 'emas', 'hewan', 'kucing', 'anjing', 'burung', 'ular'
  ];
  if (terlarangKeywords.some(k => lower.includes(k))) {
    return {
      tipe: 'LAINNYA',
      isTerlarangAtauBusuk: true,
      isKendaraanBermotor: false,
      isKecilPengecualian: false,
    };
  }

  // 2. Cek Kendaraan Bermotor (BR-A-P0-04a)
  const kendaraanKeywords = ['motor', 'sepeda motor', 'beat', 'vario', 'scoopy', 'nmax', 'pcx', 'vespa', 'klx', 'mobil'];
  if (kendaraanKeywords.some(k => lower.includes(k))) {
    return {
      tipe: 'KENDARAAN',
      isKendaraanBermotor: true,
      isTerlarangAtauBusuk: false,
      isKecilPengecualian: false,
    };
  }

  // 3. Cek Barang Besar / Elektronik Besar (BR-A-P0-02)
  const barangBesarKeywords = [
    'kulkas', 'mesin cuci', 'lemari', 'kasur', 'springbed', 'tv', 'televisi',
    'dispenser besar', 'freezer', 'sofa', 'meja besar'
  ];
  if (barangBesarKeywords.some(k => lower.includes(k))) {
    return {
      tipe: 'BESAR_ELEKTRONIK',
      isKecilPengecualian: false,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
    };
  }

  // 4. Cek Elektronik Kecil Pengecualian Kategori A (BR-A-P0-02a)
  const elektronikKecilPengecualian = [
    'kipas', 'kipas angin', 'kipas angin meja', 'kipas kecil',
    'magic com', 'rice cooker', 'rice cooker kecil',
    'setrika', 'hair dryer', 'catokan', 'speaker kecil', 'speaker bluetooth',
    'charger', 'adaptor', 'lampu belajar', 'lampu meja'
  ];
  if (elektronikKecilPengecualian.some(k => lower.includes(k))) {
    return {
      tipe: 'KECIL_ELEKTRONIK',
      isKecilPengecualian: true,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
    };
  }

  // 5. Cek Elektronik Kecil Non-Pengecualian (Kategori B)
  const elektronikKecilNonPengecualian = [
    'microwave', 'oven', 'vacuum', 'pc', 'komputer', 'printer', 'air fryer', 'dispenser mini', 'monitor'
  ];
  if (elektronikKecilNonPengecualian.some(k => lower.includes(k))) {
    return {
      tipe: 'KECIL_ELEKTRONIK',
      isKecilPengecualian: false,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
    };
  }

  // 6. Cek Pakaian / Dus Mahasiswa
  const pakaianKeywords = ['baju', 'pakaian', 'koper', 'dus', 'box pakaian', 'buku', 'jaket', 'sepatu', 'tas'];
  if (pakaianKeywords.some(k => lower.includes(k))) {
    return {
      tipe: 'PAKAIAN',
      isKecilPengecualian: false,
      isKendaraanBermotor: false,
      isTerlarangAtauBusuk: false,
    };
  }

  // Fallback
  return {
    tipe: 'LAINNYA',
    isKecilPengecualian: false,
    isKendaraanBermotor: false,
    isTerlarangAtauBusuk: false,
  };
}

/**
 * Daftar Skenario Preset Pengujian Aturan Bisnis P0
 */
export const PRESET_SKENARIO = [
  {
    id: 'test-1-kipas',
    label: 'Kipas Angin Meja + Baju (2 Item)',
    tag: 'BR-A-P0-02a: Kategori A',
    color: 'emerald',
    deskripsi: 'Sesuai Test 1: Elektronik kecil yang diizinkan masuk Kategori A',
    items: [
      {
        id: '1',
        nama: 'Kipas Angin Meja',
        tipe: 'KECIL_ELEKTRONIK' as const,
        isKecilPengecualian: true,
        jumlah: 1,
      },
      {
        id: '2',
        nama: 'Koper Baju Mahasiswa',
        tipe: 'PAKAIAN' as const,
        jumlah: 1,
      },
    ],
  },
  {
    id: 'test-2-motor',
    label: 'Sepeda Motor Honda Beat',
    tag: 'BR-A-P0-04a: Custom Quotation',
    color: 'amber',
    deskripsi: 'Sesuai Test 2: Kendaraan bermotor wajib butuh persetujuan khusus mentor',
    items: [
      {
        id: '1',
        nama: 'Motor Honda Beat',
        tipe: 'KENDARAAN' as const,
        isKendaraanBermotor: true,
        jumlah: 1,
      },
    ],
  },
  {
    id: 'test-3-reject',
    label: 'Makanan Basah / Durian',
    tag: 'BR-A-P0-04: Otomatis REJECT',
    color: 'rose',
    deskripsi: 'Sesuai Test 3: Makanan mudah busuk, uang, perhiasan, atau hewan dilarang',
    items: [
      {
        id: '1',
        nama: 'Durian & Nasi Kotak Basah',
        tipe: 'LAINNYA' as const,
        isTerlarangAtauBusuk: true,
        jumlah: 1,
      },
    ],
  },
  {
    id: 'test-4-kulkas',
    label: 'Kulkas Mini Kos + Kasur Busa',
    tag: 'BR-A-P0-02: Kategori B',
    color: 'blue',
    deskripsi: 'Barang besar / elektronik utama langsung masuk Kategori B',
    items: [
      {
        id: '1',
        nama: 'Kulkas Mini 1 Pintu',
        tipe: 'BESAR_ELEKTRONIK' as const,
        jumlah: 1,
      },
      {
        id: '2',
        nama: 'Kasur Busa Single',
        tipe: 'BESAR_ELEKTRONIK' as const,
        jumlah: 1,
      },
    ],
  },
  {
    id: 'test-5-volume',
    label: 'Pindahan Kos (> 7 Dus Barang)',
    tag: 'BR-A-P0-10: Custom Quotation',
    color: 'purple',
    deskripsi: 'Volume melebihi 7 barang (> 1 pikap), dialihkan ke Kuotasi Custom',
    items: [
      { id: '1', nama: 'Dus Pakaian 1', tipe: 'PAKAIAN' as const, jumlah: 2 },
      { id: '2', nama: 'Dus Buku Kuliah', tipe: 'PAKAIAN' as const, jumlah: 2 },
      { id: '3', nama: 'Koper Besar', tipe: 'PAKAIAN' as const, jumlah: 2 },
      { id: '4', nama: 'Kotak Sepatu & Helm', tipe: 'LAINNYA' as const, jumlah: 2 },
    ],
  },
];

/**
 * Daftar Katalog Barang Kos Umum untuk Referensi Mahasiswa
 */
export const KATALOG_BARANG_KOS = [
  { nama: 'Kipas Angin Meja', tipe: 'KECIL_ELEKTRONIK', status: 'Kategori A (Pengecualian)', rule: 'BR-A-P0-02a', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { nama: 'Rice Cooker / Magic Com Mini', tipe: 'KECIL_ELEKTRONIK', status: 'Kategori A (Pengecualian)', rule: 'BR-A-P0-02a', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { nama: 'Setrika & Hair Dryer', tipe: 'KECIL_ELEKTRONIK', status: 'Kategori A (Pengecualian)', rule: 'BR-A-P0-02a', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { nama: 'Dus Pakaian / Koper (≤3 item)', tipe: 'PAKAIAN', status: 'Kategori A', rule: 'BR-A-P0-02a', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { nama: 'Kulkas Mini / 1 Pintu', tipe: 'BESAR_ELEKTRONIK', status: 'Kategori B', rule: 'BR-A-P0-02', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { nama: 'Mesin Cuci Mini / Portable', tipe: 'BESAR_ELEKTRONIK', status: 'Kategori B', rule: 'BR-A-P0-02', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { nama: 'TV / Monitor LED Besar', tipe: 'BESAR_ELEKTRONIK', status: 'Kategori B', rule: 'BR-A-P0-02', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { nama: 'Kasur Busa / Springbed Single', tipe: 'BESAR_ELEKTRONIK', status: 'Kategori B', rule: 'BR-A-P0-02', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { nama: 'Sepeda Motor (Beat, Vario, dll)', tipe: 'KENDARAAN', status: 'Custom (Butuh Mentor)', rule: 'BR-A-P0-04a', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { nama: 'Barang Lebih Dari 7 Item', tipe: 'VOLUME_BESAR', status: 'Custom Quotation', rule: 'BR-A-P0-10', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { nama: 'Makanan Basah / Durian / Hewan', tipe: 'TERLARANG', status: 'Ditolak (REJECT)', rule: 'BR-A-P0-04', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];
