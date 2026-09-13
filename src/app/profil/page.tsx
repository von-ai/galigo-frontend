'use client';

import Link from 'next/link';

export default function ProfilPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Top Header ── */}
      <div className="bg-grad-header px-5 pb-8 pt-8 text-white rounded-b-[24px] shadow-2">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-bold border-2 border-white/40 shadow-2">
            TG
          </div>
          <div>
            <h1 className="text-lg font-bold">Teman Galigo</h1>
            <p className="text-xs text-white/80">Penumpang Terverifikasi · Maros</p>
            <span className="mt-1.5 inline-block rounded-pill bg-[#F5BA31] px-2.5 py-0.5 text-[10px] font-bold text-[#3B1D6E]">
              Kontributor Komunitas Aktif
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="grid grid-cols-3 gap-2 rounded-[16px] bg-white p-3 shadow-2 border border-line">
          <div className="text-center">
            <p className="text-xs text-ink-300">Perjalanan</p>
            <p className="text-base font-bold text-ink-900 mt-0.5">24x</p>
          </div>
          <div className="text-center border-x border-line">
            <p className="text-xs text-ink-300">Laporan</p>
            <p className="text-base font-bold text-ink-900 mt-0.5">6</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-ink-300">Poin Loyal</p>
            <p className="text-base font-bold text-brand-600 mt-0.5">320</p>
          </div>
        </div>
      </div>

      {/* ── Settings & Menus ── */}
      <div className="px-5 pt-6 pb-20 flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-300">Preferensi Perjalanan</h2>
          <div className="rounded-[16px] bg-white border border-line overflow-hidden shadow-1">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <span className="text-sm font-medium text-ink-900">Moda Transportasi Favorit</span>
              <span className="text-xs font-semibold text-brand-600">Kereta & Feeder</span>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-line">
              <span className="text-sm font-medium text-ink-900">Notifikasi Keterlambatan</span>
              <span className="text-xs font-semibold text-[#17B26A]">Aktif</span>
            </div>
            <Link href="/jadwal" className="flex items-center justify-between p-4 hover:bg-soft transition">
              <span className="text-sm font-medium text-ink-900">Daftar Jadwal Tersimpan</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-300"/>
              </svg>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-300">Aplikasi & Pengaturan</h2>
          <div className="rounded-[16px] bg-white border border-line overflow-hidden shadow-1">
            <Link href="/statistik" className="flex items-center justify-between p-4 border-b border-line hover:bg-soft transition">
              <span className="text-sm font-medium text-ink-900">Statistik Wilayah Sulawesi Selatan</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-300"/>
              </svg>
            </Link>
            <Link href="/dishub/login" className="flex items-center justify-between p-4 hover:bg-soft transition">
              <span className="text-sm font-medium text-ink-900">Portal Petugas Dishub</span>
              <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
