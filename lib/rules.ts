// lib/rules.ts

const BARANG_REJECT = ['makanan', 'busuk', 'uang', 'perhiasan', 'hewan', 'senjata', 'narkoba'];
const BARANG_CUSTOM = ['motor', 'sepeda'];
const ELEKTRONIK_BESAR = ['kulkas', 'kasur', 'lemari', 'mesin cuci', 'tv', 'televisi', 'dispenser', 'springbed'];

export const cekKlasifikasi = (namaBarang: string, jumlah: number) => {
  const lowerNama = namaBarang.toLowerCase();
  
  if (BARANG_REJECT.some(b => lowerNama.includes(b))) {
    return { status: 'REJECT', kategori: '-', pesan: 'Ditolak: Termasuk barang terlarang.' };
  }
  if (BARANG_CUSTOM.some(b => lowerNama.includes(b)) || jumlah > 7) {
    return { status: 'CUSTOM', kategori: 'Custom', pesan: 'Dialihkan ke Kuotasi Custom.' };
  }
  if (ELEKTRONIK_BESAR.some(b => lowerNama.includes(b)) || jumlah > 3) {
    return { status: 'OK', kategori: 'Kategori B', pesan: 'Kategori B (Barang Besar / >3 item).' };
  }
  return { status: 'OK', kategori: 'Kategori A', pesan: 'Kategori A (Kapasitas Kecil).' };
};

export const hitungHarga = (kategori: string, durasiBulan: number) => {
  if (kategori === 'Kategori A') return durasiBulan === 1 ? 199000 : durasiBulan === 2 ? 379000 : 499000;
  if (kategori === 'Kategori B') return durasiBulan === 1 ? 299000 : durasiBulan === 2 ? 499000 : 699000;
  return 0; 
};