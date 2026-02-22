import React, { useState } from "react";
import { UpdateStringFieldCommand } from "../../../features/fieldUpdate/fieldUpdateAPI";
import fieldUpdateAPI from "../../../features/fieldUpdate/fieldUpdateAPI";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";
import AutocompleteInput from "./AutocompleteInput";
import InputLabel from "./InputLabel";

interface AutocompleteEditableStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  className?: string;
  options: string[];
}

export default function AutocompleteEditableStringField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  className = "",
  options = [],
}: AutocompleteEditableStringFieldProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function processKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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

  return (
    <div className={`relative w-full`}>
      <div className={`flex gap-2 items-start w-full ${className}`}>
        <InputLabel label={label} />
        <div className="flex-1 w-full">
          {!editMode ? (
            <div className="flex items-center w-full">
              <span
                className="truncate min-h-[32px] flex items-center text-sm px-2 py-1 bg-transparent w-full"
                style={{ boxSizing: "border-box" }}
                title={value ?? ""}
              >
                {(() => {
                  if (!value) {
                    return <span className="text-gray-400">(empty)</span>;
                  }
                  // URL detection
                  let isUrl = false;
                  try {
                    const url = new URL(value);
                    isUrl =
                      url.protocol === "http:" || url.protocol === "https:";
                  } catch {}
                  if (isUrl) {
                    return (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    );
                  }
                  return value;
                })()}
              </span>
              <EditButton onClick={handleEdit} size="sm" aria-label="Edit" />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {/* Overlay to block all other interactions */}
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-10"
                style={{ pointerEvents: "auto" }}
              />
              <div className="flex items-center w-full gap-2">
                <AutocompleteInput
                  className="input input-sm border rounded px-2 py-1 min-h-[32px] text-sm w-full z-50 relative"
                  value={inputValue}
                  onChange={setInputValue}
                  suggestions={Array.isArray(options) ? options : []}
                  showAllOnEmpty={true}
                  autoFocus
                  onEnterPressed={handleSave}
                  onEscapePressed={handleCancel}
                  onKeyDown={processKeyDown}
                />
                <OkButton
                  onClick={handleSave}
                  size="sm"
                  disabled={loading}
                  aria-label="Save"
                  className="z-50 relative h-[32px] w-[32px] min-w-0 aspect-square"
                />
                <CancelButton
                  onClick={handleCancel}
                  size="sm"
                  disabled={loading}
                  aria-label="Cancel"
                  className="z-50 relative h-[32px] w-[32px] min-w-0 aspect-square"
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
      {/* No error balloon here, it's now inside the input column */}
    </div>
  );
}
