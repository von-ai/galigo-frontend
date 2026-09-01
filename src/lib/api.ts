// src/lib/api.ts
import type {
  Station,
  StationDetail,
  Poi,
  ChatResponse,
  AuthUser,
  InsightsStats,
  AiSummary,
  RouteLine,
  StationSummary,
} from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // selalu kirim cookie auth Dishub
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res
      .json()
      .catch(() => ({}));
    throw new ApiError(
      body.message ??
        `Request gagal (${res.status})`,
      res.status,
    );
  }

  // Beberapa endpoint (mis. logout) tidak selalu balikin body JSON penuh.
  return res.status === 204
    ? (undefined as T)
    : res.json();
}

export const api = {
  // Publik
  stations: () => request<Station[]>('/stations'),
  station: (slug: string) =>
    request<StationDetail>(`/stations/${slug}`),
  poi: (category?: string) =>
    request<Poi[]>(
      `/poi${category ? `?category=${category}` : ''}`,
    ),
  chat: (message: string, stationSlug?: string) =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        stationSlug,
      }),
    }),

  // Auth
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<{ ok: true }>('/auth/logout', {
      method: 'POST',
    }),

  // Dishub (guarded)
  insightsStats: () =>
    request<InsightsStats>('/insights/stats'),
  insightsSummary: (corridorSlug: string) =>
    request<AiSummary>(
      `/insights/summary/${corridorSlug}`,
    ),
  regenerateSummary: (corridorSlug: string) =>
    request<AiSummary>(
      `/insights/summary/${corridorSlug}/regenerate`,
      { method: 'POST' },
    ),

  // src/lib/api.ts — tambahkan import type RouteLine, StationSummary di baris atas,
  // lalu tambahkan dua method ini ke dalam object `api`:

  routes: (mode?: string) =>
    request<RouteLine[]>(
      `/routes${mode ? `?mode=${mode}` : ''}`,
    ),
  stationsSummary: () =>
    request<StationSummary>('/stations/summary'),
};

export { ApiError };
