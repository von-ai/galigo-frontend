// src/components/map/LayerFilterChips.tsx
'use client';

export type LayerKey =
  | 'kereta'
  | 'bus'
  | 'pete_pete'
  | 'halte'
  | 'stasiun';

const CHIPS: {
  key: LayerKey;
  label: string;
  dotClass: string;
}[] = [
  {
    key: 'kereta',
    label: 'Kereta',
    dotClass: 'bg-kereta',
  },
  {
    key: 'bus',
    label: 'Bus',
    dotClass: 'bg-bus',
  },
  {
    key: 'pete_pete',
    label: 'Pete-Pete',
    dotClass: 'bg-pete',
  },
  {
    key: 'halte',
    label: 'Halte',
    dotClass: 'bg-ink-300',
  },
  {
    key: 'stasiun',
    label: 'Stasiun',
    dotClass: 'bg-ink-900',
  },
];

export function LayerFilterChips({
  active,
  onToggle,
}: {
  active: Set<LayerKey>;
  onToggle: (key: LayerKey) => void;
}) {
  return (
    <div className="absolute left-4 right-4 top-24 z-1000 flex flex-wrap gap-2">
      {CHIPS.map((chip) => {
        const isActive = active.has(chip.key);
        return (
          <button
            key={chip.key}
            onClick={() => onToggle(chip.key)}
            className={`flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs font-medium shadow-1 transition ${
              isActive
                ? 'border-line bg-card text-ink-900'
                : 'border-line bg-card/60 text-ink-300'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${chip.dotClass}`}
            />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
