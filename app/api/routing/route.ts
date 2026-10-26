import { NextRequest, NextResponse } from 'next/server';
import { KOSINAJA_WAREHOUSE, hitungJarakKm } from '@/lib/services/ongkirService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const originLat = parseFloat(searchParams.get('originLat') || String(KOSINAJA_WAREHOUSE.lat));
  const originLng = parseFloat(searchParams.get('originLng') || String(KOSINAJA_WAREHOUSE.lng));
  const destLat = parseFloat(searchParams.get('destLat') || '');
  const destLng = parseFloat(searchParams.get('destLng') || '');

  if (isNaN(destLat) || isNaN(destLng)) {
    return NextResponse.json(
      { error: 'Parameter destLat dan destLng wajib diberikan dan berupa angka.' },
      { status: 400 }
    );
  }

  // Fallback distance calculation
  const fallbackKm = hitungJarakKm(
    { lat: originLat, lng: originLng },
    { lat: destLat, lng: destLng }
  );
  const fallbackDurationMin = Math.max(5, Math.round(fallbackKm * 2.5));
  const fallbackPolyline: [number, number][] = [
    [originLat, originLng],
    [destLat, destLng],
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Format OSRM: /route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    const res = await fetch(osrmUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SafeTitip-Padang/1.0 (contact@safetitip.com)',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMin = Math.max(1, Math.round(route.duration / 60));

        // Konversi koordinat GeoJSON [lng, lat] ke Leaflet [lat, lng]
        const rawCoords: [number, number][] = route.geometry?.coordinates || [];
        const coordinates: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

        return NextResponse.json({
          success: true,
          distanceKm,
          durationMin,
          coordinates,
          isRealRoute: true,
        });
      }
    }
  } catch (error) {
    // Timeout atau OSRM API tidak dapat diakses
  }

  // Kembalikan fallback Haversine jika OSRM routing gagal/timeout
  return NextResponse.json({
    success: false,
    distanceKm: fallbackKm,
    durationMin: fallbackDurationMin,
    coordinates: fallbackPolyline,
    isRealRoute: false,
    fallbackReason: 'Layanan routing OSRM tidak merespons, menggunakan estimasi jarak jalan raya (Haversine x 1.25).',
  });
}
