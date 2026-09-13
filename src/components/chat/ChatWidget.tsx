// src/components/chat/ChatWidget.tsx
'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { api, ApiError } from '@/lib/api';
import type {
  ChatSource,
  Station,
} from '@/lib/types';
import { TripPlanCard } from './TripPlanCard';

type ChatMessage =
  | {
      kind: 'text';
      role: 'user' | 'assistant';
      content: string;
      sources?: ChatSource[];
    }
  | {
      kind: 'trip-plan';
      fromSlug: string;
      toSlug: string;
    };

export function ChatWidget({
  stations,
  currentStationSlug,
  onSelectStation,
  isOpen,
  onOpenChange,
}: {
  stations: Station[];
  currentStationSlug: string | null;
  onSelectStation: (slug: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<
    ChatMessage[]
  >([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);
  const [fromSlug, setFromSlug] = useState('');
  const [toSlug, setToSlug] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, sending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [
      ...prev,
      {
        kind: 'text',
        role: 'user',
        content: text,
      },
    ]);
    setInput('');
    setError(null);
    setSending(true);

    try {
      const res = await api.chat(
        text,
        currentStationSlug ?? undefined,
      );
      setMessages((prev) => [
        ...prev,
        {
          kind: 'text',
          role: 'assistant',
          content: res.reply,
          sources: res.sources,
        },
      ]);
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 429
      ) {
        setError(
          'Terlalu banyak pertanyaan, tunggu beberapa menit lagi ya.',
        );
      } else {
        setError(
          'Gagal mengirim pesan. Coba lagi sebentar.',
        );
      }
    } finally {
      setSending(false);
    }
  }

  function handleFindRoute() {
    if (!fromSlug || !toSlug) return;
    const fromName =
      stations.find((s) => s.slug === fromSlug)
        ?.name ?? fromSlug;
    const toName =
      stations.find((s) => s.slug === toSlug)
        ?.name ?? toSlug;

    // Pure data lookup — TIDAK lewat Gemini. Lebih cepat, gratis, dan
    // tidak kena rate limit chat.
    setMessages((prev) => [
      ...prev,
      {
        kind: 'text',
        role: 'user',
        content: `Bagaimana cara dari ${fromName} ke ${toName}?`,
      },
      { kind: 'trip-plan', fromSlug, toSlug },
    ]);
  }

  function handleSourceClick(source: ChatSource) {
    if (source.type !== 'station') return;
    const station = stations.find(
      (s) => s.id === source.id,
    );
    if (station) onSelectStation(station.slug);
  }

  return (
    <>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="absolute bottom-20 right-4 z-1000 flex h-12 w-12 items-center justify-center rounded-pill bg-grad-brand text-lg text-white shadow-3"
        aria-label={
          isOpen
            ? 'Tutup Tanya GALIGO'
            : 'Buka Tanya GALIGO'
        }
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="absolute bottom-36 right-4 z-1000 flex h-[min(32rem,75vh)] w-88 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-card border border-line bg-card shadow-3">
          <div className="bg-grad-brand px-4 py-3 text-white">
            <div className="text-sm font-semibold">
              Tanya GALIGO
            </div>
            <div className="text-xs text-white/80">
              {currentStationSlug
                ? 'Bertanya seputar titik yang sedang dipilih'
                : 'Pilih titik di peta untuk jawaban lebih akurat'}
            </div>
          </div>

          <div className="border-b border-line p-2">
            <div className="flex gap-2">
              <select
                value={fromSlug}
                onChange={(e) =>
                  setFromSlug(e.target.value)
                }
                className="flex-1 rounded-sm2 border border-line-strong px-2 py-1.5 text-xs"
              >
                <option value="">Dari…</option>
                {stations.map((s) => (
                  <option
                    key={s.slug}
                    value={s.slug}
                  >
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                value={toSlug}
                onChange={(e) =>
                  setToSlug(e.target.value)
                }
                className="flex-1 rounded-sm2 border border-line-strong px-2 py-1.5 text-xs"
              >
                <option value="">Ke…</option>
                {stations.map((s) => (
                  <option
                    key={s.slug}
                    value={s.slug}
                  >
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleFindRoute}
              disabled={!fromSlug || !toSlug}
              className="mt-2 w-full rounded-pill bg-brand-600 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              Cari rute
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto p-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-ink-500">
                Tanya soal jadwal, moda, atau
                tempat di sekitar stasiun.
              </p>
            )}
            {messages.map((m, i) => {
              if (m.kind === 'trip-plan') {
                return (
                  <TripPlanCard
                    key={i}
                    fromSlug={m.fromSlug}
                    toSlug={m.toSlug}
                  />
                );
              }
              return (
                <div
                  key={i}
                  className={
                    m.role === 'user'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }
                >
                  <div
                    className={`max-w-[85%] rounded-sm2 px-3 py-2 text-sm ${
                      m.role === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-soft text-ink-900'
                    }`}
                  >
                    <p>{m.content}</p>
                    {m.sources &&
                      m.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.sources.map((s) => (
                            <button
                              key={s.id}
                              onClick={() =>
                                handleSourceClick(
                                  s,
                                )
                              }
                              disabled={
                                s.type !==
                                'station'
                              }
                              className="rounded-pill border border-line-strong bg-card px-2 py-0.5 text-xs text-ink-700 disabled:opacity-60"
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
            {sending && (
              <div className="text-xs text-ink-300">
                Mengetik…
              </div>
            )}
            {error && (
              <div className="text-xs text-bad">
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-line p-2">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === 'Enter' && handleSend()
              }
              placeholder="Tanya rute atau kondisi halte…"
              className="flex-1 rounded-pill border border-line-strong px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="rounded-pill bg-brand-600 px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  );
}
