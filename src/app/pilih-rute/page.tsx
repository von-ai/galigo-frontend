'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface RouteOption {
  id: string;
  name: string;
  isRecommended?: boolean;
  modes: { key: 'P' | 'B' | 'K'; label: string; color: string }[];
  modeSummary: string;
  duration: number; // minutes
  cost: number; // in rupiah
  transitCount: number;
}

const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'A',
    name: 'Rute A',
    isRecommended: true,
    modes: [
      { key: 'P', label: 'Pete-pete', color: 'bg-[#F2703F]' },
      { key: 'K', label: 'Kereta', color: 'bg-[#F5C518]' },
    ],
    modeSummary: 'Pete-pete → Kereta',
    duration: 42,
    cost: 15000,
    transitCount: 1,
  },
  {
    id: 'B',
    name: 'Rute B',
    modes: [
      { key: 'B', label: 'Bus', color: 'bg-[#22C3D6]' },
      { key: 'K', label: 'Kereta', color: 'bg-[#F5C518]' },
    ],
    modeSummary: 'Bus → Kereta',
    duration: 55,
    cost: 12000,
    transitCount: 1,
  },
  {
    id: 'C',
    name: 'Rute C',
    modes: [
      { key: 'P', label: 'Pete-pete', color: 'bg-[#F2703F]' },
      { key: 'P', label: 'Pete-pete', color: 'bg-[#F2703F]' },
      { key: 'K', label: 'Kereta', color: 'bg-[#F5C518]' },
    ],
    modeSummary: '2x Pete-pete → Kereta',
    duration: 38,
    cost: 16000,
    transitCount: 2,
  },
];

function PilihRuteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get('from') || 'Halte Cempae';
  const toParam = searchParams.get('to') || 'Stasiun Pangkep';

  const [activeFilter, setActiveFilter] = useState<'semua' | 'tercepat' | 'termurah' | 'transit'>('semua');

  const filterOptions = [
    { id: 'semua', label: 'Semua' },
    { id: 'tercepat', label: 'Tercepat' },
    { id: 'termurah', label: 'Termurah' },
    { id: 'transit', label: 'Transit paling sedikit' },
  ];

  const getSortedRoutes = () => {
    const list = [...ROUTE_OPTIONS];
    if (activeFilter === 'tercepat') {
      return list.sort((a, b) => a.duration - b.duration);
    }
    if (activeFilter === 'termurah') {
      return list.sort((a, b) => a.cost - b.cost);
    }
    if (activeFilter === 'transit') {
      return list.sort((a, b) => a.transitCount - b.transitCount);
    }
    return list;
  };

  const routes = getSortedRoutes();

  const handleSelectRoute = (route: RouteOption) => {
    router.push(
      `/rencana-perjalanan?route=${route.id}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&duration=${route.duration}&cost=${route.cost}&transit=${route.transitCount}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Header sesuai Figma Pilih Rute ── */}
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
            <h1 className="text-lg font-bold">Pilih Rute</h1>
            <p className="text-xs text-white/70">{fromParam} → {toParam}</p>
          </div>
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="border-b border-line bg-white px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`rounded-pill px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-brand-600 text-white shadow-1'
                  : 'border border-line bg-card text-ink-700 hover:bg-soft'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Route Cards List ── */}
      <div className="flex-1 px-5 pt-5 pb-20 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {routes.map(route => (
            <div
              key={route.id}
              onClick={() => handleSelectRoute(route)}
              className={`cursor-pointer rounded-[18px] bg-white p-5 transition-all active:scale-[0.99] ${
                route.isRecommended
                  ? 'border-2 border-[#F5BA31] shadow-2 ring-1 ring-[#F5BA31]/20'
                  : 'border border-line shadow-1 hover:border-line-strong hover:shadow-2'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-ink-900">{route.name}</h3>
                </div>
                {route.isRecommended && (
                  <span className="rounded-pill bg-[#F5BA31] px-3 py-0.5 text-[10px] font-bold text-[#3B1D6E]">
                    Disarankan
                  </span>
                )}
              </div>

              {/* Mode sequence */}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-500">
                {route.modes.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${m.color}`}>
                      {m.key}
                    </span>
                    {idx < route.modes.length - 1 && (
                      <span className="text-[10px] text-ink-300">→</span>
                    )}
                  </div>
                ))}
                <span className="ml-1 text-xs text-ink-700 font-medium">{route.modeSummary}</span>
              </div>

              {/* Metrics Grid */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line/60 pt-3">
                <div>
                  <span className="text-[10px] text-ink-300 uppercase tracking-wide">Waktu</span>
                  <p className="text-base font-extrabold text-ink-900 mt-0.5">{route.duration} mnt</p>
                </div>
                <div>
                  <span className="text-[10px] text-ink-300 uppercase tracking-wide">Biaya</span>
                  <p className="text-base font-extrabold text-ink-900 mt-0.5">Rp{route.cost / 1000}rb</p>
                </div>
                <div>
                  <span className="text-[10px] text-ink-300 uppercase tracking-wide">Transit</span>
                  <p className="text-base font-extrabold text-ink-900 mt-0.5">{route.transitCount}x</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── AI Recommendation Footer Card sesuai Figma ── */}
        <div className="mt-6 rounded-[16px] bg-white p-4 border border-line shadow-1 text-xs text-ink-700 leading-relaxed">
          <p>
            <span className="font-bold text-brand-600">Tanya Galigo</span> merekomendasikan <strong>Rute A</strong> — waktu tunggu transit paling singkat dan jadwalnya paling konsisten dari data community maps.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PilihRutePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xs text-ink-300">Memuat opsi rute...</div>}>
      <PilihRuteContent />
    </Suspense>
  );
}
