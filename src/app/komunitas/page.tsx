'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Report {
  id: string;
  category: 'pete_pete' | 'macet' | 'rute' | 'fasilitas';
  categoryLabel: string;
  author: string;
  timeAgo: string;
  location: string;
  text: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    category: 'pete_pete',
    categoryLabel: 'Pete-pete',
    author: 'Daeng Rauf',
    timeAgo: '15 menit lalu',
    location: 'Halte Pasar Sentral Barru',
    text: 'Pete-pete C3 tidak lewat halte Pasar Sentral karena ada pasar tumpah pagi ini. Diarahkan lewat Jl. Poros Lama.',
    upvotes: 14,
  },
  {
    id: '2',
    category: 'rute',
    categoryLabel: 'Kereta & Feeder',
    author: 'Nurfadilah',
    timeAgo: '35 menit lalu',
    location: 'Stasiun Pangkep',
    text: 'Feeder pete-pete jalur B2 sudah stand-by di depan gerbang peron kedatangan kereta. Tarif tetap Rp 7.000.',
    upvotes: 29,
  },
  {
    id: '3',
    category: 'macet',
    categoryLabel: 'Kemacetan',
    author: 'Syamsul M.',
    timeAgo: '1 jam lalu',
    location: 'Jl. Poros Maros-Pangkep KM 42',
    text: 'Lalu lintas padat merayap arah Barru karena ada perbaikan gorong-gorong jembatan. Estimasi perlambatan 15 menit.',
    upvotes: 8,
  },
  {
    id: '4',
    category: 'fasilitas',
    categoryLabel: 'Fasilitas Halte',
    author: 'Andi Tenri',
    timeAgo: '3 jam lalu',
    location: 'Halte Cempae',
    text: 'Lampu penerangan halte dan papan jadwal QR code sudah diperbaiki Dishub. Nyaman untuk transit malam hari.',
    upvotes: 19,
  },
];

export default function KomunitasPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<string>('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'pete_pete' | 'macet' | 'rute' | 'fasilitas'>('pete_pete');

  const tabs = [
    { id: 'semua', label: 'Semua Laporan' },
    { id: 'pete_pete', label: 'Pete-pete' },
    { id: 'macet', label: 'Kemacetan' },
    { id: 'rute', label: 'Perubahan Rute' },
    { id: 'fasilitas', label: 'Fasilitas' },
  ];

  const filteredReports = activeTab === 'semua'
    ? reports
    : reports.filter(r => r.category === activeTab);

  const handleUpvote = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        const hasUpvoted = !r.hasUpvoted;
        return {
          ...r,
          hasUpvoted,
          upvotes: hasUpvoted ? r.upvotes + 1 : r.upvotes - 1,
        };
      }
      return r;
    }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newLocation.trim()) return;

    const categoryLabelMap = {
      pete_pete: 'Pete-pete',
      macet: 'Kemacetan',
      rute: 'Perubahan Rute',
      fasilitas: 'Fasilitas',
    };

    const newEntry: Report = {
      id: Date.now().toString(),
      category: newCategory,
      categoryLabel: categoryLabelMap[newCategory],
      author: 'Anda (Warga)',
      timeAgo: 'Baru saja',
      location: newLocation,
      text: newText,
      upvotes: 1,
      hasUpvoted: true,
    };

    setReports([newEntry, ...reports]);
    setNewLocation('');
    setNewText('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {/* ── Top Header ── */}
      <div className="bg-grad-header px-5 pb-5 pt-6 text-white shadow-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
              aria-label="Kembali"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold">Community Map</h1>
              <p className="text-xs text-white/70">Laporan & info transit real-time warga</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-pill bg-[#F5BA31] px-3.5 py-1.5 text-xs font-bold text-[#3B1D6E] shadow-2 hover:brightness-105 active:scale-95 transition"
          >
            <span>+</span> Lapor
          </button>
        </div>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="border-b border-line bg-white px-5 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-pill px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-1'
                  : 'bg-card border border-line text-ink-700 hover:bg-soft'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Interactive Map Banner Card ── */}
      <div className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[16px] bg-white border border-line p-4 shadow-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#17B26A] animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#17B26A]">Peta Interaktif Warga</span>
              </div>
              <h2 className="mt-1 text-sm font-bold text-ink-900">4 Titik Pantau Aktif</h2>
              <p className="text-xs text-ink-500">Maros, Pangkep, dan Barru terhubung</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 rounded-pill bg-soft px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition"
            >
              Lihat Peta
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Reports Feed ── */}
      <div className="flex-1 px-5 pt-4 pb-20 overflow-y-auto">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink-900">Kabar Terkini ({filteredReports.length})</h2>
          <span className="text-[11px] text-ink-300">Terverifikasi Komunitas</span>
        </div>

        <div className="flex flex-col gap-3">
          {filteredReports.map(report => (
            <div
              key={report.id}
              className="rounded-[16px] bg-white p-4 border border-line shadow-1 hover:shadow-2 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {report.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-900 leading-tight">{report.author}</p>
                    <p className="text-[10px] text-ink-300">{report.timeAgo} · {report.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  report.category === 'pete_pete' ? 'bg-[#fff5eb] text-[#f2703f]' :
                  report.category === 'rute' ? 'bg-[#f0ebf8] text-brand-600' :
                  report.category === 'macet' ? 'bg-warn-bg text-warn' :
                  'bg-ok-bg text-ok'
                }`}>
                  {report.categoryLabel}
                </span>
              </div>

              <p className="text-xs text-ink-700 leading-relaxed">{report.text}</p>

              <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5">
                <button
                  onClick={() => handleUpvote(report.id)}
                  className={`flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold transition ${
                    report.hasUpvoted
                      ? 'bg-brand-600 text-white shadow-1'
                      : 'bg-page text-ink-500 hover:bg-soft'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 4L4 10H8V16H12V10H16L10 4Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Membantu ({report.upvotes})</span>
                </button>
                <span className="text-[10px] text-ink-300">Bagikan</span>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-10 text-ink-500 text-sm">
              Belum ada laporan untuk kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Lapor Baru ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[20px] bg-white p-5 shadow-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ink-900">Tambah Laporan Komunitas</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-soft text-ink-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-ink-700">Kategori Laporan</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-line bg-page px-3 py-2 text-xs text-ink-900 focus:border-brand-600 outline-none"
                >
                  <option value="pete_pete">Pete-pete (Kondisi/Trayek)</option>
                  <option value="rute">Perubahan Rute & Feeder</option>
                  <option value="macet">Kemacetan / Hambatan Jalan</option>
                  <option value="fasilitas">Fasilitas Halte / Peron</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-700">Lokasi / Halte</label>
                <input
                  type="text"
                  placeholder="Misal: Halte Minasatene, Stasiun Maros..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-page px-3 py-2 text-xs text-ink-900 focus:border-brand-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-700">Keterangan Kondisi</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan detail kondisi rute atau fasilitas..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-page px-3 py-2 text-xs text-ink-900 focus:border-brand-600 outline-none resize-none"
                  required
                />
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-pill border border-line py-2 text-xs font-semibold text-ink-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-pill bg-brand-600 py-2 text-xs font-semibold text-white shadow-2 hover:bg-brand-700"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
