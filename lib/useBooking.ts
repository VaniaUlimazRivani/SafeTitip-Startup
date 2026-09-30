// Lib/useBooking.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Booking {
  id: number | string;
  kodeBooking?: string;
  durasiBulan?: number;
  totalHarga?: number;
  status?: string;
  createdAt?: string;
  user?: {
    nama: string;
    noWa: string;
    lokasiPickup?: string;
  };
  items?: Array<{
    nama: string;
    jumlah: number;
  }>;
  [key: string]: any;
}

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data booking');
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const tambahBooking = async (payload: any) => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menyimpan booking');
    }
    setBookings((prev) => [data.booking || data, ...prev]);
    return data;
  };

  return {
    bookings,
    tambahBooking,
    isLoaded,
    loading,
    error,
    refresh: fetchBookings,
  };
};