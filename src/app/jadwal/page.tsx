'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { RouteLine } from '@/lib/types';

const MOCK_SCHEDULES = {
  kereta: {
    price: 'Rp 10.000',
    freq: '2x Sehari (Pagi & Sore)',
    status: 'Beroperasi',
    statusColor: 'text-ok bg-ok-bg',
  },
  bus: {
    price: 'Rp 5.000 - Rp 15.000',
    freq: 'Setiap 1 jam',
    status: 'Beroperasi',
    statusColor: 'text-ok bg-ok-bg',
  },
  pete_pete: {
    price: 'Rp 5.000 - Rp 10.000',
    freq: 'Reguler (Siang hari)',
    status: 'Tidak tentu',
    statusColor: 'text-warn bg-warn-bg',
  }
};

const MODE_LABELS: Record<string, string> = {
  kereta: 'Kereta Trans-Sulawesi',
  bus: 'Bus Trans Andalan',
  pete_pete: 'Pete-pete',
};

export default function JadwalPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<RouteLine[]>([]);
  const [activeTab, setActiveTab] = useState<string>('semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.routes().then(data => {
      // Filter out spine lines
      setRoutes(data.filter(r => !r.name.includes('garis penghubung')));
      setLoading(false);
    }).catch(console.error);
  }, []);

  const tabs = [
    { id: 'semua', label: 'Semua' },
    { id: 'kereta', label: 'Kereta' },
    { id: 'bus', label: 'Bus' },
    { id: 'pete_pete', label: 'Pete-pete' },
  ];

  const filteredRoutes = activeTab === 'semua' 
    ? routes 
    : routes.filter(r => r.mode === activeTab);

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Header ── */}
      <div className="bg-grad-header px-5 pb-4 pt-6 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold">Jadwal & Tarif</h1>
            <p className="text-xs text-white/70">Maros – Pangkep – Barru</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white px-5 pt-3 border-b border-line">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-ink-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pt-5 pb-20 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 rounded-full border-2 border-brand-600 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredRoutes.map((route, i) => {
              const mock = MOCK_SCHEDULES[route.mode] || MOCK_SCHEDULES.pete_pete;
              
              return (
                <div key={route.id || i} className="rounded-[16px] bg-white p-4 border border-line shadow-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                          route.mode === 'kereta' ? 'bg-[#F5C518]' :
                          route.mode === 'bus' ? 'bg-[#22C3D6]' : 'bg-[#F2703F]'
                        }`}>
                          {MODE_LABELS[route.mode] || route.mode}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-ink-900 leading-snug">{route.name}</h3>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2">
                    <div>
                      <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-wide">Tarif</p>
                      <p className="text-sm font-medium text-ink-900 mt-0.5">{mock.price}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-wide">Frekuensi</p>
                      <p className="text-sm font-medium text-ink-900 mt-0.5">{mock.freq}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-wide">Status</p>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded-pill text-[10px] font-semibold ${mock.statusColor}`}>
                          {mock.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredRoutes.length === 0 && (
              <div className="text-center py-10 text-ink-500 text-sm">
                Belum ada data jadwal untuk moda transportasi ini.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
