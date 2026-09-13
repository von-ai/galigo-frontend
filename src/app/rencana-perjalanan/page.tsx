'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RencanaPerjalananContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const routeName = searchParams.get('route') || 'A';
  const fromParam = searchParams.get('from') || 'Halte Cempae';
  const toParam = searchParams.get('to') || 'Stasiun Pangkep';
  const durationParam = searchParams.get('duration') || '42';
  const costParam = searchParams.get('cost') || '15000';
  const transitParam = searchParams.get('transit') || '1';

  const handleStartNav = () => {
    router.push(`/navigasi?route=${routeName}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Top Header sesuai Figma Rencana Perjalanan ── */}
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
            <h1 className="text-lg font-bold">Rencana Perjalanan · Rute {routeName}</h1>
            <p className="text-xs text-white/70">{fromParam} → {toParam}</p>
          </div>
        </div>
      </div>

      {/* ── 3 Summary KPI Cards ── */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-[16px] bg-[#f0ebf8] p-3 text-center border border-[#d3cbe6]">
            <p className="text-base font-extrabold text-[#3B1D6E]">{durationParam} mnt</p>
            <p className="text-[10px] font-semibold text-ink-500 mt-0.5">Total waktu</p>
          </div>
          <div className="rounded-[16px] bg-[#f0ebf8] p-3 text-center border border-[#d3cbe6]">
            <p className="text-base font-extrabold text-[#3B1D6E]">Rp{Number(costParam) / 1000}rb</p>
            <p className="text-[10px] font-semibold text-ink-500 mt-0.5">Total biaya</p>
          </div>
          <div className="rounded-[16px] bg-[#f0ebf8] p-3 text-center border border-[#d3cbe6]">
            <p className="text-base font-extrabold text-[#3B1D6E]">{transitParam}x</p>
            <p className="text-[10px] font-semibold text-ink-500 mt-0.5">Transit</p>
          </div>
        </div>
      </div>

      {/* ── Timeline Tahapan Perjalanan ── */}
      <div className="flex-1 px-5 pt-6 pb-24 overflow-y-auto">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-4">Tahapan Perjalanan</h2>

        <div className="relative pl-6">
          {/* Vertical line connecting the steps */}
          <div className="absolute left-2.5 top-3 bottom-8 w-0.5 bg-line-strong"></div>

          {/* Step 1: Pete-pete */}
          <div className="relative mb-6">
            {/* Dot */}
            <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-[#F2703F] border-2 border-white ring-2 ring-[#F2703F]/20 shadow-1"></div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-900">{fromParam}</h3>
              <span className="text-[11px] font-semibold text-ink-500">06.50</span>
            </div>

            {/* Inner Details Card */}
            <div className="mt-2 rounded-[16px] bg-white p-4 border border-line shadow-1">
              <div className="flex items-start gap-2.5 mb-3">
                <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white bg-[#F2703F]">
                  Pete-pete
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink-900">Jalur C3 — arah Terminal Pangkep</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-ink-300 uppercase">Waktu tempuh</span>
                  <p className="font-bold text-ink-900">20 menit</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-ink-300 uppercase">Perkiraan tarif</span>
                  <p className="font-bold text-ink-900">Rp 7.000</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-ink-300 uppercase">Nomor plat</span>
                  <p className="font-semibold text-ink-900 font-mono">DD 1872 QC</p>
                </div>
              </div>

              <div className="mt-3 flex gap-1.5 border-t border-line/60 pt-2.5">
                <span className="rounded-pill border border-line bg-page px-2.5 py-0.5 text-[10px] font-medium text-ink-500">
                  Tunai / QRIS
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Transit */}
          <div className="relative mb-6">
            {/* Dot */}
            <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-[#22C3D6] border-2 border-white ring-2 ring-[#22C3D6]/20 shadow-1"></div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-900">Terminal Transit Pangkep</h3>
              <span className="text-[11px] font-semibold text-ink-500">07.10</span>
            </div>

            {/* Inner Details Card */}
            <div className="mt-2 rounded-[16px] bg-[#e6f4f5]/60 p-4 border border-[#bce3e6]">
              <p className="text-xs font-semibold text-[#0c707d]">
                Transit — jalan kaki 3 menit (250m) ke Peron Kereta
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-pill bg-white px-2.5 py-0.5 text-[10px] font-medium text-[#0c707d] border border-[#bce3e6]">
                  Jalur ramah kursi roda
                </span>
                <span className="rounded-pill bg-white px-2.5 py-0.5 text-[10px] font-medium text-[#0c707d] border border-[#bce3e6]">
                  Waktu tunggu 5 mnt
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Kereta */}
          <div className="relative">
            {/* Dot */}
            <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-[#F5C518] border-2 border-white ring-2 ring-[#F5C518]/20 shadow-1"></div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-900">Peron Kereta Pangkep</h3>
              <span className="text-[11px] font-semibold text-ink-500">07.15</span>
            </div>

            {/* Inner Details Card */}
            <div className="mt-2 rounded-[16px] bg-white p-4 border border-line shadow-1">
              <div className="flex items-start gap-2.5 mb-3">
                <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white bg-[#F5C518]">
                  Kereta
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink-900">KA Trans Sulawesi — arah {toParam}</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-ink-300 uppercase">Waktu tempuh</span>
                  <p className="font-bold text-ink-900">15 menit</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-ink-300 uppercase">Perkiraan tarif</span>
                  <p className="font-bold text-ink-900">Rp 8.000</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-ink-300 uppercase">Gerbong disarankan</span>
                  <p className="font-semibold text-brand-600">Gerbong 2 (dekat pintu keluar)</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line/60 pt-2.5">
                <span className="rounded-pill border border-line bg-page px-2.5 py-0.5 text-[10px] font-medium text-ink-500">
                  Tunai / QRIS
                </span>
                <span className="rounded-pill bg-[#fff5eb] px-2.5 py-0.5 text-[10px] font-semibold text-[#f2703f]">
                  Padat – jam sibuk
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Start Navigation CTA ── */}
        <div className="mt-8">
          <button
            onClick={handleStartNav}
            className="w-full rounded-pill bg-[#F5BA31] py-3.5 text-xs font-bold text-[#3B1D6E] shadow-2 hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Mulai Navigasi Langsung
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RencanaPerjalananPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xs text-ink-300">Memuat rencana perjalanan...</div>}>
      <RencanaPerjalananContent />
    </Suspense>
  );
}
