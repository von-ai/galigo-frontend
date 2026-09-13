// src/components/chat/TripPlanCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { StationDetail } from '@/lib/types';
import { MODE_CONFIG } from '@/lib/display-config';

export function TripPlanCard({
  fromSlug,
  toSlug,
}: {
  fromSlug: string;
  toSlug: string;
}) {
  const [from, setFrom] =
    useState<StationDetail | null>(null);
  const [to, setTo] =
    useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.station(fromSlug),
      api.station(toSlug),
    ])
      .then(([f, t]) => {
        if (cancelled) return;
        setFrom(f);
        setTo(t);
      })
      .catch(() => !cancelled && setError(true))
      .finally(
        () => !cancelled && setLoading(false),
      );
    return () => {
      cancelled = true;
    };
  }, [fromSlug, toSlug]);

  if (loading)
    return (
      <div className="text-xs text-ink-300">
        Menyusun rencana perjalanan…
      </div>
    );
  if (error || !from || !to)
    return (
      <div className="text-xs text-bad">
        Gagal memuat data titik.
      </div>
    );

  // Heuristik sederhana: nama kereta (bagian sebelum "·" di sourceLabel)
  // yang muncul di catatan estimasi KEDUA stasiun — kandidat kuat sebagai
  // kereta yang sama. Ini pencocokan teks, bukan penalaran AI.
  const fromTrainNames = new Set(
    from.estimates
      .filter((e) => e.mode === 'kereta')
      .map((e) =>
        e.sourceLabel.split('·')[0].trim(),
      ),
  );
  const sharedTrains = [
    ...new Set(
      to.estimates
        .filter(
          (e) =>
            e.mode === 'kereta' &&
            fromTrainNames.has(
              e.sourceLabel.split('·')[0].trim(),
            ),
        )
        .map((e) =>
          e.sourceLabel.split('·')[0].trim(),
        ),
    ),
  ];

  function renderStationLegs(
    station: StationDetail,
    label: string,
  ) {
    return (
      <div className="rounded-card border border-line p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          {label}
        </div>
        <div className="mt-1 text-sm font-semibold text-ink-900">
          {station.name}
        </div>
        {station.estimates.length === 0 ? (
          <p className="mt-2 text-xs text-ink-300">
            Belum ada data moda di titik ini.
          </p>
        ) : (
          <div className="mt-2 space-y-1.5">
            {station.estimates.map((e) => {
              const mode = MODE_CONFIG[
                e.mode
              ] ?? { label: e.mode, icon: '🚏' };
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-1 font-medium text-ink-900">
                    <span>{mode.icon}</span>{' '}
                    {mode.label}
                  </span>
                  <span
                    className={
                      e.isSurveyed
                        ? 'font-semibold text-brand-600'
                        : 'text-ink-300'
                    }
                  >
                    {e.isSurveyed
                      ? (e.fixedTimeLabel ??
                        `${e.minMinutes}–${e.maxMinutes} mnt`)
                      : 'Belum tersurvei'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-card border border-line-strong bg-card p-3">
      <div className="text-sm font-semibold text-ink-900">
        {from.name} → {to.name}
      </div>

      {sharedTrains.length > 0 && (
        <div className="rounded-sm2 bg-ok-bg px-2 py-1.5 text-xs text-ok">
          🚆 {sharedTrains.join(', ')} tercatat
          berhenti di kedua titik ini —
          kemungkinan besar bisa naik langsung
          tanpa ganti kereta.
        </div>
      )}

      {renderStationLegs(from, 'Titik Asal')}
      {renderStationLegs(to, 'Titik Tujuan')}

      <p className="text-[11px] leading-relaxed text-ink-300">
        Info tarif, nomor kendaraan, gerbong, dan
        aksesibilitas belum tersedia di data kami
        — akan ditambahkan setelah survei lapangan
        lebih lanjut.
      </p>
    </div>
  );
}
