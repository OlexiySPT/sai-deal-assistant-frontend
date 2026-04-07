import React, { useState } from "react";
import {
  UpdateStringFieldCommand,
  UpdateNumericFieldCommand,
  UpdateDateOnlyFieldCommand,
  UpdateDateTimeOffsetFieldCommand,
} from "../../../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../../../features/fieldUpdate/fieldUpdateAPI";
import { SizeType } from "../../StylingUtil";
import EditablePartFrameBase from "./EditablePartFrameBase";

export interface EditableFieldFrameChildProps {
  label?: string;
  inputValue: any;
  setInputValue: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCancel: () => void;
  handleSave: () => void;
}
export enum EditableFieldValueType {
  String,
  Number,
  Date,
  DateTime,
}

export interface EditableFieldFrameProps {
  label?: string;
  value: any;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  className?: string;
  readView: (props: EditableFieldFrameChildProps) => React.ReactNode;
  readActions?: (props: EditableFieldFrameChildProps) => React.ReactNode;
  editView: (props: EditableFieldFrameChildProps) => React.ReactNode;
  valueType: EditableFieldValueType;
  size?: SizeType;
  width?: string;
}

export default function EditableFieldFrame({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  valueType,
  className = "",
  readView,
  readActions,
  editView,
  size = "sm",
  width,
}: EditableFieldFrameProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      switch (valueType) {
        case EditableFieldValueType.Number:
          await fieldUpdateAPI.updateNumeric({
            entity,
            field,
            id,
            value: parseFloat(inputValue as string),
            notNull: validation === "NotNull",
          } as UpdateNumericFieldCommand);
          break;
        case EditableFieldValueType.Date:
          await fieldUpdateAPI.updateDate({
            entity,
            field,
            id,
            value: inputValue,
            notNull: validation === "NotNull",
          } as UpdateDateOnlyFieldCommand);
          break;
        case EditableFieldValueType.DateTime:
          await fieldUpdateAPI.updateDateTime({
            entity,
            field,
            id,
            value: inputValue,
            notNull: validation === "NotNull",
          } as UpdateDateTimeOffsetFieldCommand);
          break;
        default:
          await fieldUpdateAPI.updateString({
            entity,
            field,
            id,
            value: inputValue,
            validation,
          } as UpdateStringFieldCommand);
          break;
      }
      if (onUpdated) onUpdated();
      setEditMode(false);
    } catch (err: any) {
      let failures = err.response?.data?.failures.Value;
      if (Array.isArray(failures) && failures.length > 0) {
        setError(failures.join("; "));
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Error updating field");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  }

  function handleCancel() {
    setError(null);
    setInputValue(value ?? "");
    setEditMode(false);
  }
  function handleEdit() {
    setInputValue(value ?? "");
    setError(null);
    setEditMode(true);
  }

  // Compose childProps for edit/read views
  const childProps: EditableFieldFrameChildProps = {
    label,
    inputValue,
    setInputValue,
    loading,
    error,
    setError,
    handleKeyDown,
    handleCancel,
    handleSave,
  };

  // Use EditablePartFrameBase   for layout/editMode
  return (
    <EditablePartFrameBase
      editMode={editMode}
      error={error}
      label={label}
      className={className}
      size={size}
      readView={() => readView(childProps)}
      readActions={readActions ? () => readActions(childProps) : undefined}
      editView={() => editView(childProps)}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      handleSave={handleSave}
      width={width}
    />
  );
}
