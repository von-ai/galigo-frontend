'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import type { ChatSource } from '@/lib/types';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
};

export default function TanyaGaligoPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
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

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setSending(true);

    try {
      const res = await api.chat(text);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply, sources: res.sources },
      ]);
    } catch (err) {
      const errMsg = err instanceof ApiError && err.status === 429
        ? 'Terlalu banyak pertanyaan, tunggu beberapa menit lagi ya.'
        : 'Gagal mengirim pesan. Coba lagi sebentar.';
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errMsg },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSourceClick(source: ChatSource) {
    if (source.type === 'station') {
      router.push(`/dashboard?station=${source.id}`);
    }
  }

  return (
    <div className="flex h-full flex-col bg-page absolute inset-0 z-50 pb-[64px]">
      {/* ── Header ── */}
      <div className="bg-grad-header px-5 py-4 text-white shadow-2">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-magenta-500 font-bold shadow-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#5b2d8e] bg-ok"></div>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Galigo AI</h1>
              <p className="text-[10px] text-white/80">Asisten Transportasi · Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat Stream ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 mb-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="text-sm font-medium text-ink-900">Halo! Saya Galigo AI.</p>
            <p className="text-xs text-ink-500 max-w-[200px] mt-1">Tanya apa saja seputar rute, jadwal, atau transportasi di Sulsel.</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-1 ${m.role === 'user' ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-white text-ink-900 rounded-bl-sm border border-line'}`}>
                <p className="leading-relaxed">{m.content}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-line">
                    {m.sources.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSourceClick(s)}
                        disabled={s.type !== 'station'}
                        className="rounded-pill bg-soft px-3 py-1 text-[11px] font-medium text-brand-600 disabled:opacity-60 flex items-center gap-1"
                      >
                        <span className="text-[10px]">📍</span> {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border border-line rounded-2xl rounded-bl-sm px-4 py-3 text-sm shadow-1 flex items-center gap-1.5 text-ink-500">
              <div className="h-1.5 w-1.5 bg-ink-300 rounded-full animate-bounce"></div>
              <div className="h-1.5 w-1.5 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-1.5 w-1.5 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* ── Input Area ── */}
      <div className="bg-white px-4 py-3 border-t border-line shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanya rute atau info transportasi..."
            className="flex-1 rounded-pill border border-line-strong bg-soft px-4 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:bg-white focus:outline-none transition"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-2 disabled:opacity-40 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
