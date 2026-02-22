import React, { useState, useRef, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";
import CloseButton from "../buttons/CloseButton";
import EditButton from "../buttons/EditButton";
import InputLabel from "./InputLabel";

interface AutocompleteStringListEditorProps {
  value: string[];
  suggestions: string[];
  editMode: boolean;
  onChange: (tags: string[]) => void;
  onClose?: () => void;
  className?: string;
  label?: string;
}

export default function AutocompleteStringListEditor({
  value,
  suggestions,
  onChange,
  onClose,
  className = "",
  label = "",
}: AutocompleteStringListEditorProps) {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>(value);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(value);
  }, [value]);

  useEffect(() => {
    if (editMode) inputRef.current?.focus();
  }, [editMode]);

  function handleAddTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const newTags = [...tags, trimmed];
    setTags(newTags);
    setInput("");
    setError(null);
    onChange(newTags);
  }

  function handleDeleteTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setError(null);
    onChange(newTags);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(input);
    } else if (e.key === "Escape" && onClose) {
      e.preventDefault();
      onClose();
    }
  }

  function handleEdit(): void {
    setEditMode(true);
  }

  function handleClose(): void {
    setEditMode(false);
    onClose?.();
  }
  function drawTags() {
    const tagClass =
      "flex items-center px-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm";
    const tagsDivClass = `flex flex-wrap gap-2 mb-2 ${className} ${editMode ? "z-50 relative" : ""}`;
    return (
      <div className={tagsDivClass}>
        <InputLabel label={label} />
        {tags.map((tag) => (
          <span key={tag} className={tagClass}>
            {tag}
            {editMode ? (
              <button
                onClick={() => handleDeleteTag(tag)}
                className="ml-1 text-xs text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            ) : (
              <span className="w-3"></span>
            )}
          </span>
        ))}
        {editMode || (
          <EditButton onClick={handleEdit} size="sm" aria-label="Edit" />
        )}
      </div>
    );
  }
  if (!editMode) {
    return drawTags();
  }

  return (
    <>
      {/* Overlay to block all other interactions */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-10"
        style={{ pointerEvents: "auto" }}
      />
      {drawTags()}
      <div className="flex items-center gap-2 mt-2 z-50 relative">
        <div style={{ minWidth: 0, flex: 1 }}>
          <AutocompleteInput
            inputRef={inputRef}
            value={input}
            onChange={setInput}
            suggestions={suggestions.filter((t) => !tags.includes(t))}
            placeholder="Add or search tag..."
            onSelect={handleAddTag}
            onEnter={handleAddTag}
            onEscapePressed={handleClose}
            onKeyDown={handleInputKeyDown}
            className=" margin-left-sm w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        <CloseButton onClick={handleClose} className="ml-2" />
      </div>
    </>
  );
}
