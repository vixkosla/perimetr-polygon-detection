import type { Settings } from "@/types/Settings.ts";

import { useGlobalStore } from "@/store/useGlobalStore";

import { destinationPoint } from "@/services/destinationPoint";

export const computePolygon = async (
  lat: number,
  lon: number,
  settings: Settings,
): Promise<number[][]> => {
  const map = useGlobalStore.getState().getMap(); // используй геттер

  if (!map) return [];

  const { hfov, azStep, dStep, maxRange, cameraHeight, heading } = settings;

  const originElev = map.queryTerrainElevation([lon, lat]) ?? 0;
  const originHeight = originElev + cameraHeight;

  const halfHF = hfov / 2;
  const points: number[][] = [];

  for (let az = heading - halfHF; az <= heading + halfHF; az += azStep) {
    let maxSeenAngle = -Infinity;
    let lastVisible = null;

    for (let d = dStep; d <= maxRange; d += dStep) {
      const pt = destinationPoint(lat, lon, d, az);
      const elev = map.queryTerrainElevation([pt.lon, pt.lat]);

      if (elev == null) break;

      const angle = Math.atan2(elev - originHeight, d);
      if (angle > maxSeenAngle) {
        maxSeenAngle = angle;
        lastVisible = [pt.lon, pt.lat];
      }
    }

    if (lastVisible) points.push(lastVisible);
  }

  return points;
};
