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
const TOKEN_KEY = 'galigo_token';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token: string) {
  if (typeof window !== 'undefined')
    localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  if (typeof window !== 'undefined')
    localStorage.removeItem(TOKEN_KEY);
}

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
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
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
  return res.status === 204
    ? (undefined as T)
    : res.json();
}

export const api = {
  stations: () => request<Station[]>('/stations'),
  station: (slug: string) =>
    request<StationDetail>(`/stations/${slug}`),
  poi: (category?: string) =>
    request<Poi[]>(
      `/poi${category ? `?category=${category}` : ''}`,
    ),
  routes: (mode?: string) =>
    request<RouteLine[]>(
      `/routes${mode ? `?mode=${mode}` : ''}`,
    ),
  stationsSummary: () =>
    request<StationSummary>('/stations/summary'),
  chat: (
    message: string,
    stationSlug?: string,
    fromSlug?: string,
    toSlug?: string,
  ) =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        stationSlug,
        fromSlug,
        toSlug,
      }),
    }),

  login: async (
    email: string,
    password: string,
  ) => {
    const data = await request<{
      token: string;
      user: AuthUser;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },
  logout: async () => {
    clearToken();
    return { ok: true };
  },
  me: () =>
    request<{ userId: string; email: string }>(
      '/auth/me',
    ),

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
};

export { ApiError };
