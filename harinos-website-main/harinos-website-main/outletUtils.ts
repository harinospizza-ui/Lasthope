import { CustomerLocation, OutletConfig } from './types';

export interface OutletMatch {
  outlet: OutletConfig;
  distanceKm: number;
}

interface RoadDistanceApiResponse {
  code?: string;
  routes?: Array<{
    distance: number;
  }>;
}

const ROAD_DISTANCE_API_URL = (
  import.meta.env.VITE_ROAD_DISTANCE_API_URL || 'https://router.project-osrm.org'
).replace(/\/$/, '');

/**
 * Generates direct Google Maps navigation / pin URL for the customer's coordinates.
 */
export const buildCustomerMapUrl = (latitude: number, longitude: number): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

export const sanitizePhoneNumber = (phone: string): string => phone.replace(/\D/g, '');

/**
 * Calculates straight-line (Haversine) distance between two GPS coordinates in kilometers.
 */
export const calculateHaversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates road distance in KM using OSRM with automatic Haversine winding factor fallback.
 * Guarantees that users are never blocked by external routing server timeouts or rate limits.
 */
export const getRoadDistanceKm = async (
  customerLocation: CustomerLocation,
  outlet: OutletConfig,
): Promise<number> => {
  const straightLineKm = calculateHaversineDistanceKm(
    customerLocation.latitude,
    customerLocation.longitude,
    outlet.latitude,
    outlet.longitude,
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const requestUrl =
      `${ROAD_DISTANCE_API_URL}/route/v1/driving/` +
      `${customerLocation.longitude},${customerLocation.latitude};${outlet.longitude},${outlet.latitude}` +
      '?overview=false&alternatives=false&steps=false';

    const response = await fetch(requestUrl, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as RoadDistanceApiResponse;
      const route = data.routes?.[0];
      if (data.code === 'Ok' && route && typeof route.distance === 'number') {
        return Math.round((route.distance / 1000) * 10) / 10;
      }
    }
  } catch (err) {
    console.warn('OSRM routing fetch failed or timed out, falling back to estimated road distance:', err);
  }

  // Fallback: Driving road distance is approximately 1.22x straight-line distance in town roads
  const estimatedRoadKm = Math.round(straightLineKm * 1.22 * 10) / 10;
  return estimatedRoadKm;
};

export const findNearestOutletByRoadDistance = async (
  customerLocation: CustomerLocation,
  outlets: OutletConfig[],
): Promise<OutletMatch | null> => {
  const activeOutlets = outlets.filter((outlet) => outlet.enabled);
  if (!activeOutlets.length) {
    return null;
  }

  const outletMatches = await Promise.all(
    activeOutlets.map(async (outlet) => ({
      outlet,
      distanceKm: await getRoadDistanceKm(customerLocation, outlet),
    })),
  );

  if (!outletMatches.length) {
    return null;
  }

  return outletMatches.reduce<OutletMatch>((closestOutlet, outletMatch) => {
    if (outletMatch.distanceKm < closestOutlet.distanceKm) {
      return outletMatch;
    }

    return closestOutlet;
  }, outletMatches[0]);
};
