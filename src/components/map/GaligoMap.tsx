// src/components/map/GaligoMap.tsx
'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '@/lib/api';
import type {
  Station,
  StationDetail,
  StationSummary,
} from '@/lib/types';
import { StationDetailPanel } from './StationDetailPanel';
import { MapHeader } from './MapHeader';
import {
  LayerFilterChips,
  type LayerKey,
} from './LayerFilterChips';
import { StatsSheet } from './StatsSheets';

const stationIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;border-radius:9999px;background:#5B2D8E;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ROUTE_COLOR: Record<string, string> = {
  kereta: '#F5C518',
  bus: '#22C3D6',
  pete_pete: '#F2703F',
};

type LoadState = 'loading' | 'ready' | 'error';

export default function GaligoMap() {
  const mapContainer =
    useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(
    null,
  );
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<
    Map<LayerKey, L.Polyline[]>
  >(new Map());

  const [loadState, setLoadState] =
    useState<LoadState>('loading');
  const [selected, setSelected] =
    useState<StationDetail | null>(null);
  const [selectedLoading, setSelectedLoading] =
    useState(false);
  const [stations, setStations] = useState<
    Station[]
  >([]);
  const [summary, setSummary] =
    useState<StationSummary | null>(null);
  const [sheetOpen, setSheetOpen] =
    useState(false);
  const [activeLayers, setActiveLayers] =
    useState<Set<LayerKey>>(
      new Set([
        'kereta',
        'bus',
        'pete_pete',
        'halte',
        'stasiun',
      ]),
    );

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = L.map(mapContainer.current, {
      center: [-4.75, 119.58],
      zoom: 9,
    });
    leafletMapRef.current = map;

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '© OpenStreetMap contributors',
        maxZoom: 19,
      },
    ).addTo(map);

    requestAnimationFrame(() =>
      map.invalidateSize(),
    );
    const resizeObserver = new ResizeObserver(
      () => map.invalidateSize(),
    );
    resizeObserver.observe(mapContainer.current);

    let cancelled = false;

    Promise.all([
      api.stations(),
      api.routes(),
      api.stationsSummary(),
    ])
      .then(
        ([
          stationList,
          routeList,
          summaryData,
        ]) => {
          if (cancelled) return;
          setStations(stationList);
          setSummary(summaryData);

          for (const s of stationList) {
            const [lng, lat] =
              s.geometry.coordinates;
            const marker = L.marker([lat, lng], {
              icon: stationIcon,
            })
              .addTo(map)
              .on('click', () =>
                handleSelectStation(s.slug),
              );
            markersRef.current.push(marker);
          }

          for (const r of routeList) {
            const latlngs =
              r.geometry.coordinates.map(
                ([lng, lat]) =>
                  [lat, lng] as [number, number],
              );
            const line = L.polyline(latlngs, {
              color:
                ROUTE_COLOR[r.mode] ?? '#999',
              weight: r.mode === 'kereta' ? 4 : 3,
            }).addTo(map);
            const key = r.mode as LayerKey;
            const existing =
              routeLayersRef.current.get(key) ??
              [];
            existing.push(line);
            routeLayersRef.current.set(
              key,
              existing,
            );
          }

          setLoadState('ready');
        },
      )
      .catch(() => {
        if (!cancelled) setLoadState('error');
      });

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      markersRef.current.forEach((m) =>
        m.remove(),
      );
      markersRef.current = [];
      routeLayersRef.current.forEach((lines) =>
        lines.forEach((l) => l.remove()),
      );
      routeLayersRef.current.clear();
      map.remove();
      leafletMapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSelectStation(
    slug: string,
  ) {
    setSheetOpen(false); // hindari dua panel bawah tumpang tindih
    setSelectedLoading(true);
    try {
      setSelected(await api.station(slug));
    } catch (err) {
      console.error(
        'Gagal ambil detail stasiun:',
        err,
      );
    } finally {
      setSelectedLoading(false);
    }
  }

  function handleToggleLayer(key: LayerKey) {
    const willShow = !activeLayers.has(key);
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (willShow) next.add(key);
      else next.delete(key);
      return next;
    });

    const map = leafletMapRef.current;
    if (!map) return;

    if (key === 'stasiun') {
      markersRef.current.forEach((m) =>
        willShow
          ? m.addTo(map)
          : map.removeLayer(m),
      );
      return;
    }

    // 'halte' belum ada entitas terpisah di data kita — chip sengaja
    // dibiarkan tampil untuk paritas visual dengan mockup, tapi belum
    // fungsional sampai ada data halte sungguhan.
    if (key === 'halte') return;

    routeLayersRef.current
      .get(key)
      ?.forEach((line) =>
        willShow
          ? line.addTo(map)
          : map.removeLayer(line),
      );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-page">
      <div
        ref={mapContainer}
        className="absolute inset-0"
      />

      <MapHeader />
      <LayerFilterChips
        active={activeLayers}
        onToggle={handleToggleLayer}
      />

      {loadState === 'loading' && (
        <div className="absolute left-4 top-32 z-1000 rounded-pill bg-card px-4 py-2 text-sm text-ink-500 shadow-2">
          Memuat data peta…
        </div>
      )}
      {loadState === 'error' && (
        <div className="absolute left-4 top-32 z-1000 rounded-card bg-bad-bg px-4 py-3 text-sm text-bad shadow-2">
          Gagal memuat data dari server. Pastikan
          backend jalan, lalu muat ulang halaman.
        </div>
      )}
      {selectedLoading && (
        <div className="absolute bottom-4 left-4 z-1000 rounded-pill bg-card px-4 py-2 text-sm text-ink-500 shadow-2">
          Memuat detail titik…
        </div>
      )}
      {selected && !selectedLoading && (
        <StationDetailPanel
          station={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <button
        onClick={() => {
          setSelected(null);
          setSheetOpen(true);
        }}
        className="absolute bottom-4 right-4 z-1000 flex h-12 w-12 items-center justify-center rounded-pill bg-card text-lg shadow-3"
        aria-label="Buka statistik wilayah"
      >
        ☰
      </button>

      {sheetOpen && (
        <StatsSheet
          stations={stations}
          summary={summary}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
