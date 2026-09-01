// src/components/map/MapHeader.tsx
export function MapHeader() {
  return (
    <div className="absolute inset-x-0 top-0 z-1000 bg-grad-header px-5 pb-4 pt-5 text-white shadow-2">
      <h1 className="text-xl font-bold">
        GALIGO
      </h1>
      <p className="text-sm text-white/80">
        Maros – Pangkep – Barru
      </p>
    </div>
  );
}
