import "./App.css";

import { useState } from "react";

import Map from "react-map-gl/mapbox";
import type { ViewStateChangeEvent } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

// import { useCameras } from "./hooks/useCameras";
import { useGlobalStore } from "@/store/useGlobalStore.ts";

import { CameraComponent } from "@/components/CameraComponent";
import { CameraList } from "@/components/CameraList/CameraList.tsx";
import { CameraAddButton } from "@/components/CameraAddButton/CameraAddButton.tsx";
import { CameraAddCursor } from "@/components/CameraAddCursor/CameraAddCursor.tsx";

import { usePreview } from "@/hooks/usePreview.ts";

import { HelperPopUp } from "@/components/HelperPopUp/HelperPopUp";
import { HelperPreview } from "@/components/HelperPreview/HelperPreview";
import { CameraEditPopup } from "@/components/CameraEditPopup/CameraEditPopup.tsx";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 42.437,
    latitude: 43.349,
    zoom: 11,
    pitch: 60,
    bearing: 45,
  });
  const [cursor, setCursor] = useState<string>('auto');

  const { data, initData, updateName, updateSettings, clearData } =
    usePreview();

  const cameraes = useGlobalStore((state) => state.cameraes);
  const editingCameraId = useGlobalStore((state) => state.editingCameraId);
  const setEditingCameraId = useGlobalStore(
    (state) => state.setEditingCameraId,
  );

  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);

  const setMapRef = useGlobalStore.getState().setMapRef;

  const interactiveLayers = cameraes.map((c) => `camera-layer-${c.id}`);

  const onMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const handleClick = (e: MapMouseEvent) => {
    if (isAddingMode) {
      const lat = e.lngLat.lat;
      const lon = e.lngLat.lng;
      initData(lat, lon);
      return;
    }

    const feature = e.features?.[0];
    if (feature && feature.properties && "id" in feature.properties) {
      const cameraId = feature.properties.id as string;
      setEditingCameraId(cameraId);
    }
  };

  const cancelHelper = () => {
    setIsAddingMode(false);
    clearData();
  };

  const onMouseEnter = (e: MapMouseEvent) => {
    if (
      e.features &&
      e.features.length > 0 &&
      e.features[0].layer &&
      e.features[0].layer.id.startsWith("camera-layer-")
    ) {
      setCursor("pointer");
    }
  };
  const onMouseLeave = () => setCursor('auto');

  return (
    <>
      <div
        className=""
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Map
          {...viewState}
          ref={setMapRef}
          onClick={handleClick}
          onMove={onMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          cursor={cursor}
          interactiveLayerIds={interactiveLayers}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          mapboxAccessToken="pk.eyJ1IjoiaG9va2FobG9jYXRvciIsImEiOiI5WnJEQTBBIn0.DrAlI7fhFaYr2RcrWWocgw"
          terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
          onLoad={(event) => {
            const map = event.target;

            map.addSource("mapbox-dem", {
              type: "raster-dem",
              url: "mapbox://mapbox.terrain-rgb",
              tileSize: 512,
              maxzoom: 14,
            });

            map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
          }}
        >
          {cameraes.length > 0 &&
            cameraes.map((camera) => (
              <CameraComponent key={camera.id} camera={camera} />
            ))}

          {data && <HelperPreview data={data} />}
          {data && (
            <HelperPopUp
              data={data}
              cancelHelper={cancelHelper}
              updateName={updateName}
              updateSettings={updateSettings}
            />
          )}

          {editingCameraId && <CameraEditPopup />}
        </Map>
      </div>
      <div className="interface-container">
        <CameraList cameraes={cameraes} />
        <CameraAddButton
          isAddingMode={isAddingMode}
          setIsAddingMode={setIsAddingMode}
        />
        {isAddingMode && !data && <CameraAddCursor />}
      </div>
    </>
  );
}

export default App;
