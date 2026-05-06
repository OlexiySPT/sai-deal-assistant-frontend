import React, { useState, useRef, useEffect, useCallback } from "react";
import CopyToClipboardButton from "../buttons/CopyToClipboardButton";
import FullScreenButton from "../buttons/FullScreenButton";
import EditButton from "../buttons/EditButton";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import InputLabel from "./InputLabel";

interface MultilineStringEditorProps {
  value: string | null | undefined;
  label?: string;
  rows?: number;
  className?: string;
  onSave: (value: string) => Promise<void>;
}

const fullScreenStyles: React.CSSProperties = {
  width: "80vw",
  height: "80vh",
  maxWidth: "80vw",
  maxHeight: "80vh",
  backgroundColor:
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "#1e293b"
      : "#f0f4ff",
  border:
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "2px solid #3b82f6"
      : "2px solid #2563eb",
  padding: "8px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
};

export default function MultilineStringEditor({
  value,
  label,
  rows = 2,
  className = "",
  onSave,
}: MultilineStringEditorProps) {
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave(inputValue);
      setEditMode(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || err?.message || "Error saving text",
      );
    } finally {
      setLoading(false);
    }
  };

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el && !editMode) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [editMode]);

  useEffect(() => {
    if (!editMode) {
      setInputValue(value ?? "");
    }
  }, [value, editMode]);

  useEffect(() => {
    autoResize();
  }, [value, editMode, autoResize]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {!editMode ? (
        <>
          <div className="flex items-center justify-between mb-1">
            <InputLabel label={label} />
            <div className="flex ml-auto gap-1 items-center">
              <CopyToClipboardButton
                size="sm"
                className="align-middle"
                value={value ?? ""}
              />
              <FullScreenButton
                onClick={() => setIsFullScreen(!isFullScreen)}
                size="sm"
                aria-label="Full Screen"
              />
              <EditButton onClick={handleEdit} size="sm" aria-label="Edit" />
            </div>
          </div>
          {isFullScreen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
              style={{ pointerEvents: "auto" }}
            >
              <div className="shadow-2xl rounded-lg" style={fullScreenStyles}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {label}:
                  </span>
                  <div className="flex gap-1 items-center">
                    <CopyToClipboardButton
                      size="sm"
                      className="align-middle"
                      value={value ?? ""}
                    />
                    <FullScreenButton
                      onClick={() => setIsFullScreen(false)}
                      size="sm"
                      aria-label="Exit Full Screen"
                    />
                  </div>
                </div>
                <textarea
                  className="input input-sm border rounded px-2 py-1 w-full resize-none flex-1 text-base"
                  value={value ?? ""}
                  disabled
                  readOnly
                  style={{
                    minHeight: "calc(80vh - 60px)",
                    maxHeight: "calc(80vh - 60px)",
                    fontSize: "1rem",
                    backgroundColor:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#1e293b"
                        : "#f0f4ff",
                    color:
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#f1f5f9"
                        : undefined,
                    borderColor: "#3b82f6",
                    cursor: "default",
                  }}
                />
              </div>
            </div>
          )}
          {!isFullScreen && (
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
              <textarea
                ref={textareaRef}
                className="input input-sm border rounded px-2 py-1 w-full resize-none bg-transparent text-gray-900 dark:text-gray-100"
                value={value ?? ""}
                disabled
                style={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                  color: value ? undefined : "#9ca3af",
                  cursor: "pointer",
                  overflow: "hidden",
                  minHeight: `${Math.max(rows, 2) * 1.5}em`,
                }}
                title={value ?? ""}
                onClick={handleEdit}
                readOnly
                autoFocus
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-10"
            style={{ pointerEvents: "auto" }}
          />
          <div
            className={
              isFullScreen
                ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
                : undefined
            }
            style={isFullScreen ? { pointerEvents: "auto" } : undefined}
          >
            <div
              className={
                "flex flex-col flex-1 min-w-0 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-1 z-50 relative" +
                (isFullScreen ? " shadow-2xl rounded-lg" : "")
              }
              style={isFullScreen ? fullScreenStyles : undefined}
            >
              <div
                className={
                  "flex items-center justify-between mb-1 z-50 relative"
                }
                style={
                  isFullScreen
                    ? {
                        background: "transparent",
                        fontSize: "1.1rem",
                      }
                    : undefined
                }
              >
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {label}:
                </span>
                <div className="flex gap-1">
                  <FullScreenButton
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    size="sm"
                    aria-label="Full Screen"
                  />
                  <OkButton onClick={handleSave} size="sm" aria-label="Save" />
                  <CancelButton
                    onClick={handleCancel}
                    size="sm"
                    aria-label="Cancel"
                  />
                </div>
              </div>
              <textarea
                ref={textareaRef}
                className={
                  "input input-sm border rounded px-2 py-1 w-full resize-none" +
                  (isFullScreen ? " flex-1 text-base" : "")
                }
                rows={rows}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoFocus
                style={
                  isFullScreen
                    ? {
                        minHeight: "calc(80vh - 60px)",
                        maxHeight: "calc(80vh - 60px)",
                        fontSize: "1rem",
                        backgroundColor:
                          typeof window !== "undefined" &&
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#1e293b"
                            : "#f0f4ff",
                        color:
                          typeof window !== "undefined" &&
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#f1f5f9"
                            : undefined,
                        borderColor: "#3b82f6",
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </>
      )}
      {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
    </div>
  );
}
