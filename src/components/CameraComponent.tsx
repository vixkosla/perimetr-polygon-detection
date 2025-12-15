import type { Camera } from "@/types/Camera";
import { Source, Layer } from "react-map-gl/mapbox";
import { useGlobalStore } from "@/store/useGlobalStore.ts";

// ============================================================================
// КОНСТАНТЫ ВИЗУАЛЬНЫХ ЭФФЕКТОВ
// ============================================================================

// Размеры точки камеры
const CIRCLE_RADIUS = {
  SELECTED: 8,
  HOVERED: 6,
  DEFAULT: 5,
} as const;

// Цвета точки камеры
const CIRCLE_COLOR = {
  SELECTED: "#ff0000",
  HOVERED: "#ff4444",
  DEFAULT: "#ff6666",
} as const;

// Прозрачность точки
const CIRCLE_OPACITY = {
  SELECTED: 1,
  HOVERED: 1.0,
  DEFAULT: 0.9,
} as const;

// Обводка точки
const CIRCLE_STROKE = {
  WIDTH: {
    SELECTED: 3,
    HOVERED: 2,
    DEFAULT: 0,
  },
  COLOR: "#ffffff",
} as const;

// Цвета заливки полигона
const POLYGON_FILL_COLOR = {
  SELECTED: "#00ff00",
  HOVERED: "#44ff44",
  DEFAULT: "#88ff88",
} as const;

// Прозрачность полигона
const POLYGON_FILL_OPACITY = {
  SELECTED: 0.1,
  HOVERED: 0.8,
  DEFAULT: 0.5,
} as const;

// Обводка полигона (для выбранной камеры)
const POLYGON_OUTLINE = {
  COLOR: '#000000',
  WIDTH: 2,
  DASH_ARRAY: [2, 1],
};

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

export const CameraComponent = ({ camera }: { camera: Camera }) => {
  const selectedCameraId = useGlobalStore((state) => state.selectedCameraId);
  const hoveredCameraId = useGlobalStore((state) => state.hoveredCameraId);

  const isSelected = selectedCameraId === camera.id;
  const isHovered = hoveredCameraId === camera.id;

  // Вычисляем стили на основе состояния
  const circleRadius = isSelected
    ? CIRCLE_RADIUS.SELECTED
    : isHovered
      ? CIRCLE_RADIUS.HOVERED
      : CIRCLE_RADIUS.DEFAULT;

  const circleColor = isSelected
    ? CIRCLE_COLOR.SELECTED
    : isHovered
      ? CIRCLE_COLOR.HOVERED
      : CIRCLE_COLOR.DEFAULT;

  const circleOpacity = isSelected
    ? CIRCLE_OPACITY.SELECTED
    : isHovered
      ? CIRCLE_OPACITY.HOVERED
      : CIRCLE_OPACITY.DEFAULT;

  const circleStrokeWidth = isSelected
    ? CIRCLE_STROKE.WIDTH.SELECTED
    : isHovered
      ? CIRCLE_STROKE.WIDTH.HOVERED
      : CIRCLE_STROKE.WIDTH.DEFAULT;

  const fillColor = isSelected
    ? POLYGON_FILL_COLOR.SELECTED
    : isHovered
      ? POLYGON_FILL_COLOR.HOVERED
      : POLYGON_FILL_COLOR.DEFAULT;

  const fillOpacity = isSelected
    ? POLYGON_FILL_OPACITY.SELECTED
    : isHovered
      ? POLYGON_FILL_OPACITY.HOVERED
      : POLYGON_FILL_OPACITY.DEFAULT;

  return (
    <>
      {/* Точка камеры */}
      <Source
        id={`camera-source-${camera.id}`}
        type="geojson"
        data={{
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [camera.lng, camera.lat],
          },
          properties: {
            name: camera.name,
            id: camera.id,
          },
        }}
      >
        <Layer
          id={`camera-layer-${camera.id}`}
          type="circle"
          paint={{
            "circle-radius": circleRadius,
            "circle-color": circleColor,
            "circle-opacity": circleOpacity,
            "circle-stroke-width": circleStrokeWidth,
            "circle-stroke-color": CIRCLE_STROKE.COLOR,
          }}
        />
      </Source>

      {/* Полигон видимости */}
      {camera.polygon && camera.polygon.length > 0 && (
        <Source
          id={`polygon-source-${camera.id}`}
          type="geojson"
          data={{
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [camera.lng, camera.lat],
                  ...camera.polygon,
                  [camera.lng, camera.lat],
                ],
              ],
            },
            properties: { name: "Polygon", id: camera.id },
          }}
        >
          {/* Заливка полигона */}
          <Layer
            id={`polygon-fill-${camera.id}`}
            type="fill"
            paint={{
              "fill-color": fillColor,
              "fill-opacity": fillOpacity,
            }}
          />

          <Layer
            id={`polygon-line-${camera.id}`}
            type="line"
            paint={{
              "line-color": "#ffffff",
              "line-width": 4,
              "line-opacity": 0.5,
              // "line-dasharray": [10, 1],
            }}
          />

          {/* Пунктирная обводка для выбранной камеры */}
          {isSelected && (
            <Layer
              id={`polygon-outline-${camera.id}`}
              type="line"
              paint={{
                "line-color": POLYGON_OUTLINE.COLOR,
                "line-width": POLYGON_OUTLINE.WIDTH,
                "line-dasharray": POLYGON_OUTLINE.DASH_ARRAY,
              }}
            />
          )}
        </Source>
      )}
    </>
  );
};
