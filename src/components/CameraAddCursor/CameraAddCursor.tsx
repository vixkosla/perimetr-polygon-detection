import { useEffect, useState } from "react";

import "./CameraAddCursor.css";

import { useMotionValue, motion } from "framer-motion";

import { useGlobalStore } from "../../store/useGlobalStore";
import type { MapMouseEvent } from "react-map-gl/mapbox-legacy";

export const CameraAddCursor = () => {
  const map = useGlobalStore.getState().getMap();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!map) return;

    map.getCanvas().style.cursor = "none";

    const onMouseMove = (e: MapMouseEvent) => {
      const lat = parseFloat(e.lngLat.lat.toFixed(5));
      const lng = parseFloat(e.lngLat.lng.toFixed(5));
      x.set(Math.round(e.point.x));
      y.set(Math.round(e.point.y));

      setCoords({ lat, lng });
    };

    const onMouseLeave = () => {
      setCoords(null);
    };

    map.on("mousemove", onMouseMove);
    map.on("mouseleave", onMouseLeave);

    return () => {
      map.getCanvas().style.cursor = "";
      map.off("mousemove", onMouseMove);
      map.off("mouseleave", onMouseLeave);

      setCoords(null);
    };
  }, [map, x, y]);

  if (!coords) return null;

  return (
    <motion.div
      className="interface__custom-cursor"
      style={{ x, y }}
      initial={false}
    >
      <div className="custom-cursor__icon"></div>
      <div className="custom-cursor__coordinates">
        <span className="custom-cursor__coordinates-lat">{coords.lat},</span>
        <span className="custom-cursor__coordinates-lng">{coords.lng}</span>
      </div>
    </motion.div>
  );
};
