'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Station } from '@/lib/types';

export default function BerandaPage() {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    api.stations().then(setStations).catch(console.error);
  }, []);

  // Ambil beberapa stasiun untuk shortcut acak (mock behavior)
  const shortcuts = stations.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="bg-grad-header px-5 pb-8 pt-10 text-white rounded-b-[24px] shadow-2 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">
              TG
            </div>
            <div>
              <h1 className="text-sm text-white/80">Halo,</h1>
              <p className="text-lg font-bold">Teman Galigo</p>
            </div>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-[#3b1d6e] bg-[#F5BA31]"></span>
          </button>
        </div>
      </div>

      {/* ── Search Card Overlapping Header ── */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="rounded-[16px] bg-white p-4 shadow-3 border border-line">
          <Link href="/cari" className="flex items-center gap-3 rounded-xl bg-page px-4 py-3 text-ink-500 hover:bg-soft transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="text-sm">Mau ke mana hari ini?</span>
          </Link>
          
          {shortcuts.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {shortcuts.map(s => (
                <Link key={s.id} href="/cari" className="flex items-center gap-1.5 shrink-0 rounded-pill border border-line bg-card px-3 py-1.5 text-xs text-ink-700 shadow-1">
                  <span className="text-[10px]">📍</span>
                  {s.name.split(' ')[0]}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-5 pt-6 pb-20">
        
        {/* Real-time Status Banner */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-[#e6f7ef] px-4 py-3 border border-[#b2e5cc]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ok text-white shadow-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0a4d2e]">Semua moda beroperasi normal</p>
              <p className="text-[10px] text-[#17b26a]">Diperbarui 5 menit lalu</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <h2 className="mb-3 text-sm font-bold text-ink-900">Jelajahi Galigo</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/cari" className="flex flex-col justify-between rounded-[16px] bg-[#f0ebf8] p-4 border border-[#d3cbe6] h-[100px] hover:shadow-2 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <p className="text-sm font-bold text-brand-900 mt-2">Rencana Rute</p>
          </Link>
          
          <Link href="/jadwal" className="flex flex-col justify-between rounded-[16px] bg-[#fff5eb] p-4 border border-[#ffe0cc] h-[100px] hover:shadow-2 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2703f] text-white shadow-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <p className="text-sm font-bold text-[#b34015] mt-2">Jadwal & Tarif</p>
          </Link>

          <Link href="/tanya-galigo" className="flex flex-col justify-between rounded-[16px] bg-[#fae6f3] p-4 border border-[#f0c2e0] h-[100px] hover:shadow-2 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-magenta-500 text-white shadow-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-bold text-[#7a195b] mt-2">Tanya Galigo AI</p>
          </Link>

          <Link href="/komunitas" className="flex flex-col justify-between rounded-[16px] bg-[#e6f4f5] p-4 border border-[#bce3e6] h-[100px] hover:shadow-2 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c3d6] text-white shadow-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <p className="text-sm font-bold text-[#0c707d] mt-2">Community Map</p>
          </Link>
        </div>

        {/* Recent Routes (Mock) */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-ink-900">Rute Terakhir</h2>
          <button className="text-xs font-semibold text-brand-600">Lihat Semua</button>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link href="/rencana-perjalanan" className="flex items-center justify-between rounded-[12px] bg-card p-4 border border-line shadow-1 hover:shadow-2 transition">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="h-2 w-2 rounded-full bg-brand-600"></div>
                <div className="h-4 w-px bg-line-strong"></div>
                <div className="h-2 w-2 rounded-full border-2 border-magenta-500 bg-white"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">St. Mandai</p>
                <p className="text-xs text-ink-500 mt-1">St. Barru</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-ink-900">Rp 10.000</p>
              <p className="text-xs text-ink-500 mt-1">~45 mnt</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
