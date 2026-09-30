// lib/useBooking.ts
'use client';

import { useState, useEffect } from 'react';

export interface Booking {
  id?: number | string;
  kodeBooking?: string;
  nama?: string;
  noWa?: string;
  lokasiPickup?: string;
  tanggalPickup?: string;
  durasiBulan?: number;
  totalHarga?: number;
  status?: string;
  items?: any[];
  [key: string]: any;
}

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  const tambahBooking = async (newData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      const saved = await res.json();
      setBookings((prev) => [saved.booking || saved, ...prev]);
      return saved;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return {
    bookings,
    tambahBooking,
    isLoaded,
  };
};