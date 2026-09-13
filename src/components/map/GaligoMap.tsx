'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
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
import { InlineStats } from './InlineStats';
import { ChatWidget } from '../chat/ChatWidget';

const stationIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;border-radius:9999px;background:#5B2D8E;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const wisataIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#C2379B;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:10px;">📍</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const ROUTE_COLOR: Record<string, string> = {
  kereta: '#F5C518',
  bus: '#22C3D6',
  pete_pete: '#F2703F',
};

type LoadState = 'loading' | 'ready' | 'error';

function toLatLngs(geometry: {
  type: string;
  coordinates: any;
}): any {
  if (geometry.type === 'MultiLineString') {
    return geometry.coordinates.map(
      (line: [number, number][]) =>
        line.map(
          ([lng, lat]) =>
            [lat, lng] as [number, number],
        ),
    );
  }
  return geometry.coordinates.map(
    ([lng, lat]: [number, number]) =>
      [lat, lng] as [number, number],
  );
}

export default function GaligoMap() {
  const router = useRouter();
  const mapContainer =
    useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(
    null,
  );
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<
    Map<LayerKey, L.Polyline[]>
  >(new Map());
  const wisataMarkersRef = useRef<L.Marker[]>([]);

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
  const [chatOpen, setChatOpen] = useState(false);
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

  function openStationPanel(
    detail: StationDetail,
  ) {
    setChatOpen(false);
    setSelected(detail);
  }
  function openChat() {
    setSelected(null);
    setChatOpen(true);
  }

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
      api.poi('wisata'),
    ])
      .then(
        ([
          stationList,
          routeList,
          summaryData,
          wisataList,
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
            const latlngs = toLatLngs(r.geometry);
            const color =
              ROUTE_COLOR[r.mode] ?? '#999';
            const isSpine = r.name.includes(
              'garis penghubung',
            );
            const key = r.mode as LayerKey;
            const existing =
              routeLayersRef.current.get(key) ??
              [];

            if (isSpine) {
              const line = L.polyline(latlngs, {
                color,
                weight: 2,
                dashArray: '6 6',
                opacity: 0.6,
              }).addTo(map);
              existing.push(line);
            } else {
              const baseWeight =
                r.mode === 'kereta' ? 4 : 3;
              const casing = L.polyline(latlngs, {
                color: '#00000066',
                weight: baseWeight + 3,
              }).addTo(map);
              const line = L.polyline(latlngs, {
                color,
                weight: baseWeight,
              }).addTo(map);
              existing.push(casing, line);
            }
            routeLayersRef.current.set(
              key,
              existing,
            );
          }

          for (const w of wisataList) {
            const [lng, lat] =
              w.geometry.coordinates;
            const marker = L.marker([lat, lng], {
              icon: wisataIcon,
            }).addTo(map);
            const photoHtml = w.photoUrl
              ? `<img src="${w.photoUrl}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px" />`
              : '';
            marker.bindPopup(
              `<div style="max-width:220px">${photoHtml}<strong>${w.name}</strong><p style="margin:4px 0 0;font-size:12px;color:#453960">${w.description ?? ''}</p></div>`,
            );
            wisataMarkersRef.current.push(marker);
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
      wisataMarkersRef.current.forEach((m) =>
        m.remove(),
      );
      wisataMarkersRef.current = [];
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
    setSelectedLoading(true);
    try {
      const detail = await api.station(slug);
      openStationPanel(detail);
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
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Map Section (sticky top) ── */}
      <div className="relative h-[50vh] min-h-[300px] w-full shrink-0">
        <div
          ref={mapContainer}
          className="absolute inset-0"
        />

        <MapHeader />
        <LayerFilterChips
          active={activeLayers}
          onToggle={handleToggleLayer}
        />

        {/* Back button on map */}
        <button
          onClick={() => router.push('/beranda')}
          className="absolute bottom-4 left-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-2 hover:bg-soft transition"
          aria-label="Kembali ke Beranda"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Filter/menu button on map */}
        <button
          onClick={() => {}}
          className="absolute bottom-4 right-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-2"
          aria-label="Filter"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6H16M6 10H14M8 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {loadState === 'loading' && (
          <div className="absolute left-4 top-32 z-[1000] rounded-pill bg-card px-4 py-2 text-sm text-ink-500 shadow-2">
            Memuat data peta…
          </div>
        )}
        {loadState === 'error' && (
          <div className="absolute left-4 top-32 z-[1000] rounded-card bg-bad-bg px-4 py-3 text-sm text-bad shadow-2">
            Gagal memuat data dari server. Pastikan
            backend jalan, lalu muat ulang halaman.
          </div>
        )}
        {selectedLoading && (
          <div className="absolute bottom-4 left-16 z-[1000] rounded-pill bg-card px-4 py-2 text-sm text-ink-500 shadow-2">
            Memuat detail titik…
          </div>
        )}
      </div>

      {/* ── Scrollable Content Below Map ── */}
      <div className="relative z-10 -mt-3 flex-1 rounded-t-[20px] bg-page">
        <InlineStats
          stations={stations}
          summary={summary}
        />
      </div>

      {/* ── Overlays (Station Detail Panel) ── */}
      {selected && !selectedLoading && (
        <StationDetailPanel
          station={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── Chat Widget ── */}
      <ChatWidget
        stations={stations}
        currentStationSlug={
          selected?.slug ?? null
        }
        onSelectStation={handleSelectStation}
        isOpen={chatOpen}
        onOpenChange={(next) =>
          next ? openChat() : setChatOpen(false)
        }
      />
    </div>
  );
}
