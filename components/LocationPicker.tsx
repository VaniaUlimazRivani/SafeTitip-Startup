'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  Coordinate,
  KOSINAJA_WAREHOUSE,
  ONGKIR_CONFIG,
  TipeMetodePickup,
  TipeMetodeDelivery,
  kalkulasiOngkirLengkap,
  KalkulasiOngkirResult,
  PRESET_LOKASI_PADANG,
} from '@/lib/services/ongkirService';

export interface LocationPickerResult extends KalkulasiOngkirResult {
  coordinate: Coordinate;
  alamatDetail: string;
}

interface LocationPickerProps {
  kategori: string;
  onChangeOngkir: (result: LocationPickerResult) => void;
  initialAlamat?: string;
}

interface SearchPlaceItem {
  id: string;
  nama: string;
  alamatLengkap: string;
  lat: number;
  lng: number;
  type?: string;
  class?: string;
}

export default function LocationPicker({
  kategori,
  onChangeOngkir,
  initialAlamat = '',
}: LocationPickerProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchPlaceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form & Address state
  const [alamatDetail, setAlamatDetail] = useState(initialAlamat);
  const [metodePickup, setMetodePickup] = useState<TipeMetodePickup>('PICKUP');
  const [metodeDelivery, setMetodeDelivery] = useState<TipeMetodeDelivery>('DELIVERY');

  // GPS state
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Routing & Map status
  const [isRouting, setIsRouting] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
    isRealRoute: boolean;
  }>({
    distanceKm: 0,
    durationMin: 0,
    isRealRoute: true,
  });

  // Selected coordinate & location
  const [selectedLoc, setSelectedLoc] = useState<{
    nama: string;
    alamatLengkap: string;
    lat: number;
    lng: number;
  }>({
    nama: KOSINAJA_WAREHOUSE.nama,
    alamatLengkap: KOSINAJA_WAREHOUSE.alamat,
    lat: KOSINAJA_WAREHOUSE.lat,
    lng: KOSINAJA_WAREHOUSE.lng,
  });

  const showMapSection = metodePickup === 'PICKUP' || metodeDelivery === 'DELIVERY';

  // Kalkulasi Ongkir komprehensif
  const ongkirResult = kalkulasiOngkirLengkap(
    { lat: selectedLoc.lat, lng: selectedLoc.lng },
    kategori,
    metodePickup,
    metodeDelivery,
    routeInfo.distanceKm > 0 ? routeInfo.distanceKm : undefined,
    routeInfo.durationMin > 0 ? routeInfo.durationMin : undefined,
    routeInfo.isRealRoute
  );

  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const routeAbortRef = useRef<AbortController | null>(null);
  const geocodeAbortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sinkronisasi data ke parent component
  useEffect(() => {
    const fullAlamat = alamatDetail
      ? selectedLoc.nama && !alamatDetail.includes(selectedLoc.nama)
        ? `[${selectedLoc.nama}] ${alamatDetail}`
        : alamatDetail
      : selectedLoc.nama;

    onChangeOngkir({
      ...ongkirResult,
      coordinate: { lat: selectedLoc.lat, lng: selectedLoc.lng },
      alamatDetail: fullAlamat,
    });
  }, [selectedLoc, kategori, metodePickup, metodeDelivery, alamatDetail, routeInfo]);

  // Klik di luar dropdown untuk menutup daftar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch routing jalan raya (OSRM)
  const fetchRoadRoute = useCallback(async (destLat: number, destLng: number) => {
    if (routeAbortRef.current) {
      routeAbortRef.current.abort();
    }
    const controller = new AbortController();
    routeAbortRef.current = controller;
    setIsRouting(true);

    try {
      const res = await fetch(
        `/api/routing?originLat=${KOSINAJA_WAREHOUSE.lat}&originLng=${KOSINAJA_WAREHOUSE.lng}&destLat=${destLat}&destLng=${destLng}`,
        { signal: controller.signal }
      );
      if (res.ok) {
        const data = await res.json();
        const dist = typeof data.distanceKm === 'number' ? data.distanceKm : 0;
        const dur = typeof data.durationMin === 'number' ? data.durationMin : 5;
        const isReal = Boolean(data.isRealRoute);

        setRouteInfo({
          distanceKm: dist,
          durationMin: dur,
          isRealRoute: isReal,
        });

        // Gambar ulang rute polyline jika Leaflet map sudah aktif
        if (leafletMapRef.current && Array.isArray(data.coordinates) && data.coordinates.length > 0) {
          const L = (window as any).L;
          if (L) {
            if (routeLineRef.current) {
              routeLineRef.current.setLatLngs(data.coordinates);
              routeLineRef.current.setStyle({
                color: isReal ? '#B86B35' : '#D97706',
                dashArray: isReal ? undefined : '6, 8',
                weight: 5,
                opacity: 0.9,
              });
            } else {
              routeLineRef.current = L.polyline(data.coordinates, {
                color: isReal ? '#B86B35' : '#D97706',
                dashArray: isReal ? undefined : '6, 8',
                weight: 5,
                opacity: 0.9,
                lineJoin: 'round',
              }).addTo(leafletMapRef.current);
            }

            // Fit bounds agar rute dan kedua titik terlihat rapi
            leafletMapRef.current.fitBounds(routeLineRef.current.getBounds(), {
              padding: [45, 45],
              maxZoom: 16,
              animate: true,
              duration: 0.5,
            });
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Gagal memuat rute jalan:', err);
      }
    } finally {
      setIsRouting(false);
    }
  }, []);

  // Handler Reverse Geocoding saat user klik peta / drag pin
  const handleCoordinatePicked = useCallback(
    async (lat: number, lng: number, shouldFetchReverse = true, customName?: string) => {
      // 1. Update marker posisi langsung di peta
      if (destMarkerRef.current) {
        destMarkerRef.current.setLatLng([lat, lng]);
      }
      setGpsError(null);

      // 2. Fetch routing jalan raya segera
      fetchRoadRoute(lat, lng);

      // 3. Reverse geocoding jika dibutuhkan
      if (shouldFetchReverse) {
        if (geocodeAbortRef.current) {
          geocodeAbortRef.current.abort();
        }
        const controller = new AbortController();
        geocodeAbortRef.current = controller;

        try {
          const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const data = await res.json();
            const nama = customName || data.nama || `Titik Lokasi (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            setSelectedLoc({
              nama,
              alamatLengkap: data.alamatLengkap || '',
              lat,
              lng,
            });
            return;
          }
        } catch (e: any) {
          if (e.name === 'AbortError') return;
        }
      }

      // Default fallback nama
      setSelectedLoc((prev) => ({
        ...prev,
        nama: customName || prev.nama || `Titik Lokasi (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
      }));
    },
    [fetchRoadRoute]
  );

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (typeof window === 'undefined' || !showMapSection) return;
    let isMounted = true;

    const initMap = async () => {
      // Import leaflet dynamically
      const LModule = await import('leaflet');
      const L = LModule.default || LModule;
      (window as any).L = L;

      // Fix icon Leaflet default untuk bundler (Next.js / Turbopack / Webpack)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!isMounted || !mapContainerRef.current) return;

      // Bersihkan instance map lama jika ada
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Buat map baru
      const map = L.map(mapContainerRef.current, {
        center: [KOSINAJA_WAREHOUSE.lat, KOSINAJA_WAREHOUSE.lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: 'center',
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Icon Pin Gudang Pusat (Hotel Ibis Padang)
      const warehouseIcon = L.divIcon({
        className: 'warehouse-pin-icon',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="background:#2A1B14;color:#FAF6F0;border:2px solid #E69526;border-radius:12px;padding:3px 8px;font-weight:800;font-size:11px;white-space:nowrap;box-shadow:0 6px 14px rgba(0,0,0,0.35);display:flex;items-center;gap:4px;">
              <span>🏨 Hub Kosinaja (Ibis)</span>
            </div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #2A1B14;margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [160, 36],
        iconAnchor: [80, 36],
      });

      L.marker([KOSINAJA_WAREHOUSE.lat, KOSINAJA_WAREHOUSE.lng], {
        icon: warehouseIcon,
        interactive: true,
      })
        .addTo(map)
        .bindPopup(`<strong>Central Hub Kosinaja</strong><br/>${KOSINAJA_WAREHOUSE.alamat}`);

      // Icon Pin Tujuan / Pelanggan (Bisa di-drag & ujung jarum akurat)
      const customerPinIcon = L.divIcon({
        className: 'customer-pin-icon',
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:grab;">
            <div style="width:40px;height:40px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg, #DC2626, #991B1B);border:3px solid #FFFFFF;transform:rotate(-45deg);box-shadow:0 8px 18px rgba(185,28,28,0.45);display:flex;align-items:center;justify-content:center;">
              <span style="transform:rotate(45deg);color:#FFFFFF;font-weight:900;font-size:16px;">📍</span>
            </div>
            <div style="width:14px;height:5px;background:rgba(0,0,0,0.25);border-radius:50%;margin-top:2px;"></div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
      });

      // Marker Tujuan yang Draggable
      const destMarker = L.marker([selectedLoc.lat, selectedLoc.lng], {
        icon: customerPinIcon,
        draggable: true,
        title: 'Geser pin ini untuk sesuaikan titik lokasi Anda',
      }).addTo(map);

      // Event DRAGEND pada marker tujuan
      destMarker.on('dragend', () => {
        const pos = destMarker.getLatLng();
        handleCoordinatePicked(pos.lat, pos.lng, true);
      });

      // Event KLIK pada peta untuk memindahkan pin lokasi
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        handleCoordinatePicked(lat, lng, true);
      });

      leafletMapRef.current = map;
      destMarkerRef.current = destMarker;

      // Inisialisasi rute jalan pertama kali
      fetchRoadRoute(selectedLoc.lat, selectedLoc.lng);

      // InvalidateSize untuk mencegah peta blank saat container di-render
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 250);
    };

    const timer = setTimeout(initMap, 150);

    return () => {
      clearTimeout(timer);
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [showMapSection]);

  // Handle ResizeObserver agar map selalu pas saat container berubah ukuran
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [showMapSection]);

  // Pencarian nama tempat dengan debounce 450ms & AbortController
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!query.trim() || query.trim().length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        setIsSearching(false);
        setHasSearched(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        setHasSearched(true);

        if (searchAbortRef.current) {
          searchAbortRef.current.abort();
        }
        const controller = new AbortController();
        searchAbortRef.current = controller;

        try {
          const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const data: SearchPlaceItem[] = await res.json();
            setSuggestions(data);
            setShowDropdown(true);
          } else {
            setSuggestions([]);
            setShowDropdown(true);
          }
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            setSuggestions([]);
            setShowDropdown(true);
          }
        } finally {
          setIsSearching(false);
        }
      }, 450);
    },
    []
  );

  // Saat hasil pencarian dipilih dari dropdown
  const handleSelectSuggestion = (item: SearchPlaceItem) => {
    setSelectedLoc({
      nama: item.nama,
      alamatLengkap: item.alamatLengkap,
      lat: item.lat,
      lng: item.lng,
    });
    setSearchQuery(item.nama);
    setShowDropdown(false);
    setSuggestions([]);
    setGpsError(null);

    // Animasi flyTo ke lokasi yang dipilih
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([item.lat, item.lng], 15, {
        animate: true,
        duration: 0.8,
      });
      leafletMapRef.current.invalidateSize();
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.setLatLng([item.lat, item.lng]);
    }

    // Hitung rute jalan OSRM
    fetchRoadRoute(item.lat, item.lng);
  };

  // Deteksi lokasi terkini via Browser Geolocation API
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Perangkat Anda tidak mendukung fitur GPS.');
      return;
    }

    setIsGettingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsGettingGps(false);

        // Pindahkan peta ke koordinat GPS
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([lat, lng], 16, {
            animate: true,
            duration: 1,
          });
          leafletMapRef.current.invalidateSize();
        }
        handleCoordinatePicked(lat, lng, true, 'Lokasi GPS Saya');
      },
      (err) => {
        setIsGettingGps(false);
        if (err.code === 1) {
          setGpsError('Izin akses GPS ditolak oleh browser. Harap aktifkan izin lokasi di pengaturan browser Anda, atau klik langsung pada peta.');
        } else if (err.code === 2) {
          setGpsError('Sinyal GPS / posisi saat ini tidak tersedia. Silakan cari nama tempat atau pasang pin secara manual.');
        } else if (err.code === 3) {
          setGpsError('Waktu pencarian GPS habis (timeout). Silakan coba lagi atau pilih lokasi langsung di peta.');
        } else {
          setGpsError('Gagal mendeteksi lokasi GPS. Silakan tentukan pin langsung pada peta.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const fmtRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(v);

  const getPlaceIcon = (type?: string) => {
    if (!type) return 'location_on';
    if (['university', 'college', 'school'].includes(type)) return 'school';
    if (['hotel', 'motel', 'hostel'].includes(type)) return 'hotel';
    if (['restaurant', 'fast_food', 'cafe'].includes(type)) return 'restaurant';
    if (['hospital', 'clinic'].includes(type)) return 'local_hospital';
    if (['preset'].includes(type)) return 'apartment';
    return 'location_on';
  };

  return (
    <div className="space-y-6">
      {/* Hidden inputs agar koordinat & ongkir ikut terkirim secara native saat form submit */}
      <input type="hidden" name="latitude" value={selectedLoc.lat} />
      <input type="hidden" name="longitude" value={selectedLoc.lng} />
      <input type="hidden" name="jarakKm" value={ongkirResult.jarakKm} />
      <input type="hidden" name="totalOngkir" value={ongkirResult.totalOngkir} />

      {/* Bagian 1: Pilihan Metode Penjemputan (Pickup) */}
      <div className="space-y-3">
        <label className="block text-xs font-black uppercase tracking-wider text-[#705E54]">
          1. Metode Penjemputan Barang (Pickup) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMetodePickup('PICKUP')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              metodePickup === 'PICKUP'
                ? 'border-[#B86B35] bg-[#F6ECE1] ring-2 ring-[#B86B35]/20 shadow-xs'
                : 'border-[#E8DDD3] bg-white hover:bg-[#FAF6F0]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                metodePickup === 'PICKUP' ? 'bg-[#B86B35] text-white shadow-xs' : 'bg-[#FAF6F0] text-[#705E54]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#2A1B14]">Dijemput Kurir Kosinaja</p>
              <p className="text-xs text-[#705E54] mt-0.5">
                Kurir datang langsung ke pintu kamar kos / rumah Anda di Kota Padang.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMetodePickup('SELF_DROPOFF')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              metodePickup === 'SELF_DROPOFF'
                ? 'border-[#B86B35] bg-[#F6ECE1] ring-2 ring-[#B86B35]/20 shadow-xs'
                : 'border-[#E8DDD3] bg-white hover:bg-[#FAF6F0]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                metodePickup === 'SELF_DROPOFF' ? 'bg-[#B86B35] text-white shadow-xs' : 'bg-[#FAF6F0] text-[#705E54]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">warehouse</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-[#2A1B14]">Antar Sendiri ke Gudang</p>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Gratis
                </span>
              </div>
              <p className="text-xs text-[#705E54] mt-0.5">
                Anda mengantarkan barang sendiri ke Central Hub Kosinaja (Hotel Ibis Padang).
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Bagian 2: Pilihan Metode Pengantaran Kembali (Delivery) */}
      <div className="space-y-3">
        <label className="block text-xs font-black uppercase tracking-wider text-[#705E54]">
          2. Metode Pengembalian Saat Selesai Titip *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMetodeDelivery('DELIVERY')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              metodeDelivery === 'DELIVERY'
                ? 'border-[#B86B35] bg-[#F6ECE1] ring-2 ring-[#B86B35]/20 shadow-xs'
                : 'border-[#E8DDD3] bg-white hover:bg-[#FAF6F0]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                metodeDelivery === 'DELIVERY' ? 'bg-[#B86B35] text-white shadow-xs' : 'bg-[#FAF6F0] text-[#705E54]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">front_hand</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#2A1B14]">Diantar Kembali oleh Kurir</p>
              <p className="text-xs text-[#705E54] mt-0.5">
                Saat Anda kembali ke Padang, kurir mengantar barang ke kos baru Anda.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMetodeDelivery('SELF_PICKUP')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              metodeDelivery === 'SELF_PICKUP'
                ? 'border-[#B86B35] bg-[#F6ECE1] ring-2 ring-[#B86B35]/20 shadow-xs'
                : 'border-[#E8DDD3] bg-white hover:bg-[#FAF6F0]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                metodeDelivery === 'SELF_PICKUP' ? 'bg-[#B86B35] text-white shadow-xs' : 'bg-[#FAF6F0] text-[#705E54]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">directions_walk</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-[#2A1B14]">Ambil Sendiri di Gudang</p>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Gratis
                </span>
              </div>
              <p className="text-xs text-[#705E54] mt-0.5">
                Anda mengambil langsung barang di Central Hub kami saat tiba kembali di Padang.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Bagian 3: Interactive Map & Ongkir Rute Jalan Raya (Tampil jika Kurir Dipilih) */}
      {showMapSection && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-5 shadow-xs">
          {/* Header Map Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DDD3] pb-4">
            <div>
              <h3 className="text-sm font-black text-[#2A1B14] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B86B35] text-[22px]">route</span>
                Peta Penjemputan &amp; Rute Jalan Kurir
              </h3>
              <p className="text-xs text-[#705E54] mt-0.5">
                Pusat Gudang: <strong className="text-[#2A1B14]">{KOSINAJA_WAREHOUSE.nama}</strong> ({KOSINAJA_WAREHOUSE.alamat})
              </p>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isGettingGps}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#DCBEA3] text-[#7E3F18] hover:bg-[#F6ECE1] text-xs font-black transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <span className={`material-symbols-outlined text-[16px] text-[#B86B35] ${isGettingGps ? 'animate-spin' : ''}`}>
                {isGettingGps ? 'sync' : 'my_location'}
              </span>
              <span>{isGettingGps ? 'Mendeteksi GPS...' : 'Gunakan Lokasi Saya'}</span>
            </button>
          </div>

          {/* Notifikasi GPS Error */}
          {gpsError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0 mt-0.5">warning</span>
              <div className="space-y-0.5">
                <p className="font-extrabold">Tidak Dapat Mengakses GPS:</p>
                <p>{gpsError}</p>
              </div>
            </div>
          )}

          {/* Autocomplete Search Box */}
          <div className="space-y-2" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-[#705E54]">
                Cari Lokasi / Kawasan Kos di Padang:
              </label>
              <span className="text-[11px] text-[#8C7A6D]">Minimal 3 karakter</span>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B86B35]">
                {isSearching ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">search</span>
                )}
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0 || hasSearched) setShowDropdown(true);
                }}
                placeholder="Ketik kampus (UNP, UNAND, UPI), nama jalan, hotel, atau kawasan kos..."
                className="w-full h-12 pl-11 pr-10 rounded-2xl border border-[#E8DDD3] bg-white text-xs sm:text-sm font-semibold text-[#2A1B14] placeholder:text-[#8C7A6D] focus:outline-none focus:ring-2 focus:ring-[#B86B35]/30 focus:border-[#B86B35] shadow-xs"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    setShowDropdown(false);
                    setHasSearched(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C7A6D] hover:text-[#2A1B14] cursor-pointer"
                  title="Hapus pencarian"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}

              {/* Dropdown Hasil Pencarian */}
              {showDropdown && (
                <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl border border-[#E8DDD3] shadow-xl overflow-hidden max-h-72 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-[#705E54] flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4 text-[#B86B35]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Mencari lokasi di Kota Padang...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div>
                      {suggestions.map((item, i) => (
                        <button
                          key={item.id || i}
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className={`w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-[#FAF6F0] transition-colors cursor-pointer ${
                            i > 0 ? 'border-t border-[#F6ECE1]' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#F6ECE1] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[#B86B35] text-[18px]">
                              {getPlaceIcon(item.type)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-[#2A1B14] truncate">{item.nama}</p>
                            <p className="text-[11px] text-[#8C7A6D] line-clamp-1 mt-0.5">{item.alamatLengkap}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : hasSearched ? (
                    <div className="p-4 text-center space-y-1">
                      <p className="text-xs font-extrabold text-[#2A1B14]">Lokasi tidak ditemukan</p>
                      <p className="text-[11px] text-[#705E54]">
                        Coba ketik nama jalan / kelurahan lebih umum, atau klik langsung pada peta untuk memasang pin lokasi secara akurat.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Quick Preset Chips Populer Padang */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#8C7A6D] uppercase tracking-wider mr-1">
                Pintasan Kampus:
              </span>
              {[
                { label: 'UNP Air Tawar', lat: -0.897, lng: 100.352 },
                { label: 'UNAND Limau Manis', lat: -0.9146, lng: 100.4586 },
                { label: 'UPI YPTK Padang', lat: -0.962, lng: 100.395 },
                { label: 'UBH Ulak Karang', lat: -0.915, lng: 100.354 },
                { label: 'Siteba Nanggalo', lat: -0.888, lng: 100.38 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleSelectSuggestion({
                      id: `quick-${idx}`,
                      nama: p.label,
                      alamatLengkap: `${p.label}, Kota Padang`,
                      lat: p.lat,
                      lng: p.lng,
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8DDD3] text-[#705E54] hover:text-[#B86B35] hover:border-[#B86B35] text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Banner Lokasi Terpilih */}
            {selectedLoc.nama !== KOSINAJA_WAREHOUSE.nama && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#F6ECE1] border border-[#DCBEA3]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#B86B35] text-[16px] shrink-0">check_circle</span>
                  <p className="text-[11px] font-bold text-[#7E3F18] truncate">
                    Titik Terpilih: <span className="text-[#2A1B14]">{selectedLoc.nama}</span>
                  </p>
                </div>
                <span className="text-[10px] text-[#705E54] shrink-0 font-medium hidden sm:inline">
                  (Klik / drag pin di peta untuk atur ulang)
                </span>
              </div>
            )}
          </div>

          {/* Interactive Leaflet Map Container */}
          <div className="rounded-2xl border-2 border-[#E8DDD3] shadow-md bg-slate-100 relative overflow-hidden">
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '360px',
                minHeight: '360px',
                position: 'relative',
                zIndex: 0,
                display: 'block',
              }}
            />

            {/* Petunjuk Penggunaan Pin di Sudut Peta */}
            <div className="absolute bottom-12 left-3 right-3 sm:right-auto z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E8DDD3] shadow-md flex items-center gap-2 text-[11px] font-extrabold text-[#2A1B14] max-w-sm pointer-events-none">
              <span className="material-symbols-outlined text-[#B86B35] text-[16px]">touch_app</span>
              <span>Klik peta atau geser pin merah untuk tentukan titik akurat</span>
            </div>

            {/* Floating Banner Rute Kurir di Atas Peta */}
            <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-[#E8DDD3] shadow-lg flex items-center gap-2.5 max-w-md">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] text-white flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined text-[18px] ${isRouting ? 'animate-spin' : ''}`}>
                  {isRouting ? 'sync' : 'directions_bike'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#2A1B14]">
                  <span>Hotel Ibis</span>
                  <span className="material-symbols-outlined text-[14px] text-[#B86B35]">arrow_forward</span>
                  <span className="truncate text-[#B86B35]">{selectedLoc.nama}</span>
                </div>
                <p className="text-[10px] text-[#705E54] mt-0.5 flex items-center gap-1.5">
                  <span>
                    Jarak Rute: <strong>{ongkirResult.jarakKm} km</strong>
                  </span>
                  <span>&bull;</span>
                  <span>Est. {ongkirResult.estimasiWaktuMenit} Menit</span>
                  <span>&bull;</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                    {ongkirResult.isRealRoute ? 'Rute Jalan OSRM' : 'Garis Lurus'}
                  </span>
                </p>
              </div>
            </div>

            {/* Bottom Bar Info Peta */}
            <div className="p-3 bg-white border-t border-[#E8DDD3] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#705E54] min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B86B35] animate-pulse shrink-0" />
                <span className="truncate">
                  Koordinat: <strong>{selectedLoc.lat.toFixed(5)}, {selectedLoc.lng.toFixed(5)}</strong>
                </span>
              </div>
              <a
                href={ongkirResult.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-black text-[#B86B35] hover:underline"
              >
                <span>Buka Rute di Google Maps</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Peringatan Jika Di Luar Batas Jangkauan Maksimal */}
          {ongkirResult.isOutOfRange && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-extrabold text-sm text-rose-800">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>Lokasi Berada di Luar Jangkauan Layanan Kurir</span>
              </div>
              <p className="text-xs leading-relaxed text-rose-800">
                Jarak lokasi penjemputan/pengantaran Anda ({ongkirResult.jarakKm} km) melebihi batas jangkauan maksimal kurir kami (Maksimal {ongkirResult.maxDistanceKm} km dari Central Hub Hotel Ibis).
              </p>
              <p className="text-xs font-semibold text-rose-900 pt-1">
                💡 <strong>Solusi:</strong> Anda tetap dapat menggunakan layanan penitipan Kosinaja dengan memilih metode <strong>Antar Sendiri ke Gudang (Gratis)</strong> di atas.
              </p>
            </div>
          )}

          {/* Rincian Hasil Perhitungan Jarak & Tarif Resmi */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBD8C6] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F6ECE1] pb-2.5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#705E54]">
                  Hasil Perhitungan Jarak Jalan &amp; Tarif Resmi:
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-[#2A1B14]">{ongkirResult.jarakKm} km</span>
                  {ongkirResult.isFreePickup ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      Gratis (&le; 1.0 km)
                    </span>
                  ) : (
                    <span className="text-xs text-[#705E54]">
                      rute jalan riil dari Hotel Ibis Padang
                    </span>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-bold text-[#705E54]">Total Ongkir:</p>
                <p className="text-xl font-black text-[#B86B35]">{fmtRupiah(ongkirResult.totalOngkir)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#705E54]">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0]">
                <span>Ongkir Penjemputan:</span>
                <strong className="text-[#2A1B14]">
                  {metodePickup === 'PICKUP'
                    ? ongkirResult.ongkirPickup === 0
                      ? 'Gratis'
                      : fmtRupiah(ongkirResult.ongkirPickup)
                    : 'Rp 0 (Antar Sendiri)'}
                </strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0]">
                <span>Ongkir Pengantaran:</span>
                <strong className="text-[#2A1B14]">
                  {metodeDelivery === 'DELIVERY'
                    ? ongkirResult.ongkirDelivery === 0
                      ? 'Gratis'
                      : fmtRupiah(ongkirResult.ongkirDelivery)
                    : 'Rp 0 (Ambil Sendiri)'}
                </strong>
              </div>
            </div>

            {ongkirResult.surchargeKategori > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
                <span>
                  Termasuk surcharge <strong>+{fmtRupiah(ongkirResult.surchargeKategori)}/trip</strong> untuk Paket Kategori {kategori}.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bagian 4: Field Detail Alamat Tambahan */}
      <div className="space-y-1.5">
        <label className="block text-xs font-black uppercase tracking-wider text-[#705E54]" htmlFor="lokasiPickup">
          Detail Alamat Spesifik / Nama Kos &amp; No. Kamar *
        </label>
        <textarea
          id="lokasiPickup"
          name="lokasiPickup"
          required
          rows={2}
          value={alamatDetail}
          onChange={(e) => setAlamatDetail(e.target.value)}
          placeholder={`Misal: Kos Melati Putri No. 4, Kamar 12 Lantai 2, dekat ${selectedLoc.nama}...`}
          className="w-full p-3.5 rounded-2xl border border-[#E8DDD3] bg-white text-[#2A1B14] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B86B35]/30 resize-none font-medium placeholder:text-[#8C7A6D]"
        />
        <p className="text-[11px] text-[#8C7A6D]">
          💡 Tuliskan patokan jalan, nama kos, nomor kamar, atau petunjuk bagi kurir agar penjemputan lancar.
        </p>
      </div>
    </div>
  );
}
