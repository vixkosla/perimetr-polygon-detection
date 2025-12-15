import "./HelperPreview.css";

import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/mapbox";

import type { CameraData } from "@/types/CameraData";
import { destinationPoint } from "@/services/destinationPoint";

export const HelperPreview = ({ data }: { data: CameraData }) => {
  const {
    lat,
    lng,
    settings: { heading, hfov, maxRange },
  } = data;

  const { arrowEndPoint, conePolygon } = useMemo(() => {
    const halfHFOV = hfov / 2;
    const displayRange = maxRange;

    const arrow = destinationPoint(lat, lng, displayRange, heading);

    const conePoints: number[][] = [];

    for (let az = heading - halfHFOV; az <= heading + halfHFOV; az += 2) {
      const pt = destinationPoint(lat, lng, displayRange, az);
      conePoints.push([pt.lon, pt.lat]);
    }

    return {
      arrowEndPoint: arrow,
      conePolygon: conePoints,
    };
  }, [lat, lng, heading, hfov, maxRange]);

  return (
    <>
      {/* Точка камеры */}
      <Source
        id="placement-point"
        type="geojson"
        data={{
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          properties: {},
        }}
      >
        <Layer
          id="placement-point-layer"
          type="circle"
          paint={{
            "circle-radius": 8,
            "circle-color": "#ff9800",
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          }}
        />
      </Source>

      {/* Стрелка направления */}
      <Source
        id="placement-arrow"
        type="geojson"
        data={{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [lng, lat],
              [arrowEndPoint.lon, arrowEndPoint.lat],
            ],
          },
          properties: {},
        }}
      >
        <Layer
          id="placement-arrow-layer"
          type="line"
          paint={{
            "line-color": "#ff9800",
            "line-width": 3,
          }}
        />
      </Source>

      {/* Конус обзора с плавными краями */}
      <Source
        id="placement-cone"
        type="geojson"
        data={{
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[[lng, lat], ...conePolygon, [lng, lat]]],
          },
          properties: {},
        }}
      >
        <Layer
          id="placement-cone-fill"
          type="fill"
          paint={{
            "fill-color": "#ff9800",
            "fill-opacity": 0.2,
          }}
        />
        <Layer
          id="placement-cone-outline"
          type="line"
          paint={{
            "line-color": "#ff9800",
            "line-width": 2,
            "line-dasharray": [2, 2],
          }}
        />
      </Source>
    </>
  );
};
