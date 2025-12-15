import { DEFAULT_CAMERA_SETTINGS } from "@/constants/defaultCameraSettings";
import type { Settings } from "@/types/Settings";
import type { Camera } from "@/types/Camera";

import { computePolygon } from "@/services/computePolygon";

export const createCamera = async (
  name: string,
  lat: number,
  lng: number,
  customSettings?: Partial<Settings>,
): Promise<Camera> => {
  const settings: Settings = { ...DEFAULT_CAMERA_SETTINGS, ...customSettings };
  const polygon = await computePolygon(lat, lng, settings);

  const camera: Camera = {
    id: `camera-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    lat,
    lng,
    settings,
    polygon,
  };

  return camera;
};
