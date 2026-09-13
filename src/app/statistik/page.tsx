'use client';

import { useRouter } from 'next/navigation';

// ─── Static mock data matching Figma prototype ───
const DAILY_ACTIVITY = [
  { day: 'Sen', value: 30 },
  { day: 'Sel', value: 45 },
  { day: 'Rab', value: 42 },
  { day: 'Kam', value: 60 },
  { day: 'Jum', value: 72 },
  { day: 'Sab', value: 85 },
  { day: 'Min', value: 95 },
];

const TRANSPORT_MODES = [
  { label: 'Pete-pete', pct: 67, color: '#F2703F' },
  { label: 'Kereta', pct: 22, color: '#F5C518' },
  { label: 'Bus', pct: 11, color: '#22C3D6' },
];

const ACCESSIBILITY = [
  { region: 'Maros', level: 'Tinggi', pct: 78, color: '#22C3D6' },
  { region: 'Pangkep', level: 'Rendah', pct: 45, color: '#F2703F' },
  { region: 'Barru', level: 'Rendah', pct: 35, color: '#F2703F' },
];

export default function StatistikWilayahPage() {
  const router = useRouter();
  const maxActivity = Math.max(
    ...DAILY_ACTIVITY.map((d) => d.value),
  );

  // Build conic gradient for donut
  let conicStops = '';
  let cumulative = 0;
  for (const mode of TRANSPORT_MODES) {
    const start = cumulative;
    cumulative += mode.pct;
    conicStops += `${mode.color} ${start}% ${cumulative}%, `;
  }
  // Fill remaining with gray if < 100
  if (cumulative < 100) {
    conicStops += `#e6e1f0 ${cumulative}% 100%`;
  } else {
    conicStops = conicStops.slice(0, -2); // remove trailing ", "
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Header ── */}
      <div className="bg-grad-header px-5 pb-5 pt-6 text-white">
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
            <h1 className="text-lg font-bold">
              Statistik Wilayah
            </h1>
            <p className="text-xs text-white/70">
              Aktivitas, moda, dan aksesibilitas
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-5 pb-10 pt-5">
        {/* ── Aktivitas Users ── */}
        <h2 className="text-sm font-bold text-brand-600">
          Aktivitas Users
        </h2>
        <div className="mt-3 flex items-end gap-2" style={{ height: 100 }}>
          {DAILY_ACTIVITY.map((d, i) => {
            const heightPct = (d.value / maxActivity) * 100;
            // Gradient purple from light to dark based on value
            const intensity = 0.4 + (d.value / maxActivity) * 0.6;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm2"
                style={{
                  height: `${heightPct}%`,
                  background: `rgba(91, 45, 142, ${intensity})`,
                  minWidth: 24,
                }}
              />
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-500">
          Kunjungan eksplorasi 7 hari terakhir — naik 24%
        </p>

        {/* ── Moda Transportasi ── */}
        <h2 className="mt-8 text-sm font-bold text-brand-600">
          Moda Transportasi
        </h2>
        <div className="mt-4 flex items-center gap-6">
          {/* Donut chart */}
          <div
            className="donut-chart shrink-0"
            style={{
              background: `conic-gradient(${conicStops})`,
            }}
          >
            <span className="donut-label">67%</span>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1">
            {TRANSPORT_MODES.map((mode) => (
              <div key={mode.label} className="flex items-center gap-2">
                <span className="text-xs text-ink-700 w-16 shrink-0">
                  {mode.label}
                </span>
                <div className="flex-1 h-2.5 rounded-pill bg-line overflow-hidden">
                  <div
                    className="h-full rounded-pill"
                    style={{
                      width: `${mode.pct}%`,
                      backgroundColor: mode.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tingkat Aksesibilitas ── */}
        <h2 className="mt-8 text-sm font-bold text-brand-600">
          Tingkat Aksesibilitas
        </h2>
        <div className="mt-1 h-px bg-line" />

        <div className="mt-4 flex flex-col gap-4">
          {ACCESSIBILITY.map((item) => (
            <div key={item.region} className="flex items-center gap-3">
              <span className="text-sm font-semibold text-ink-900 w-20 shrink-0">
                {item.region}
              </span>
              <div className="flex-1 h-2.5 rounded-pill bg-line overflow-hidden">
                <div
                  className="h-full rounded-pill transition-all duration-700"
                  style={{
                    width: `${item.pct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-ink-700 w-16 text-right shrink-0">
                {item.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
