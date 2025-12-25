import "./HelperPopUp.css";

import { Popup } from "react-map-gl/mapbox";

import { LevaPanel, useCreateStore, useControls } from "leva";
// import { createStore } from "leva";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
//
import { useEffect } from "react";

import type { CameraData } from "@/types/CameraData";
import type { Settings } from "@/types/Settings";
import { useGlobalStore } from "@/store/useGlobalStore";

import { themeColors } from "@/constants/lemeComponentTheme";

interface popupProps {
  data: CameraData;
  editingCameraId?: string | null;
  cancelHelper: () => void;
  updateName: (name: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const HelperPopUp = ({
  data,
  editingCameraId,
  cancelHelper,
  updateName,
  updateSettings,
}: popupProps) => {
  const addCamera = useGlobalStore((state) => state.addCamera);
  const updateCamera = useGlobalStore((state) => state.updateCamera);

  const isEditMode = !!editingCameraId;

  const handleConfirm = async () => {
    const { name, lat, lng, settings } = data;

    if (isEditMode && editingCameraId) {
      await updateCamera(editingCameraId, name, lat, lng, settings);
    } else {
      await addCamera(name, lat, lng, settings);
    }
    cancelHelper();
  };

  const store = useCreateStore();

  const [values] = useControls(
    () => ({
      heading: { value: data.settings.heading, min: 0, max: 360, step: 1 },
      hfov: { value: data.settings.hfov, min: 10, max: 180, step: 1 },
      maxRange: {
        value: data.settings.maxRange,
        min: 1000,
        max: 15000,
        step: 100,
      },
      cameraHeight: {
        value: data.settings.cameraHeight,
        min: 1,
        max: 200,
        step: 1,
      },
    }),
    { store },
  );

  // Отслеживаем изменения values
  useEffect(() => {
    updateSettings(values);
  }, [values, updateSettings]);

  return (
    <>
      <Popup
        longitude={data.lng}
        latitude={data.lat}
        anchor="right"
        offset={20}
        onClose={cancelHelper}
        closeOnClick={false}
        maxWidth="500px"
        className="camera-settings-popup-container"
      >
        <div className="camera-settings-popup">
          <div className="popup-header">
            <h3>{isEditMode ? "Редактирование ОПУ" : "Настройки ОПУ"}</h3>
          </div>

          <div className="popup-content">
            {/* Название */}
            <div className="setting-group">
              {/*<label>Название</label>*/}
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="ОПУ-1"
                className="camera-name-input"
              />
            </div>

            {/* Координаты */}
            <div className="setting-group">
              {/*<label>Координаты</label>*/}
              <div className="coordinates-display">
                <span>
                  {data.lat.toFixed(5)} <br /> {data.lng.toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          {/* Высота камеры */}

          <div className="popup-footer">
            <button className="btn-cancel" onClick={cancelHelper}>
              Отмена
            </button>
            <button className="btn-confirm" onClick={handleConfirm}>
              {isEditMode ? "Сохранить" : "Добавить камеру"}
            </button>
          </div>
        </div>
        <div className="leva-container">
          <LevaPanel
            store={store}
            theme={themeColors}
            // hidetitleBar
            hideCopyButton
          />
        </div>
      </Popup>
    </>
  );
};
