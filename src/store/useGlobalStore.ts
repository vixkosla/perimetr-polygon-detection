import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Settings } from "../types/Settings";
import type { Camera } from "../types/Camera";
import type { MapRef } from "react-map-gl/mapbox";

import { createCamera } from "../services/createCamera";

interface GlobalStore {
  mapRef: MapRef | null;
  setMapRef: (ref: MapRef | null) => void;
  getMap: () => mapboxgl.Map | null;

  selectedCameraId: string | null;
  hoveredCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;
  setHoveredCameraId: (id: string | null) => void;

  cameraes: Camera[];
  addCamera: (
    name: string,
    lat: number,
    lng: number,
    customSettings?: Partial<Settings>,
  ) => Promise<void>;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      mapRef: null,
      setMapRef: (ref) => set({ mapRef: ref }),
      getMap: () => get().mapRef?.getMap() ?? null,

      selectedCameraId: null,
      hoveredCameraId: null,
      setSelectedCameraId: (id) => set({ selectedCameraId: id }),
      setHoveredCameraId: (id) => set({ hoveredCameraId: id }),

      cameraes: [],

      addCamera: async (name, lat, lng, customSettings) => {
        const camera = await createCamera(name, lat, lng, customSettings);
        set((state) => ({
          cameraes: [...state.cameraes, camera],
        }));
      },

      clearcameraes: () =>
        set({ cameraes: [], selectedCameraId: null, hoveredCameraId: null }),
    }),
    {
      name: "camera-storage", // ключ в localStorage
      partialize: (state) => ({
        cameraes: state.cameraes, // сохраняем только камеры
      }),
    },
  ),
);
