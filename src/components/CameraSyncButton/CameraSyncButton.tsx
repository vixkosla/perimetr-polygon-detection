import "./CameraSyncButton.css";

import { RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import trustedDevices from "@/constants/trustedDevices.json";
import { useGlobalStore } from "@/store/useGlobalStore";
import { DEFAULT_CAMERA_SETTINGS } from "@/constants/defaultCameraSettings";

interface DeviceResponse {
  lat: number;
  lng: number;
  ugol?: number;
  name?: string;
}

export const CameraSyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const addCamera = useGlobalStore((state) => state.addCamera);

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const promises = trustedDevices.devices.map(async (deviceUrl) => {
        try {
          const response = await fetch(deviceUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn(`Failed to fetch from ${deviceUrl}: ${response.status}`);
            return null;
          }

          const data: DeviceResponse = await response.json();

          // Проверяем обязательные поля
          if (typeof data.lat !== "number" || typeof data.lng !== "number") {
            console.warn(`Invalid data from ${deviceUrl}:`, data);
            return null;
          }

          // Используем данные из ответа или дефолтные значения
          const name = data.name || `ОПУ-${deviceUrl.split("/").pop()}`;
          const heading = data.ugol ?? DEFAULT_CAMERA_SETTINGS.heading;

          await addCamera(name, data.lat, data.lng, {
            ...DEFAULT_CAMERA_SETTINGS,
            heading,
          });

          return data;
        } catch (error) {
          console.error(`Error fetching from ${deviceUrl}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r !== null).length;
      
      if (successCount > 0) {
        alert(`Синхронизация завершена!\nДобавлено камер: ${successCount}`);
      } else {
        alert("Не удалось добавить ни одной камеры");
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert("Ошибка при синхронизации");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="interface__sync-mode">
      <button
        className={`sync-mode__button ${isSyncing ? "sync-mode__button--syncing" : ""}`}
        onClick={handleSync}
        disabled={isSyncing}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isSyncing ? "syncing" : "idle"}
            initial={{ opacity: 0.8, rotate: 0 }}
            animate={{
              opacity: 1,
              rotate: isSyncing ? 360 : 0,
            }}
            transition={{
              duration: isSyncing ? 1 : 0.3,
              repeat: isSyncing ? Infinity : 0,
              ease: "linear",
            }}
            className="sync-mode__button-animation-container"
          >
            <RefreshCw size={32} strokeWidth={3} />
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
};
