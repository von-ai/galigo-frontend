'use client';

import type { StationDetail } from '@/lib/types';
import {
  getCategoryConfig,
  MODE_CONFIG,
} from '@/lib/display-config';

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="mt-5 flex items-center gap-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {title}
      </h4>
      {count > 0 && (
        <span className="rounded-pill bg-soft px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="mt-2 text-sm text-ink-300">
      {text}
    </p>
  );
}

export function StationDetailPanel({
  station,
  onClose,
}: {
  station: StationDetail;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-1000 max-h-[70vh] overflow-y-auto rounded-t-card border-t border-line bg-card shadow-3">
      <div className="mx-auto mt-2 h-1 w-10 rounded-pill bg-line-strong" />

      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-3">
        <h3 className="text-lg font-bold text-ink-900">
          {station.name}
        </h3>
        <button
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-soft text-ink-500 hover:text-ink-900"
          aria-label="Tutup panel"
        >
          ✕
        </button>
      </div>

      <div className="px-5 pb-6">
        {/* Estimasi kedatangan — kartu horizontal berwarna per moda */}
        <SectionHeader
          title="Estimasi Kedatangan"
          count={station.estimates.length}
        />
        {station.estimates.length === 0 ? (
          <EmptyState text="Belum ada data estimasi untuk titik ini." />
        ) : (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {station.estimates.map((e) => {
              const mode = MODE_CONFIG[
                e.mode
              ] ?? {
                label: e.mode,
                icon: '🚏',
                border: 'border-line',
                bg: 'bg-soft',
              };
              return (
                <div
                  key={e.id}
                  className={`min-w-37.5 shrink-0 rounded-card border-2 p-3 ${
                    e.isSurveyed
                      ? mode.border
                      : 'border-dashed border-line-strong bg-soft'
                  } ${e.isSurveyed ? mode.bg : ''}`}
                >
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                    <span>{mode.icon}</span>
                    <span>{mode.label}</span>
                  </div>
                  <div
                    className={`mt-2 text-lg font-bold ${e.isSurveyed ? 'text-ink-900' : 'text-ink-300'}`}
                  >
                    {e.isSurveyed
                      ? (e.fixedTimeLabel ??
                        `${e.minMinutes}–${e.maxMinutes} mnt`)
                      : 'Belum tersurvei'}
                  </div>
                  <div className="mt-1 text-[11px] leading-tight text-ink-500">
                    {e.sourceLabel}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rekomendasi terdekat — amenitas jalan kaki (600m) */}
        <SectionHeader
          title="Rekomendasi Terdekat"
          count={station.nearbyPois.length}
        />
        {station.nearbyPois.length === 0 ? (
          <EmptyState text="Belum ada tempat terdata di sekitar titik ini." />
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {station.nearbyPois.map((p) => {
              const cfg = getCategoryConfig(
                p.category,
              );
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm2 text-sm ${cfg.badge}`}
                  >
                    {cfg.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-ink-500">
                      {cfg.label}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-pill bg-soft px-2 py-1 text-xs font-medium text-ink-500">
                    {Math.round(p.distance_m)} m
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Kawasan sekitar — landmark skala kawasan, dijodohkan ke stasiun terdekat */}
        <SectionHeader
          title="Kawasan Sekitar"
          count={station.kawasanPois.length}
        />
        {station.kawasanPois.length === 0 ? (
          <EmptyState text="Belum ada data kawasan untuk titik ini." />
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {station.kawasanPois.map((p) => {
              const cfg = getCategoryConfig(
                p.category,
              );
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm2 text-sm ${cfg.badge}`}
                  >
                    {cfg.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-ink-500">
                      {cfg.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
