import React, { useState } from "react";
import {
  UpdateStringFieldCommand,
  UpdateNumericFieldCommand,
  UpdateDateFieldCommand,
} from "../../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../../features/fieldUpdate/fieldUpdateAPI";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";
import InputLabel from "./InputLabel";
import { getHeightBySize, SizeType } from "../sizeUtils";

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

interface EditableFieldFrameProps {
  label?: string;
  value: any;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  className?: string;
  readView: (props: EditableFieldFrameChildProps) => React.ReactNode;
  editView: (props: EditableFieldFrameChildProps) => React.ReactNode;
  size?: SizeType;
}

export default function EditableFieldFrame({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  className = "",
  readView,
  editView,
  size = "sm",
}: EditableFieldFrameProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setInputValue(value ?? "");
    setEditMode(true);
    setError(null);
  }

  function handleCancel() {
    setEditMode(false);
    setError(null);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    try {
      if (typeof value === "number") {
        await fieldUpdateAPI.updateNumeric({
          entity,
          field,
          id,
          value: parseFloat(inputValue as string),
          notNull: validation === "NotNull",
        } as UpdateNumericFieldCommand);
      } else if ((value as any) instanceof Date) {
        await fieldUpdateAPI.updateDate({
          entity,
          field,
          id,
          value: inputValue,
          notNull: validation === "NotNull",
        } as UpdateDateFieldCommand);
      } else {
        await fieldUpdateAPI.updateString({
          entity,
          field,
          id,
          value: inputValue,
          validation,
        } as UpdateStringFieldCommand);
      }
      setEditMode(false);
      if (onUpdated) onUpdated();
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

  return (
    <div
      className={`flex items-center gap-2 items-start w-full text-${size} min-h-${getHeightBySize(size)}max-h-${getHeightBySize(size)}`}
    >
      {label && <InputLabel label={label} />}
      <div className="flex-1 w-full">
        {!editMode ? (
          <div className="flex">
            <span className="bg-transparent w-full" title={String(value ?? "")}>
              {/*Read-only part */}
              {readView(childProps)}
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
              {editView(childProps)}
              <OkButton
                onClick={handleSave}
                size={size}
                disabled={loading}
                aria-label="Save"
              />
              <CancelButton
                onClick={handleCancel}
                size={size}
                disabled={loading}
                aria-label="Cancel"
              />
              {error && (
                <div
                  className="absolute left-0 w-full bg-red-100 dark:bg-red-800 border border-red-400 text-red-700 dark:text-red-300 text-xs rounded px-3 py-1 shadow-lg animate-fade-in"
                  style={{ top: "calc(100% + 0.3rem)" }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
