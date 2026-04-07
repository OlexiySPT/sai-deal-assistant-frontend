import React from "react";
import { button } from "../cva/button-cva";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  dialogClassName?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  dialogClassName,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`bg-white dark:bg-gray-800 rounded shadow-lg w-full relative overflow-hidden border border-gray-300 dark:border-gray-600 ${dialogClassName || ""}`}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 select-none">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {title || ""}
          </h2>
          <button
            className={button({ colorClass: "grey", size: "sm" })}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
