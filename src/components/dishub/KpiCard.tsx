export function KpiCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-card border border-dash-line bg-dash-card p-4">
      <div className="text-2xl font-bold text-dash-ink">
        {value}
      </div>
      <div className="mt-1 text-xs text-dash-ink-2">
        {label}
      </div>
    </div>
  );
}
