// lib/storage.ts

export interface Booking {
  id: string;
  namaPemesanan: string;
  nomorWA: string;
  kategoriBarang: string; // Akan diisi dari hasil modul Fauzan
  totalHarga: number; // Akan diisi dari hasil modul Hasan
  status: 'Menunggu Dikonfirmasi' | 'Disimpan' | 'Diambil';
  tanggalDibuat: string;
}

const STORAGE_KEY = 'safetitip_bookings';

// Fungsi membaca data (dilengkapi try-catch agar aman jika memori penuh/korup)
export const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca data dari Local Storage:", error);
    return [];
  }
};

// Fungsi menyimpan data baru
export const saveBooking = (newData: Omit<Booking, 'id' | 'status' | 'tanggalDibuat'>): Booking => {
  const currentData = getBookings();
  
  const newBooking: Booking = {
    ...newData,
    id: `ST-${Date.now()}`, // Format ID profesional: ST-1698765432
    status: 'Menunggu Dikonfirmasi',
    tanggalDibuat: new Date().toISOString(),
  };
  
  const updatedData = [...currentData, newBooking];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  
  return newBooking;
};