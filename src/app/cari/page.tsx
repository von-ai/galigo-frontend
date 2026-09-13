'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Station } from '@/lib/types';

interface PoiItem {
  id: string;
  badge: string;
  name: string;
  subtitle: string;
  category: 'semua' | 'stasiun' | 'halte' | 'umkm' | 'atm' | 'wisata';
  tag: string;
  tagColor: string;
  lat?: number;
  lng?: number;
}

const STATIC_POIS: PoiItem[] = [
  {
    id: 'poi-1',
    badge: 'SB',
    name: 'Stasiun Barru',
    subtitle: '12 UMKM sekitar',
    category: 'stasiun',
    tag: 'Aksesibilitas sedang',
    tagColor: 'bg-[#e6f7ef] text-[#17b26a]',
  },
  {
    id: 'poi-2',
    badge: 'SP',
    name: 'Stasiun Pangkep',
    subtitle: 'Kawasan industri semen',
    category: 'stasiun',
    tag: 'Gap tinggi',
    tagColor: 'bg-[#fff5eb] text-[#f2703f]',
  },
  {
    id: 'poi-3',
    badge: 'SM',
    name: 'Stasiun Maros',
    subtitle: 'Terhubung Bus Trans Sulsel',
    category: 'stasiun',
    tag: 'Terlayani',
    tagColor: 'bg-[#fffbe6] text-[#d48806]',
  },
  {
    id: 'poi-4',
    badge: 'SP',
    name: 'Sentra UMKM Dermaga Barru',
    subtitle: '8 usaha terdaftar',
    category: 'umkm',
    tag: 'UMKM',
    tagColor: 'bg-[#e6f4f5] text-[#0c707d]',
  },
  {
    id: 'poi-5',
    badge: 'SP',
    name: 'Geopark Maros-Pangkep',
    subtitle: 'Titik wisata UNESCO',
    category: 'wisata',
    tag: 'Wisata',
    tagColor: 'bg-[#e6f4f5] text-[#0c707d]',
  },
  {
    id: 'poi-6',
    badge: 'HC',
    name: 'Halte Cempae',
    subtitle: 'Koneksi Pete-pete Koridor C3',
    category: 'halte',
    tag: 'Terlayani',
    tagColor: 'bg-[#fffbe6] text-[#d48806]',
  },
  {
    id: 'poi-7',
    badge: 'AT',
    name: 'ATM Center Stasiun Mandai',
    subtitle: 'BRI, BNI, Mandiri',
    category: 'atm',
    tag: 'ATM',
    tagColor: 'bg-[#f0ebf8] text-[#5B2D8E]',
  }
];

export default function CariPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('semua');
  const [query, setQuery] = useState<string>('');
  const [items, setItems] = useState<PoiItem[]>(STATIC_POIS);
  const [mode, setMode] = useState<'eksplorasi' | 'rute'>('eksplorasi');
  const [origin, setOrigin] = useState('Halte Cempae');
  const [destination, setDestination] = useState('Stasiun Pangkep');

  useEffect(() => {
    // Also fetch real stations from API to enrich list
    api.stations().then(fetched => {
      if (fetched && fetched.length > 0) {
        const enriched: PoiItem[] = fetched.map(s => {
          const initials = s.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          const isOk = s.surveyed_estimate_count > 0;
          return {
            id: s.id,
            badge: initials || 'ST',
            name: s.name,
            subtitle: s.poi_count > 0 ? `${s.poi_count} UMKM sekitar` : 'Belum ada feeder tersedia',
            category: 'stasiun',
            tag: isOk ? 'Aksesibilitas sedang' : 'Gap tinggi',
            tagColor: isOk ? 'bg-[#e6f7ef] text-[#17b26a]' : 'bg-[#fff5eb] text-[#f2703f]',
          };
        });

        // Merge keeping unique names
        setItems(prev => {
          const names = new Set(prev.map(p => p.name.toLowerCase()));
          const extra = enriched.filter(e => !names.has(e.name.toLowerCase()));
          return [...prev, ...extra];
        });
      }
    }).catch(console.error);
  }, []);

  const categories = [
    { id: 'semua', label: 'Semua' },
    { id: 'stasiun', label: 'Stasiun' },
    { id: 'halte', label: 'Halte' },
    { id: 'umkm', label: 'UMKM' },
    { id: 'atm', label: 'ATM' },
    { id: 'wisata', label: 'Wisata' },
  ];

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'semua' || item.category === activeTab;
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleSelectPoi = (item: PoiItem) => {
    // Navigate to route confirmation with this item as destination
    router.push(`/konfirmasi-rute?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(item.name)}`);
  };

  const handleStartRoute = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/konfirmasi-rute?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Top Header sesuai Figma Eksplorasi Titik ── */}
      <div className="bg-grad-header px-5 pb-5 pt-6 text-white shadow-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold">Eksplorasi Titik</h1>
            <p className="text-xs text-white/70">Cari & filter titik di peta</p>
          </div>
        </div>
      </div>

      {/* ── Mode Switcher (Eksplorasi Titik vs Rencana Rute) ── */}
      <div className="bg-white px-5 pt-3 pb-2 border-b border-line">
        <div className="flex rounded-pill bg-page p-1 border border-line">
          <button
            onClick={() => setMode('eksplorasi')}
            className={`flex-1 rounded-pill py-1.5 text-xs font-semibold transition ${
              mode === 'eksplorasi'
                ? 'bg-brand-600 text-white shadow-1'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Jelajahi Titik & Halte
          </button>
          <button
            onClick={() => setMode('rute')}
            className={`flex-1 rounded-pill py-1.5 text-xs font-semibold transition ${
              mode === 'rute'
                ? 'bg-brand-600 text-white shadow-1'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Atur Asal & Tujuan
          </button>
        </div>
      </div>

      {mode === 'eksplorasi' ? (
        <>
          {/* ── Search Bar Input ── */}
          <div className="bg-white px-5 py-3 border-b border-line">
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-ink-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari stasiun, halte, UMKM..."
                className="w-full rounded-pill border border-line bg-page py-2.5 pl-10 pr-4 text-xs text-ink-900 placeholder:text-ink-300 focus:border-brand-600 focus:bg-white outline-none transition"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-ink-300 hover:text-ink-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ── Category Filter Pills ── */}
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`rounded-pill px-3.5 py-1 text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === cat.id
                      ? 'bg-brand-600 text-white shadow-1'
                      : 'border border-line bg-white text-ink-700 hover:bg-soft'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── List POIs ── */}
          <div className="flex-1 px-5 pt-3 pb-20 overflow-y-auto">
            <div className="flex flex-col divide-y divide-line/70">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectPoi(item)}
                  className="flex items-center justify-between py-3.5 hover:bg-white/60 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#3B1D6E] font-bold text-white shadow-1">
                      {item.badge}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink-900 leading-tight">{item.name}</h3>
                      <p className="text-xs text-ink-500 mt-0.5">{item.subtitle}</p>
                      <span className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-brand-600 pl-2">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-sm text-ink-500">
                  Tidak ditemukan titik yang cocok dengan "{query}".
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ── Mode Atur Asal & Tujuan ── */
        <div className="flex-1 px-5 pt-5 pb-20 overflow-y-auto">
          <form onSubmit={handleStartRoute} className="rounded-[16px] bg-white p-5 border border-line shadow-1">
            <h2 className="text-sm font-bold text-ink-900 mb-4">Tentukan Rute Perjalanan</h2>
            
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label className="text-[11px] font-bold text-ink-300 uppercase tracking-wide">Titik Asal</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-page px-3 py-2.5">
                  <div className="h-3 w-3 rounded-full bg-brand-600"></div>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Masukkan lokasi asal..."
                    className="w-full bg-transparent text-xs font-semibold text-ink-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const temp = origin;
                    setOrigin(destination);
                    setDestination(temp);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-soft border border-line text-ink-500 hover:text-brand-600 hover:bg-white transition shadow-1"
                  title="Tukar Asal & Tujuan"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4M7 4L3 8M7 4L11 8M13 4V16M13 16L9 12M13 16L17 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-300 uppercase tracking-wide">Titik Tujuan</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-page px-3 py-2.5">
                  <div className="h-3 w-3 rounded-full border-2 border-magenta-500 bg-white"></div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Masukkan tujuan..."
                    className="w-full bg-transparent text-xs font-semibold text-ink-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-pill bg-brand-600 py-3 text-xs font-bold text-white shadow-2 hover:bg-brand-700 active:scale-98 transition"
                >
                  Lihat Konfirmasi Rute
                </button>
              </div>
            </div>
          </form>

          {/* Quick recommendations */}
          <div className="mt-5">
            <h3 className="text-xs font-bold text-ink-700 mb-2">Destinasi Populer</h3>
            <div className="flex flex-col gap-2">
              {STATIC_POIS.slice(0, 4).map(poi => (
                <div
                  key={poi.id}
                  onClick={() => setDestination(poi.name)}
                  className="flex items-center justify-between rounded-xl bg-white p-3 border border-line cursor-pointer hover:bg-soft transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">📍</span>
                    <div>
                      <p className="text-xs font-bold text-ink-900">{poi.name}</p>
                      <p className="text-[10px] text-ink-300">{poi.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-600">Pilih</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
