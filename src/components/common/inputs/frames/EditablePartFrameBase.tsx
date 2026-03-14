import React, { useState } from "react";
import EditButton from "../../buttons/EditButton";
import OkButton from "../../buttons/OkButton";
import CancelButton from "../../buttons/CancelButton";
import InputLabel from "../InputLabel";
import {
  getControlHeightBySize,
  getHeightBySize,
  SizeType,
} from "../../sizeUtils";

interface EditablePartFrameBaseProps {
  label?: string;
  className?: string;
  size?: SizeType;
  editMode: boolean;
  error?: string | null;
  readView: () => React.ReactNode;
  editView: () => React.ReactNode;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
}

export default function EditablePartFrameBase({
  label,
  className = "",
  readView,
  editView,
  size = "sm",
  editMode,
  error,
  handleEdit,
  handleCancel,
  handleSave,
}: EditablePartFrameBaseProps) {
  return (
    <div
      className={`flex items-center gap-2 w-full text-${size} ${className} h-${getControlHeightBySize(size)}`}
    >
      {label && <InputLabel label={label} />}
      <div className="flex-1 w-full">
        {!editMode ? (
          <div className="flex">
            <span className="bg-transparent w-full">
              {/*Read-only part */}
              {readView()}
            </span>
            <EditButton onClick={handleEdit} size={size} aria-label="Edit" />
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {/* Overlay to block all other interactions */}
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-10"
              style={{ pointerEvents: "auto" }}
            />
            <div className="flex w-full gap-1 z-50 relative">
              {/* Edit part*/}
              {editView()}
              <OkButton onClick={handleSave} size={size} aria-label="Save" />
              <CancelButton
                onClick={handleCancel}
                size={size}
                aria-label="Cancel"
              />
            </div>
            {error && (
              <div
                className="absolute left-0 w-full z-50 bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-300 text-xs rounded px-3 py-1 shadow-lg animate-fade-in"
                style={{ top: "calc(100% + 0.5rem)" }}
              >
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
