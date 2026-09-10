// src/app/dishub/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

export default function DishubLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(email, password);
      router.push('/dishub');
      router.refresh(); // penting: layout server component perlu baca ulang cookie yang baru di-set
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 401
      ) {
        setError('Email atau password salah.');
      } else {
        setError(
          'Gagal terhubung ke server. Coba lagi.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dash-page px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-dash-line bg-dash-card p-6 shadow-3"
      >
        <h1 className="text-xl font-semibold text-dash-ink">
          GALIGO — Ruang Dishub
        </h1>
        <p className="mt-1 text-sm text-dash-ink-2">
          Khusus untuk tim Dinas Perhubungan.
        </p>

        <label className="mb-1.5 mt-5 block text-xs font-semibold text-dash-ink-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          className="w-full rounded-xl border border-dash-line bg-dash-card-2 px-4 py-3 text-sm text-dash-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />

        <label className="mb-1.5 mt-4 block text-xs font-semibold text-dash-ink-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          className="w-full rounded-xl border border-dash-line bg-dash-card-2 px-4 py-3 text-sm text-dash-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />

        {error && (
          <p className="mt-3 text-sm text-bad">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-pill bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          {loading ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
