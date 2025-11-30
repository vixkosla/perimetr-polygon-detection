import "./HelperPopUp.css";

import { Popup } from "react-map-gl/mapbox";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import type { CameraData } from "../../types/CameraData";
import type { Settings } from "../../types/Settings";
import { useGlobalStore } from "../../store/useGlobalStore";

interface popupProps {
  data: CameraData;
  cancelHelper: () => void;
  updateName: (name: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const HelperPopUp = ({
  data,
  cancelHelper,
  updateName,
  updateSettings,
}: popupProps) => {
  const addCamera = useGlobalStore((state) => state.addCamera);

  const handleConfirm = async () => {
    const { name, lat, lng, settings } = data;

    await addCamera(name, lat, lng, settings);
    cancelHelper();
  };

  return (
    <>
      <Popup
        longitude={data.lng}
        latitude={data.lat}
        anchor="left"
        offset={20}
        onClose={cancelHelper}
        closeOnClick={false}
        maxWidth="500px"
        className="camera-settings-popup-container"
      >
        <div className="camera-settings-popup">
          <div className="popup-header">
            <h3>Настройки камеры</h3>
          </div>

          <div className="popup-content">
            {/* Название */}
            <div className="setting-group">
              <label>Название</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="Камера 1"
                className="camera-name-input"
              />
            </div>

            {/* Координаты */}
            <div className="setting-group">
              <label>Координаты</label>
              <div className="coordinates-display">
                <span>
                  {data.lat.toFixed(5)}, {data.lng.toFixed(5)}
                </span>
              </div>
            </div>

            {/* Направление (Heading) */}
            <div className="setting-group">
              <label>
                Направление: <strong>{data.settings.heading}°</strong>
              </label>
              <Slider
                min={0}
                max={360}
                value={data.settings.heading}
                onChange={(value) =>
                  updateSettings({ heading: value as number })
                }
                marks={{
                  0: "0° (С)",
                  90: "90° (В)",
                  180: "180° (Ю)",
                  270: "270° (З)",
                  360: "360°",
                }}
              />
            </div>

            {/* Угол обзора (HFOV) */}
            <div className="setting-group">
              <label>
                Угол обзора: <strong>{data.settings.hfov}°</strong>
              </label>
              <Slider
                min={10}
                max={180}
                value={data.settings.hfov}
                onChange={(value) => updateSettings({ hfov: value as number })}
                marks={{
                  10: "10°",
                  60: "60°",
                  90: "90°",
                  120: "120°",
                  180: "180°",
                }}
              />
            </div>

            {/* Дальность */}
            <div className="setting-group">
              <label>
                Дальность: <strong>{data.settings.maxRange}м</strong>
              </label>
              <Slider
                min={1000}
                max={15000}
                step={500}
                value={data.settings.maxRange}
                onChange={(value) =>
                  updateSettings({ maxRange: value as number })
                }
                marks={{
                  1000: "1км",
                  5000: "5км",
                  10000: "10км",
                  15000: "15км",
                }}
              />
            </div>
          </div>

          <div className="popup-footer">
            <button className="btn-cancel" onClick={cancelHelper}>
              Отмена
            </button>
            <button className="btn-confirm" onClick={handleConfirm}>
              Добавить камеру
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
};
