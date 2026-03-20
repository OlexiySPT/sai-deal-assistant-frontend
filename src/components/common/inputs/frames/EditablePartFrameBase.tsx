import React, { useState } from "react";
import EditButton from "../../buttons/EditButton";
import OkButton from "../../buttons/OkButton";
import CancelButton from "../../buttons/CancelButton";
import InputLabel from "../InputLabel";
import {
  getControlHeightBySize,
  getHeightBySize,
  SizeType,
} from "../../StylingUtil";
import { modal } from "../../../cva/modal-cva";
import { text } from "../../../cva/text-cva";
import { buble } from "../../../cva/buble-cva";

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
      {!editMode ? (
        <>
          {/*Read-only part */}
          {readView()}
          <EditButton onClick={handleEdit} size={size} aria-label="Edit" />
        </>
      ) : (
        <>
          {/* Overlay to block all other interactions */}
          <div className={modal({ part: "overlay" })} />
          <div
            className={`flex w-full gap-1 items-center ${modal({ part: "content" })} ${className}`}
          >
            {/* Edit part*/}
            {editView()}
            <OkButton onClick={handleSave} size={size} aria-label="Save" />
            <CancelButton
              onClick={handleCancel}
              size={size}
              aria-label="Cancel"
            />
            {error && (
              <div
                className={`${buble({ style: "error", size })}`}
                style={{ top: "calc(100% + 0.5rem)", pointerEvents: "auto" }}
              >
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
