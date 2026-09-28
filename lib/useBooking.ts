// lib/useBooking.ts
'use client'; // Wajib ada karena kita menggunakan fitur browser (useEffect/useState)

import { useState, useEffect } from 'react';
import { getBookings, saveBooking, Booking } from './storage';

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Mencegah Hydration Error

  // Mengambil data saat aplikasi pertama kali dimuat di browser
  useEffect(() => {
    setBookings(getBookings());
    setIsLoaded(true);
  }, []);

  // Fungsi yang akan dipanggil dari tombol "Submit" di UI
  const tambahBooking = (newData: Omit<Booking, 'id' | 'status' | 'tanggalDibuat'>) => {
    const saved = saveBooking(newData);
    setBookings(prev => [...prev, saved]); // Update data di layar secara instan (Real-time feel)
    return saved;
  };

  return {
    bookings,
    tambahBooking,
    isLoaded
  };
};