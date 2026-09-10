import { redirect } from 'next/navigation';
import { serverFetch } from '@/lib/server-api';

export default async function DishubProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await serverFetch('/auth/me');
  if (!session) redirect('/dishub/login');

  return (
    <div className="min-h-screen bg-dash-page text-dash-ink">
      {children}
    </div>
  );
}
