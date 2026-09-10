// src/components/dishub/SummaryCard.tsx
'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { AiSummary } from '@/lib/types';

export function SummaryCard({
  corridorSlug,
  initialSummary,
}: {
  corridorSlug: string;
  initialSummary: AiSummary;
}) {
  const [summary, setSummary] =
    useState<AiSummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  async function handleRegenerate() {
    setLoading(true);
    setError(null);
    try {
      const fresh =
        await api.regenerateSummary(corridorSlug);
      setSummary(fresh);
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 409
      ) {
        setError(err.message); // pesan cooldown asli dari backend, sudah cukup jelas
      } else {
        setError(
          'Gagal membuat ringkasan baru. Coba lagi sebentar.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 rounded-card border border-dash-line bg-dash-card p-5">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold text-dash-ink">
          Ringkasan AI
        </h2>
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="rounded-pill border border-brand-500 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-500/10 disabled:opacity-40"
        >
          {loading ? 'Membuat…' : 'Regenerate'}
        </button>
      </div>

      {summary ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-dash-ink">
            {summary.content}
          </p>
          <p className="mt-3 text-xs text-dash-ink-2">
            Diperbarui{' '}
            {new Date(
              summary.createdAt,
            ).toLocaleString('id-ID')}{' '}
            · {summary.model} ·{' '}
            {summary.dataSnapshotLabel}
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-dash-ink-2">
          Belum ada ringkasan. Klik Regenerate
          untuk membuat.
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-bad">
          {error}
        </p>
      )}
    </div>
  );
}
