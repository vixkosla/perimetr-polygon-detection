import type { Camera } from "../types/Camera";

import { Source, Layer } from "react-map-gl/mapbox";

import { useGlobalStore } from "../store/useGlobalStore.ts";

export const CameraComponent = ({ camera }: { camera: Camera }) => {
  const selectedCameraId = useGlobalStore((state) => state.selectedCameraId);
  const hoveredCameraId = useGlobalStore((state) => state.hoveredCameraId);

  const isSelected = selectedCameraId === camera.id;
  const isHovered = hoveredCameraId === camera.id;

  const circleRadius = isSelected ? 8 : isHovered ? 6 : 5;
  const circleColor = isSelected
    ? "#ff0000"
    : isHovered
      ? "#ff4444"
      : "#ff6666";
  const circleOpacity = isSelected ? 1 : isHovered ? 0.9 : 0.5;
  const circleStrokeWidth = isSelected ? 3 : isHovered ? 2 : 0;
  const circleStrokeColor = "#ffffff";

  const fillColor = isSelected ? "#00ff00" : isHovered ? "#44ff44" : "#88ff88";
  const fillOpacity = isSelected ? 0.6 : isHovered ? 0.4 : 0.2;

  // Для выбранной камеры добавляем пунктирную обводку
  const lineColor = isSelected ? "#00ff00" : "transparent";
  const lineWidth = isSelected ? 2 : 0;
  const lineDasharray = isSelected ? [2, 2] : undefined;

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
            "circle-stroke-color": circleStrokeColor,
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
            properties: { name: "Polygon" },
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

          {/* Пунктирная обводка для выбранной камеры */}
          {isSelected && (
            <Layer
              id={`polygon-outline-${camera.id}`}
              type="line"
              paint={{
                "line-color": "#00ff00",
                "line-width": 2,
                "line-dasharray": [2, 2],
              }}
            />
          )}
        </Source>
      )}
    </>
  );
};
