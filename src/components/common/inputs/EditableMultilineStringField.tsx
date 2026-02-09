import React, { useState, useRef } from "react";
import { UpdateStringFieldCommand } from "../../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../../features/fieldUpdate/fieldUpdateAPI";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";

interface EditableMultilineStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  className?: string;
  rows?: number;
}

export default function EditableMultilineStringField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  className = "",
  rows = 2,
}: EditableMultilineStringFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleEdit = () => {
    setInputValue(value ?? "");
    setEditMode(true);
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  function handleCancel() {
    setEditMode(false);
    setError(null);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    const command: UpdateStringFieldCommand = {
      entity,
      field,
      id,
      value: inputValue,
      validation,
    };
    try {
      await fieldUpdateAPI.updateString(command);
      setEditMode(false);
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "Error updating field",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {!editMode ? (
        <>
          {/* Header line */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {label}:
            </span>
            <div className="flex gap-1">
              <EditButton onClick={handleEdit} size="sm" aria-label="Edit" />
            </div>
          </div>
          {/* Main content */}
          <div className="flex flex-col flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              className="input input-sm border rounded px-2 py-1 max-w-xl w-full resize-none bg-transparent text-gray-900 dark:text-gray-100"
              rows={rows}
              value={value ?? ""}
              disabled={true}
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                color: value ? undefined : "#9ca3af", // Tailwind gray-400
                cursor: "pointer",
              }}
              title={value ?? ""}
              onClick={handleEdit}
              readOnly
            />
          </div>
        </>
      ) : (
        <>
          {/* Overlay to block all other interactions */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-10"
            style={{ pointerEvents: "auto" }}
          />
          <div>
            {/* Edit area remains in normal flow and layout */}
            {/* Header line */}
            <div className="flex items-center justify-between mb-1  z-50 relative">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {label}:
              </span>
              <div className="flex gap-1">
                <OkButton onClick={handleSave} size="sm" aria-label="Save" />
                <CancelButton
                  onClick={handleCancel}
                  size="sm"
                  aria-label="Cancel"
                />
              </div>
            </div>
            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-1 z-50 relative">
              <textarea
                ref={textareaRef}
                className="input input-sm border rounded px-2 py-1 max-w-xl w-full resize-none"
                rows={rows}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoFocus
              />
            </div>
          </div>
        </>
      )}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </div>
  );
}
