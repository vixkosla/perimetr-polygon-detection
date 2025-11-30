import { useState, useCallback } from "react";
import { DEFAULT_CAMERA_SETTINGS } from "../constants/defaultCameraSettings";

import type { CameraData } from "../types/CameraData";
import type { Settings } from "../types/Settings";

export const usePreview = () => {
  const [data, setData] = useState<CameraData | null>(null);

  const initData = useCallback((lat: number, lng: number) => {
    setData({
      name: "",
      lat,
      lng,
      settings: {
        ...DEFAULT_CAMERA_SETTINGS,
      },
    });
  }, []);

  const updateName = useCallback((name: string) => {
    setData((prev) => (prev ? { ...prev, name } : null));
  }, []);

  const updateSettings = useCallback((settings: Partial<Settings>) => {
    setData((prev) =>
      prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null,
    );
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return { data, initData, updateName, updateSettings, clearData };
};
