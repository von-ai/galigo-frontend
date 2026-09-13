'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between bg-white px-6 pb-12 pt-24">
      {/* Logo & Headline */}
      <div className="flex flex-col items-center flex-1 w-full mt-10">
        {/* Galigo logo icon — stylized pinwheel with brand colors */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6 animate-fade-in"
        >
          {/* Top-right petal */}
          <path
            d="M55 20 C55 10, 70 5, 78 15 C86 25, 75 35, 65 30 C60 27, 55 25, 55 20Z"
            fill="#5B2D8E"
          />
          <path
            d="M65 30 C75 35, 85 30, 82 18 C86 28, 80 40, 70 38 C63 36, 58 33, 65 30Z"
            fill="#3B1D6E"
          />
          {/* Right petal */}
          <path
            d="M75 45 C85 42, 92 50, 85 60 C78 70, 68 63, 70 53 C71 48, 73 46, 75 45Z"
            fill="#C2379B"
          />
          <path
            d="M70 53 C68 63, 75 72, 87 65 C78 72, 66 70, 65 62 C64 55, 66 50, 70 53Z"
            fill="#A82C86"
          />
          {/* Bottom-right petal */}
          <path
            d="M60 72 C65 82, 58 90, 47 87 C36 84, 38 72, 48 72 C53 72, 57 72, 60 72Z"
            fill="#5B2D8E"
          />
          <path
            d="M48 72 C38 72, 30 78, 38 88 C32 80, 35 68, 43 66 C50 65, 55 67, 48 72Z"
            fill="#7B35A8"
          />
          {/* Left petal */}
          <path
            d="M25 58 C15 62, 8 55, 12 44 C16 33, 28 38, 28 48 C28 53, 26 56, 25 58Z"
            fill="#C2379B"
          />
          <path
            d="M28 48 C28 38, 20 30, 10 38 C18 30, 30 32, 33 40 C35 47, 32 52, 28 48Z"
            fill="#5B2D8E"
          />
          {/* Top-left petal */}
          <path
            d="M38 28 C32 18, 40 10, 50 12 C60 14, 58 26, 50 28 C45 29, 40 29, 38 28Z"
            fill="#7B35A8"
          />
          <path
            d="M50 28 C58 26, 65 18, 55 10 C62 16, 60 28, 52 32 C46 35, 42 32, 50 28Z"
            fill="#C2379B"
          />
          {/* Center circle */}
          <circle cx="50" cy="50" r="8" fill="#5B2D8E" />
        </svg>

        <h1
          className="text-4xl font-extrabold tracking-wide animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #5B2D8E 0%, #C2379B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animationDelay: '100ms',
          }}
        >
          GALIGO
        </h1>
        
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold text-ink-900 leading-tight">
            Kemana ki'<br />hari ini?
          </h2>
          <p className="mt-3 text-sm font-medium text-ink-500 leading-relaxed max-w-[250px] mx-auto">
            Geospatial Adaptive Linkage & Integrated Governance Optimizer
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
        <Link
          href="/beranda"
          className="flex w-full items-center justify-center rounded-pill bg-[#F5BA31] py-4 text-base font-bold text-ink-900 shadow-2 hover:bg-[#e3a820] transition-colors"
        >
          Mulai Perjalanan
        </Link>
      </div>
    </div>
  );
}
