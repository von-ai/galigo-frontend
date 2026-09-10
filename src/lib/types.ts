// src/lib/types.ts
// Bentuk data ini mengikuti response asli dari galigo-backend —
// kalau backend berubah, sesuaikan di sini dulu, TypeScript akan
// menandai semua tempat pemakaian yang ikut perlu diubah.

export type GeoJSONPoint = {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
};

export type Poi = {
  id: string;
  name: string;
  category:
    | 'makan'
    | 'musholla'
    | 'atm'
    | 'toilet'
    | 'umkm'
    | 'wisata'
    | 'pendidikan'
    | 'kesehatan'
    | 'pemerintahan'
    | 'industri'
    | 'ruang_publik'
    | 'transportasi';
  stationId: string | null;
  address: string | null;
  description: string | null;
  photoUrl: string | null;
  dataSource: 'mapid' | 'manual';
  geometry: GeoJSONPoint;
};

export type NearbyPoi = Pick<
  Poi,
  | 'id'
  | 'name'
  | 'category'
  | 'address'
  | 'description'
  | 'photoUrl'
  | 'geometry'
> & {
  distance_m: number;
};

export type TransportEstimate = {
  id: string;
  mode: 'kereta' | 'bus' | 'pete_pete';
  timeBucket:
    | 'pagi'
    | 'siang'
    | 'sore'
    | 'malam'
    | 'tetap';
  minMinutes: number | null;
  maxMinutes: number | null;
  fixedTimeLabel: string | null;
  isSurveyed: boolean;
  sourceLabel: string;
};

export type ChatSource = {
  type: 'station' | 'poi';
  label: string;
  id: string;
};
export type ChatResponse = {
  reply: string;
  sources: ChatSource[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type InsightsStats = {
  stationCount: number;
  poiCount: number;
  unsurveyedCount: number;
};

export type AiSummary = {
  id: string;
  corridorId: string;
  content: string;
  model: string;
  dataSnapshotLabel: string;
  createdAt: string;
} | null;

// Pisahkan field yang beda antara list (Station) dan detail (StationDetail) —
// backend mengembalikan bentuk yang berbeda untuk keduanya.

// src/lib/types.ts — ganti definisi Station & StationDetail yang lama dengan ini,
// sisanya (GeoJSONPoint, Poi, NearbyPoi, TransportEstimate, dll) tetap sama.

export type StationBase = {
  id: string;
  name: string;
  slug: string;
  order: number;
  geometry: GeoJSONPoint;
};

export type Station = StationBase & {
  poi_count: number;
  surveyed_estimate_count: number;
};

export type StationDetail = StationBase & {
  nearbyPois: NearbyPoi[];
  estimates: TransportEstimate[];
  kawasanPois: KawasanPoi[];
};

export type RouteLine = {
  id: string;
  name: string;
  mode: 'kereta' | 'bus' | 'pete_pete';
  stationId: string | null;
  dataSource: 'mapid' | 'manual';
  geometry:
    | {
        type: 'LineString';
        coordinates: [number, number][];
      }
    | {
        type: 'MultiLineString';
        coordinates: [number, number][][];
      };
};

export type StationSummary = {
  stationCount: number;
  peteRouteCount: number;
  poiCount: number;
};

export type KawasanPoi = {
  id: string;
  name: string;
  category: string;
  address: string | null;
};
