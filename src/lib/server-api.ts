import { cookies } from 'next/headers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3001';

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      cookie: cookieHeader,
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}
