'use client';

import type { StationDetail } from '@/lib/types';

const CATEGORY_LABEL: Record<string, string> = {
  makan: 'Makan',
  musholla: 'Musholla',
  atm: 'ATM',
  toilet: 'Toilet',
  umkm: 'UMKM',
  wisata: 'Wisata',
};

export function StationDetailPanel({
  station,
  onClose,
}: {
  station: StationDetail;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-1000 max-w-md rounded-card border border-line bg-card p-4 shadow-3 md:right-auto">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-ink-900">
          {station.name}
        </h3>
        <button
          onClick={onClose}
          className="text-ink-300 hover:text-ink-700"
          aria-label="Tutup panel"
        >
          ✕
        </button>
      </div>

      <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
        Rekomendasi terdekat
      </h4>
      {station.nearbyPois.length === 0 ? (
        <p className="mt-1 text-sm text-ink-500">
          Belum ada tempat terdata di sekitar
          titik ini.
        </p>
      ) : (
        <ul className="mt-1 space-y-1">
          {station.nearbyPois.map((p) => (
            <li
              key={p.id}
              className="flex justify-between text-sm"
            >
              <span className="font-medium text-ink-900">
                {p.name}{' '}
                <span className="text-ink-300">
                  ·{' '}
                  {CATEGORY_LABEL[p.category] ??
                    p.category}
                </span>
              </span>
              <span className="shrink-0 text-ink-500">
                {Math.round(p.distance_m)} m
              </span>
            </li>
          ))}
        </ul>
      )}

      <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
        Estimasi kedatangan
      </h4>
      {station.estimates.length === 0 ? (
        <p className="mt-1 text-sm text-ink-500">
          Belum ada data estimasi.
        </p>
      ) : (
        <ul className="mt-1 space-y-1.5">
          {station.estimates.map((e) => (
            <li
              key={e.id}
              className={`rounded-sm2 border p-2 text-sm ${
                e.isSurveyed
                  ? 'border-line'
                  : 'border-dashed border-line-strong'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-semibold capitalize">
                  {e.mode.replace('_', '-')}
                </span>
                <span
                  className={
                    e.isSurveyed
                      ? 'font-bold text-brand-600'
                      : 'text-ink-300'
                  }
                >
                  {e.isSurveyed
                    ? (e.fixedTimeLabel ??
                      `${e.minMinutes}–${e.maxMinutes} menit`)
                    : 'Belum tersurvei'}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-ink-300">
                {e.sourceLabel}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
