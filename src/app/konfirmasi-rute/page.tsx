'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function KonfirmasiRuteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get('from') || 'Pelabuhan Barru';
  const toParam = searchParams.get('to') || 'Stasiun Barru';

  const [selectedOption, setSelectedOption] = useState<'pete_pete' | 'jalan_kaki'>('pete_pete');

  const handleUseRoute = () => {
    router.push(`/pilih-rute?from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&mode=${selectedOption}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Top Header sesuai Figma Ringkasan Keputusan ── */}
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
            <h1 className="text-lg font-bold">Ringkasan Keputusan</h1>
            <p className="text-xs text-white/70">{fromParam} → {toParam}</p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pt-5 pb-20 overflow-y-auto">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">Pilihan Moda</h2>

        <div className="flex flex-col gap-3">
          {/* Card 1: Pete-pete B2 */}
          <div
            onClick={() => setSelectedOption('pete_pete')}
            className={`cursor-pointer rounded-[16px] bg-white p-4 transition-all ${
              selectedOption === 'pete_pete'
                ? 'border-2 border-[#F5BA31] shadow-2 ring-1 ring-[#F5BA31]/30'
                : 'border border-line shadow-1 hover:border-line-strong'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-900">Pete-pete B2</h3>
              <span className="rounded-pill bg-[#F5BA31] px-2.5 py-0.5 text-[10px] font-bold text-[#3B1D6E]">
                Disarankan
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-ink-500">Waktu tempuh</span>
                <p className="font-bold text-ink-900">5 menit</p>
              </div>
              <div className="text-right">
                <span className="text-ink-500">Biaya estimasi</span>
                <p className="font-bold text-ink-900">Rp 7.000</p>
              </div>
              <div className="col-span-2 mt-1 border-t border-line/60 pt-2">
                <span className="text-ink-500">Keterhubungan jadwal</span>
                <p className="font-bold text-brand-600">06.40 WITA</p>
                <p className="text-[10px] text-ink-300 italic">*Menyesuaikan kedatangan KAI</p>
              </div>
            </div>
          </div>

          {/* Card 2: Jalan kaki */}
          <div
            onClick={() => setSelectedOption('jalan_kaki')}
            className={`cursor-pointer rounded-[16px] bg-white p-4 transition-all ${
              selectedOption === 'jalan_kaki'
                ? 'border-2 border-[#F5BA31] shadow-2 ring-1 ring-[#F5BA31]/30'
                : 'border border-line shadow-1 hover:border-line-strong'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-900">Jalan kaki</h3>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-ink-500">Waktu tempuh</span>
                <p className="font-bold text-ink-900">12 menit</p>
              </div>
              <div className="text-right">
                <span className="text-ink-500">Jarak</span>
                <p className="font-bold text-ink-900">900 m</p>
              </div>
              <div className="col-span-2 mt-1 border-t border-line/60 pt-2">
                <span className="text-ink-500">Keterhubungan jadwal</span>
                <p className="font-medium text-ink-700">Tidak terikat jadwal</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Alasan AI Box sesuai Figma ── */}
        <div className="mt-6 rounded-[16px] bg-[#e6f4f5]/70 p-4 border border-[#bce3e6]">
          <div className="flex items-center gap-1.5 mb-1 text-[#0c707d]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <h4 className="text-xs font-bold">Alasan AI</h4>
          </div>
          <p className="text-xs text-ink-700 leading-relaxed">
            Pete-pete B2 disarankan karena jadwalnya sudah menyesuaikan kedatangan kereta, sehingga risiko menunggu lebih kecil dibanding estimasi jalan kaki pada jam sibuk.
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleUseRoute}
            className="w-full rounded-pill bg-grad-brand py-3 text-xs font-bold text-white shadow-2 hover:opacity-95 active:scale-98 transition"
          >
            Gunakan Rute Ini
          </button>
          
          <Link
            href={`/tanya-galigo?q=${encodeURIComponent(`Bandingkan opsi perjalanan dari ${fromParam} ke ${toParam}`)}`}
            className="w-full rounded-pill border border-line bg-white py-2.5 text-center text-xs font-semibold text-brand-600 hover:bg-soft transition"
          >
            💬 Diskusikan dengan Tanya Galigo AI
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function KonfirmasiRutePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xs text-ink-300">Memuat rute...</div>}>
      <KonfirmasiRuteContent />
    </Suspense>
  );
}
