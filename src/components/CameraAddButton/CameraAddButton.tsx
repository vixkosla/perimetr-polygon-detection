import "./CameraAddButton.css";

import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const CameraAddButton = ({
  isAddingMode,
  setIsAddingMode,
}: {
  isAddingMode: boolean;
  setIsAddingMode: (value: boolean) => void;
}) => {
  return (
    <div className="interface__adding-mode">
      <button
        className={`adding-mode__button ${isAddingMode ? "adding-mode__button--active" : ""}`}
        onClick={() => setIsAddingMode(!isAddingMode)}
        // cursor="pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isAddingMode ? (
            <motion.div
              key="toAddingMode"
              initial={{ opacity: 1.0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 1.0, rotate: -135 }}
              transition={{ duration: 0.3 }}
              className="adding-mode__button-animation-container"
            >
              <X size={36} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="escapeAddingMode"
              initial={{ opacity: 1.0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 1.0, rotate: 135 }}
              transition={{ duration: 0.3 }}
              className="adding-mode__button-animation-container"
            >
              <Plus size={36} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
