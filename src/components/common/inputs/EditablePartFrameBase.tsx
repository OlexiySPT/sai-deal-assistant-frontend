import React, { useState } from "react";
import EditButton from "../buttons/EditButton";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import InputLabel from "./InputLabel";
import { getHeightBySize, SizeType } from "../sizeUtils";

interface EditablePartFrameBaseProps {
  label?: string;
  className?: string;
  size?: SizeType;
  editMode: boolean;
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
  handleEdit,
  handleCancel,
  handleSave,
}: EditablePartFrameBaseProps) {
  return (
    <div
      className={`flex items-center gap-2 w-full text-${size} h-[${getHeightBySize(size)}px] ${className}`}
      style={{ minHeight: getHeightBySize(size) }}
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
          </div>
        )}
      </div>
    </div>
  );
}
