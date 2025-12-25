import type { Camera } from "@/types/Camera";
import { useGlobalStore } from "@/store/useGlobalStore";
import "./CameraList.css";

export const CameraList = ({ cameraes }: { cameraes: Camera[] }) => {
  const selectedCameraId = useGlobalStore((state) => state.selectedCameraId);
  const hoveredCameraId = useGlobalStore((state) => state.hoveredCameraId);
  const setSelectedCameraId = useGlobalStore(
    (state) => state.setSelectedCameraId,
  );
  const setHoveredCameraId = useGlobalStore(
    (state) => state.setHoveredCameraId,
  );

  return (
    cameraes.length > 0 && (
      <div className="interface__camera-list">
        <div className="camera-list__header">
          <div>ID</div>
          <div>Name</div>
          <div>Coords</div>
          <div>hfov</div>
          <div>heading</div>
          <div>height</div>
        </div>
        {cameraes.map((camera) => (
          <div
            key={camera.id}
            className={`camera-list__item ${
              selectedCameraId === camera.id
                ? "camera-list__item--selected"
                : ""
            } ${
              hoveredCameraId === camera.id ? "camera-list__item--hovered" : ""
            }`}
            onClick={() => {
              if (selectedCameraId === camera.id) {
                setSelectedCameraId(null);
              } else {
                setSelectedCameraId(camera.id);
              }
            }}
            onMouseEnter={() => setHoveredCameraId(camera.id)}
            onMouseLeave={() => setHoveredCameraId(null)}
          >
            <div className="camera-list__id">{camera.id.slice(0, 8)}</div>
            <div className="camera-list__name">{camera.name}</div>
            <div className="camera-list__coords">
              <span className="camera-list__coords-number camera-list__coords-number-lat">
                {camera.lat.toFixed(5)}
              </span>
              <span className="camera-list__coords-separator"> ; </span>
              <span className="camera-list__coords-number camera-list__coords-number-lng">
                {camera.lng.toFixed(5)}
              </span>
            </div>
            <div className="camera-list__hfov">{camera.settings.hfov}°</div>
            <div className="camera-list__heading">
              {camera.settings.heading}°
            </div>
            <div className="camera-list__height">
              {camera.settings.cameraHeight}m
            </div>
          </div>
        ))}
      </div>
    )
  );
};
