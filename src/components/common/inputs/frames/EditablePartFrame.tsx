import React, { useState } from "react";
import { SizeType } from "../../sizeUtils";
import EditablePartFrameBase from "./EditablePartFrameBase";

export interface EditablePartFrameChildProps {
  label?: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface EditablePartFrameProps {
  label?: string;
  className?: string;
  size?: SizeType;
  readView: (props: EditablePartFrameChildProps) => React.ReactNode;
  editView: (props: EditablePartFrameChildProps) => React.ReactNode;
  onSave: () => void;
  onCancel?: () => void;
}

export default function EditablePartFrame({
  label,
  className = "",
  readView,
  editView,
  size = "sm",
  onSave,
  onCancel,
}: EditablePartFrameProps) {
  const [editMode, setEditMode] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  }

  function handleEdit() {
    setEditMode(true);
  }

  function handleCancel() {
    setEditMode(false);
    if (onCancel) onCancel();
  }

  function handleSave() {
    // Delegate save to editView
    setEditMode(false);
    onSave();
  }

  const childProps: EditablePartFrameChildProps = {
    label,
    handleKeyDown,
  };
  return (
    <EditablePartFrameBase
      editMode={editMode}
      label={label}
      className={className}
      size={size}
      readView={() => readView(childProps)}
      editView={() => editView(childProps)}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      handleSave={handleSave}
    />
  );
}
