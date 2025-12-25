import { Popup } from "react-map-gl/mapbox";

import "./CameraEditPopup.css";

import { useGlobalStore } from "@/store/useGlobalStore";
import type { Camera } from "@/types/Camera";
import { CornerLeftUp, CornerRightUp, Trash2, Pencil } from "lucide-react";

interface CameraEditPopupProps {
  loadCameraData: (camera: Camera) => void;
}

export const CameraEditPopup = ({ loadCameraData }: CameraEditPopupProps) => {
  const editingCameraId = useGlobalStore((state) => state.editingCameraId);

  const setSelectedCameraId = useGlobalStore(
    (state) => state.setSelectedCameraId,
  );

  const setEditingCameraId = useGlobalStore(
    (state) => state.setEditingCameraId,
  );

  const rotateCamera = useGlobalStore((state) => state.rotateCamera);
  const removeCamera = useGlobalStore((state) => state.removeCamera); // добавили

  const camera = useGlobalStore((state) =>
    state.cameraes.find((c) => c.id === editingCameraId),
  );

  const handleRotate = (delta: number) => {
    if (editingCameraId) {
      rotateCamera(editingCameraId, delta);
    }
  };

  const handleDeleteCamera = (id: string | null) => {
    if (!id) return;

    // Подтверждение удаления
    if (window.confirm(`Удалить камеру "${camera?.name}"?`)) {
      removeCamera(id);
      // editingCameraId автоматически сбросится в store
    }
  };

  const handleEdit = () => {
    if (camera) {
      loadCameraData(camera);
      setEditingCameraId(null);
    }
  };

  if (!camera) return null;

  return (
    <Popup
      longitude={+camera?.lng}
      latitude={+camera?.lat}
      onClose={() => {
        setSelectedCameraId(null);
        setEditingCameraId(null);
      }}
      anchor="top"
      closeOnClick={false}
    >
      <div className="interface__edit-mode">
        {/*<h2>Edit Camera</h2>*/}
        {/*<p>Camera settings</p>*/}
        <div className="edit-mode__container"></div>
        <div className="edit-mode__controls">
          <div className="edit-mode__controls-button edit-mode__controls-button-left">
            <CornerLeftUp
              color="#ab072d"
              strokeWidth={2}
              onClick={() => handleRotate(-15)}
            />
          </div>
          <div className="edit-mode__controls-button edit-mode__controls-button-edit">
            <Pencil
              color="#1a7ab0"
              strokeWidth={2}
              onClick={handleEdit}
            />
          </div>
          <div className="edit-mode__controls-button edit-mode__controls-button-trash">
            <Trash2
              color="#ab072d"
              strokeWidth={2}
              onClick={() => handleDeleteCamera(editingCameraId)}
            />
          </div>
          <div className="edit-mode__controls-button edit-mode__controls-button-right">
            <CornerRightUp
              color="#ab072d"
              strokeWidth={2}
              onClick={() => handleRotate(15)}
            />
          </div>
        </div>
      </div>
    </Popup>
  );
};
