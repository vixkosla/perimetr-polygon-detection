import { useState, useCallback } from "react";
import { DEFAULT_CAMERA_SETTINGS } from "@/constants/defaultCameraSettings";

import type { CameraData } from "@/types/CameraData";
import type { Settings } from "@/types/Settings";
import type { Camera } from "@/types/Camera";

export const usePreview = () => {
  const [data, setData] = useState<CameraData | null>(null);
  const [editingCameraId, setEditingCameraId] = useState<string | null>(null);

  const initData = useCallback((lat: number, lng: number) => {
    setEditingCameraId(null);
    setData({
      name: "",
      lat,
      lng,
      settings: {
        ...DEFAULT_CAMERA_SETTINGS,
      },
    });
  }, []);

  const loadCameraData = useCallback((camera: Camera) => {
    setEditingCameraId(camera.id);
    setData({
      name: camera.name,
      lat: camera.lat,
      lng: camera.lng,
      settings: { ...camera.settings },
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
    setEditingCameraId(null);
  }, []);

  return {
    data,
    editingCameraId,
    initData,
    loadCameraData,
    updateName,
    updateSettings,
    clearData,
  };
};
