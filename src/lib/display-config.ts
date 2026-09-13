export const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: string; badge: string }
> = {
  makan: {
    label: 'Makan',
    icon: '🍜',
    badge: 'bg-warn-bg text-warn',
  },
  musholla: {
    label: 'Musholla',
    icon: '🕌',
    badge: 'bg-ok-bg text-ok',
  },
  atm: {
    label: 'ATM',
    icon: '🏧',
    badge: 'bg-info-bg text-info',
  },
  toilet: {
    label: 'Toilet',
    icon: '🚻',
    badge: 'bg-soft text-ink-500',
  },
  umkm: {
    label: 'UMKM',
    icon: '🏪',
    badge: 'bg-magenta-100 text-magenta-600',
  },
  wisata: {
    label: 'Wisata',
    icon: '🏖️',
    badge: 'bg-magenta-100 text-magenta-600',
  },
  pendidikan: {
    label: 'Pendidikan',
    icon: '🎓',
    badge: 'bg-brand-100 text-brand-600',
  },
  kesehatan: {
    label: 'Kesehatan',
    icon: '🏥',
    badge: 'bg-bad-bg text-bad',
  },
  pemerintahan: {
    label: 'Pemerintahan',
    icon: '🏛️',
    badge: 'bg-brand-100 text-brand-600',
  },
  industri: {
    label: 'Industri',
    icon: '🏭',
    badge: 'bg-soft text-ink-500',
  },
  ruang_publik: {
    label: 'Ruang Publik',
    icon: '🌳',
    badge: 'bg-ok-bg text-ok',
  },
  transportasi: {
    label: 'Transportasi',
    icon: '🚌',
    badge: 'bg-info-bg text-info',
  },
};

export const MODE_CONFIG: Record<
  string,
  {
    label: string;
    icon: string;
    border: string;
    bg: string;
  }
> = {
  kereta: {
    label: 'Kereta',
    icon: '🚆',
    border: 'border-kereta',
    bg: 'bg-kereta/10',
  },
  bus: {
    label: 'Bus',
    icon: '🚌',
    border: 'border-bus',
    bg: 'bg-bus/10',
  },
  pete_pete: {
    label: 'Pete-Pete',
    icon: '🚐',
    border: 'border-pete',
    bg: 'bg-pete/10',
  },
};

export function getCategoryConfig(
  category: string,
) {
  return (
    CATEGORY_CONFIG[category] ?? {
      label: category,
      icon: '📍',
      badge: 'bg-soft text-ink-500',
    }
  );
}
