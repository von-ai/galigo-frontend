// src/app/dishub/(protected)/page.tsx
import { serverFetch } from '@/lib/server-api';
import { DishubDashboard } from '@/components/dishub/DishubDashboard';
import type {
  InsightsStats,
  AiSummary,
} from '@/lib/types';

const CORRIDOR_SLUG = 'maros-pangkep-barru';

export default async function DishubDashboardPage() {
  const [stats, summary] = await Promise.all([
    serverFetch<InsightsStats>('/insights/stats'),
    serverFetch<AiSummary>(
      `/insights/summary/${CORRIDOR_SLUG}`,
    ),
  ]);

  return (
    <DishubDashboard
      corridorSlug={CORRIDOR_SLUG}
      initialStats={stats}
      initialSummary={summary}
    />
  );
}
