import { DishubDashboard } from '@/components/dishub/DishubDashboard';

const CORRIDOR_SLUG = 'maros-pangkep-barru';

export default function DishubDashboardPage() {
  return (
    <DishubDashboard
      corridorSlug={CORRIDOR_SLUG}
    />
  );
}
