import React from "react";
import Button from "./buttons/Button";

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
        className={`bg-white dark:bg-gray-800 rounded shadow-lg w-full relative flex flex-col overflow-hidden border border-gray-300 dark:border-gray-600 ${dialogClassName || ""}`}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 select-none">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
            {title || ""}
          </h2>
          <Button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="!px-2 !py-2 !rounded-full !border-none !bg-transparent text-gray-600 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
          >
            ✕
          </Button>
        </div>
        <div className="px-4 pt-1 pb-4 flex flex-col flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
