'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NavigasiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const routeName = searchParams.get('route') || 'A';
  const fromParam = searchParams.get('from') || 'Halte Cempae';
  const toParam = searchParams.get('to') || 'Terminal Pangkep';

  const [eta, setEta] = useState(8);
  const [currentProgress, setCurrentProgress] = useState(35); // percent along the route
  const [currentSpeed, setCurrentSpeed] = useState(32); // km/h

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#e4e0d4]">
      {/* ── Top Floating Header sesuai Figma ── */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between rounded-[20px] bg-[#4C328E] px-4 py-3 text-white shadow-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#91C3EE] text-[#4C328E] hover:bg-white transition"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="text-xs">
            <span className="font-medium text-white/90">Sedang di </span>
            <span className="font-bold text-[#F5BA31]">Pete-pete C3</span>
            <span className="text-white/80"> · menuju {toParam}</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#3B82F6] px-3 py-1.5 text-center">
          <p className="text-[11px] font-extrabold text-white leading-tight">ETA {eta}</p>
          <p className="text-[9px] text-white/90 uppercase tracking-tighter">mnt</p>
        </div>
      </div>

      {/* ── Fullscreen Map Background Representation ── */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Stylized SVG Map mimicking Figma screen 10 */}
        <svg
          viewBox="0 0 400 800"
          className="h-full w-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Subtle Map Roads */}
          <path d="M-20,100 Q150,150 420,120" stroke="#d5d0c2" strokeWidth="18" fill="none" opacity="0.6" />
          <path d="M100,-20 Q180,400 80,820" stroke="#d5d0c2" strokeWidth="24" fill="none" opacity="0.6" />
          <path d="M-20,650 Q200,600 420,700" stroke="#d5d0c2" strokeWidth="16" fill="none" opacity="0.6" />

          {/* Planned Dotted Future Route */}
          <path
            d="M 120 720 Q 200 500 215 360 T 320 120"
            stroke="#b3984c"
            strokeWidth="8"
            strokeDasharray="8,8"
            fill="none"
          />

          {/* Active Route Traveled Line */}
          <path
            d="M 120 720 Q 200 500 215 360"
            stroke="#1b635c"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Origin Marker */}
          <circle cx="120" cy="720" r="9" fill="#1b2838" />
          <circle cx="120" cy="720" r="4" fill="white" />
          <text x="140" y="725" fill="#3B1D6E" fontSize="11" fontWeight="bold">
            {fromParam}
          </text>

          {/* Intermediate Station Marker */}
          <circle cx="180" cy="510" r="10" fill="#2d6e64" />
          <circle cx="180" cy="510" r="5" fill="#e6f4f5" />

          {/* Live Moving Vehicle Marker */}
          <g transform={`translate(${215}, ${360})`}>
            {/* Radar Pulse */}
            <circle cx="0" cy="0" r="22" fill="#F2703F" opacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#F2703F" opacity="0.4" />
            <circle cx="0" cy="0" r="8" fill="#F2703F" stroke="white" strokeWidth="2.5" />
          </g>

          {/* Destination Marker */}
          <circle cx="320" cy="120" r="9" fill="#F5C518" stroke="#3B1D6E" strokeWidth="2" />
          <text x="210" y="115" fill="#3B1D6E" fontSize="11" fontWeight="bold">
            {toParam}
          </text>
        </svg>

        {/* Center Live Badge */}
        <div className="absolute top-24 left-4 z-20 flex items-center gap-1.5 rounded-pill bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-ink-700 shadow-2 border border-white/60">
          <span className="flex h-2 w-2 rounded-full bg-[#17B26A] animate-pulse"></span>
          <span>GPS Terhubung · Kecepatan {currentSpeed} km/h</span>
        </div>
      </div>

      {/* ── Bottom Floating Card ── */}
      <div className="absolute bottom-6 inset-x-4 z-30 flex flex-col gap-3 rounded-[20px] bg-white p-5 shadow-3 border border-line">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-ink-300 uppercase tracking-wide">Pemberhentian Berikutnya</p>
            <h3 className="text-sm font-extrabold text-ink-900 mt-0.5">Halte Simpang Tiga Pangkep</h3>
          </div>
          <div className="text-right">
            <span className="rounded-pill bg-ok-bg px-2.5 py-1 text-[10px] font-bold text-ok">
              Lancar
            </span>
            <p className="text-[10px] text-ink-300 mt-1">± 3 mnt lagi</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-page rounded-full h-2 overflow-hidden border border-line">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => router.push('/beranda')}
            className="flex-1 rounded-pill border border-line py-2.5 text-xs font-semibold text-ink-700 hover:bg-soft transition text-center"
          >
            Akhiri Perjalanan
          </button>
          <button
            onClick={() => router.push('/tanya-galigo?q=Bagaimana%20kondisi%20rute%20saat%20ini%3F')}
            className="flex-1 rounded-pill bg-brand-600 py-2.5 text-xs font-bold text-white shadow-2 hover:bg-brand-700 transition text-center"
          >
            Tanya AI
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NavigasiPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xs text-ink-300">Menyiapkan navigasi...</div>}>
      <NavigasiContent />
    </Suspense>
  );
}
