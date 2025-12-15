import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Settings } from "@/types/Settings";
import type { Camera } from "@/types/Camera";
import type { MapRef } from "react-map-gl/mapbox";

import { createCamera } from "@/services/createCamera";
import { computePolygon } from "@/services/computePolygon";

interface GlobalStore {
  mapRef: MapRef | null;
  setMapRef: (ref: MapRef | null) => void;
  getMap: () => mapboxgl.Map | null;

  selectedCameraId: string | null;
  hoveredCameraId: string | null;
  editingCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;
  setHoveredCameraId: (id: string | null) => void;
  setEditingCameraId: (id: string | null) => void;

  rotateCamera: (id: string, angleDelta: number) => Promise<void>;
  removeCamera: (id: string) => void;

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
      editingCameraId: null,
      setSelectedCameraId: (id) => set({ selectedCameraId: id }),
      setHoveredCameraId: (id) => set({ hoveredCameraId: id }),
      setEditingCameraId: (id) => set({ editingCameraId: id }),

      cameraes: [],

      addCamera: async (name, lat, lng, customSettings) => {
        const camera = await createCamera(name, lat, lng, customSettings);
        set((state) => ({
          cameraes: [...state.cameraes, camera],
        }));
      },

      rotateCamera: async (id, angleDelta) => {
        const camera = get().cameraes.find((c) => c.id === id);
        if (!camera) return Promise.resolve();

        const heading = (camera.settings.heading + angleDelta + 360) % 360;
        const settings = {
          ...camera.settings,
          heading,
        };

        const polygon = await computePolygon(camera.lat, camera.lng, settings);

        const newCamera: Camera = {
          ...camera, // все старые поля (id, name, lat, lng)
          settings, // новые settings с обновлённым heading
          polygon, // новый пересчитанный polygon
        };

        set((state) => ({
          cameraes: state.cameraes.map((c) => (c.id === id ? newCamera : c)),
        }));
      },

      removeCamera: (id) => {
        set((state) => ({
          cameraes: state.cameraes.filter((c) => c.id !== id),
          // Сбрасываем ID если удаляем активную камеру
          selectedCameraId:
            state.selectedCameraId === id ? null : state.selectedCameraId,
          hoveredCameraId:
            state.hoveredCameraId === id ? null : state.hoveredCameraId,
          editingCameraId:
            state.editingCameraId === id ? null : state.editingCameraId,
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
