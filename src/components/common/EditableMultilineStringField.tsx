import React, { useState, useRef } from "react";
import { UpdateStringFieldCommand } from "../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../features/fieldUpdate/fieldUpdateAPI";
import OkButton from "./OkButton";
import CancelButton from "./CancelButton";
import EditButton from "./EditButton";

interface EditableMultilineStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  Header?: string;
  className?: string;
  minRows?: number;
  maxRows?: number;
}

const EditableMultilineStringField: React.FC<
  EditableMultilineStringFieldProps
> = ({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  Header,
  className = "",
  minRows = 2,
  maxRows = 10,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const minHeight = minRows * 24;
  const maxHeight = maxRows * 24;
  const [height, setHeight] = useState(minHeight);

  const handleEdit = () => {
    setInputValue(value ?? "");
    setEditMode(true);
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
  };

  const handleSave = async () => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    autoResize(e.target);
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 24 * maxRows) + "px";
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Header line */}
      {(Header || editMode) && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {Header}
          </span>
          <div className="flex gap-1">
            {!editMode && (
              <EditButton onClick={handleEdit} size="sm" aria-label="Edit" />
            )}
            {editMode && (
              <>
                <OkButton
                  onClick={handleSave}
                  size="sm"
                  disabled={loading}
                  aria-label="Save"
                />
                <CancelButton
                  onClick={handleCancel}
                  size="sm"
                  disabled={loading}
                  aria-label="Cancel"
                />
              </>
            )}
          </div>
        </div>
      )}
      {/* Main content */}
      {!editMode ? (
        <div className="flex flex-col flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            className="input input-sm border rounded px-2 py-1 max-w-xl w-full resize-none bg-transparent text-gray-900 dark:text-gray-100"
            rows={minRows}
            value={value ?? ""}
            disabled={true}
            style={{
              minHeight: `${minRows * 24}px`,
              maxHeight: `${maxRows * 24}px`,
              backgroundColor: "transparent",
              borderColor: "transparent",
              color: value ? undefined : "#9ca3af", // Tailwind gray-400
              cursor: "pointer",
            }}
            title={value ?? ""}
            onClick={handleEdit}
            readOnly
          />
          {/* Drag handle for vertical resize in view mode */}
          <div
            style={{ cursor: "row-resize", height: 10, width: "100%" }}
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 select-none"
            onMouseDown={(e) => {
              e.preventDefault();
              const textarea = textareaRef.current;
              if (!textarea) return;
              const startY = e.clientY;
              const startHeight = textarea.offsetHeight;
              const onMouseMove = (moveEvent: MouseEvent) => {
                const delta = moveEvent.clientY - startY;
                let newHeight = startHeight + delta;
                const minHeight = minRows * 24;
                const maxHeight = maxRows * 24;
                newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
                textarea.style.height = `${newHeight}px`;
              };
              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };
              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          >
            <svg
              width="24"
              height="6"
              viewBox="0 0 24 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="2"
                width="16"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            className="input input-sm border rounded px-2 py-1 max-w-xl w-full resize-none"
            rows={minRows}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{
              minHeight: `${minRows * 24}px`,
              maxHeight: `${maxRows * 24}px`,
            }}
            autoFocus
          />
          {/* Drag handle for vertical resize */}
          <div
            style={{ cursor: "row-resize", height: 10, width: "100%" }}
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 select-none"
            onMouseDown={(e) => {
              e.preventDefault();
              const textarea = textareaRef.current;
              if (!textarea) return;
              const startY = e.clientY;
              const startHeight = textarea.offsetHeight;
              const onMouseMove = (moveEvent: MouseEvent) => {
                const delta = moveEvent.clientY - startY;
                let newHeight = startHeight + delta;
                const minHeight = minRows * 24;
                const maxHeight = maxRows * 24;
                newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
                textarea.style.height = `${newHeight}px`;
              };
              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };
              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          >
            <svg
              width="24"
              height="6"
              viewBox="0 0 24 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="2"
                width="16"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      )}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </div>
  );
};

export default EditableMultilineStringField;
