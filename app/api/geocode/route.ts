import { NextRequest, NextResponse } from 'next/server';
import { PRESET_LOKASI_PADANG } from '@/lib/services/ongkirService';

export interface StandardPlaceItem {
  id: string;
  nama: string;
  alamatLengkap: string;
  lat: number;
  lng: number;
  type: string;
  class: string;
}

const USER_AGENT = 'SafeTitip-App/1.0 (https://safetitip.com; kontak: halo@safetitip.com)';
const PADANG_VIEWBOX = '100.2700,-1.1200,100.5500,-0.7500';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  // 1. REVERSE GEOCODING (lat & lng)
  if (latStr && lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Koordinat lat/lng tidak valid' }, { status: 400 });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id&addressdetails=1`,
        {
          headers: {
            'User-Agent': USER_AGENT,
            'Accept-Language': 'id',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const displayName = data.display_name || '';
        const parts = displayName.split(', ');
        const shortName =
          data.address?.amenity ||
          data.address?.building ||
          data.address?.tourism ||
          data.address?.shop ||
          data.address?.road ||
          parts[0] ||
          `Titik Lokasi (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        return NextResponse.json({
          nama: shortName,
          alamatLengkap: displayName,
          lat,
          lng,
        });
      }
    } catch (e) {
      // Fallback jika reverse timeout/error
    }

    return NextResponse.json({
      nama: `Titik Lokasi (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      alamatLengkap: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      lat,
      lng,
    });
  }

  // 2. SEARCH AUTOCOMPLETE (q)
  if (!q || q.trim().length < 3) {
    return NextResponse.json([]);
  }

  const query = q.trim().toLowerCase();
  const results: StandardPlaceItem[] = [];
  const seenCoords = new Set<string>();

  // A. Cek Preset Populer Padang terlebih dahulu (prioritas lokal instan)
  for (const preset of PRESET_LOKASI_PADANG) {
    const matchName = preset.nama.toLowerCase().includes(query);
    const matchArea = preset.area.toLowerCase().includes(query);
    const matchDesc = preset.deskripsi.toLowerCase().includes(query);
    if (matchName || matchArea || matchDesc) {
      const key = `${preset.lat.toFixed(4)},${preset.lng.toFixed(4)}`;
      if (!seenCoords.has(key)) {
        seenCoords.add(key);
        results.push({
          id: `preset-${preset.id}`,
          nama: preset.nama,
          alamatLengkap: `${preset.nama}, ${preset.area}, ${preset.deskripsi}`,
          lat: preset.lat,
          lng: preset.lng,
          type: preset.kategori === 'Kampus' ? 'university' : 'preset',
          class: 'amenity',
        });
      }
    }
  }

  // B. Query ke OSM Nominatim dengan header User-Agent & viewbox Padang
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const nominatimUrl =
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q.trim())}` +
      `&format=json&limit=8&addressdetails=1&accept-language=id&countrycodes=id` +
      `&viewbox=${PADANG_VIEWBOX}&bounded=0`;

    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'id',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const nominatimData = await res.json();
      if (Array.isArray(nominatimData)) {
        for (const item of nominatimData) {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
          if (!seenCoords.has(key)) {
            seenCoords.add(key);
            const parts = (item.display_name || '').split(', ');
            results.push({
              id: `osm-${item.place_id}`,
              nama: item.name || parts[0] || 'Lokasi',
              alamatLengkap: item.display_name,
              lat,
              lng,
              type: item.type || 'place',
              class: item.class || 'place',
            });
          }
        }
      }
    }
  } catch (e) {
    // Jika Nominatim gagal, lanjut ke fallback Photon
  }

  // C. Fallback: Photon API Komoot (jika hasil Nominatim masih sedikit < 2)
  if (results.length < 2) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const photonUrl =
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}` +
        `&lat=-0.9294&lon=100.3632&limit=6`;

      const pRes = await fetch(photonUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData?.features && Array.isArray(pData.features)) {
          for (const feat of pData.features) {
            const coords = feat.geometry?.coordinates;
            if (coords && coords.length >= 2) {
              const lng = coords[0];
              const lat = coords[1];
              const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
              if (!seenCoords.has(key)) {
                seenCoords.add(key);
                const props = feat.properties || {};
                const name = props.name || props.street || 'Lokasi';
                const addrParts = [
                  props.street,
                  props.district,
                  props.city,
                  props.state,
                ].filter(Boolean);

                results.push({
                  id: `photon-${props.osm_id || Math.random()}`,
                  nama: name,
                  alamatLengkap: addrParts.length > 0 ? `${name}, ${addrParts.join(', ')}` : name,
                  lat,
                  lng,
                  type: props.osm_value || 'place',
                  class: props.osm_key || 'place',
                });
              }
            }
          }
        }
      }
    } catch (e) {
      // Abaikan jika fallback juga gagal
    }
  }

  return NextResponse.json(results);
}
