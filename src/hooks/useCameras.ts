import type { Camera } from "@/types/Camera";
import type { Settings } from "@/types/Settings";

import { useCallback, useState } from "react";

import { createCamera } from "@/services/createCamera";

export const useCameras = () => {
  const [cameraes, setCameras] = useState<Camera[]>([]);

  const addCamera = useCallback(
    async (
      name: string,
      lat: number,
      lng: number,
      customSettings?: Partial<Settings>,
    ) => {
      const camera = await createCamera(name, lat, lng, customSettings);

      setCameras((prev) => [...prev, camera]);
    },
    [],
  );

  return { cameraes, addCamera };
};
