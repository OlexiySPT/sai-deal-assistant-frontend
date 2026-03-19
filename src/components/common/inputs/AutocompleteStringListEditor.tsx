import React, { useState, useRef, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";
import InputLabel from "./InputLabel";
import AddButton from "../buttons/AddButton";
import OkButton from "../buttons/OkButton";
import CancelButton from "../buttons/CancelButton";
import { modal } from "../../cva/modal.cva";

interface AutocompleteStringListEditorProps {
  value: string[];
  suggestions: string[];
  editMode: boolean;
  onDelete: (tag: string) => void;
  onAdd: (tag: string) => void;
  className?: string;
  label?: string;
}

export default function AutocompleteStringListEditor({
  value,
  suggestions,
  onDelete,
  onAdd,
  className = "",
  label = "",
}: AutocompleteStringListEditorProps) {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>(value);
  const [error, setError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(value);
  }, [value]);

  useEffect(() => {
    if (addMode) inputRef.current?.focus();
  }, [addMode]);

  function handleAddTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const newTags = [...tags, trimmed];
    setTags(newTags);
    setInput("");
    setError(null);
    onAdd(trimmed);
    setAddMode(false);
  }

  function handleDeleteTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setError(null);
    onDelete(tag);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(input);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setAddMode(false);
    }
  }

  function handleAdd(): void {
    setInput("");
    setAddMode(true);
  }

  function handleClose(): void {
    setAddMode(false);
  }

  const tagClass =
    "flex items-center px-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm";
  const tagsDivClass = `flex flex-wrap gap-2 mb-2 ${className}`;
  return (
    <>
      <div className={tagsDivClass}>
        {label && <InputLabel label={label} />}
        {tags.map((tag) => (
          <span key={tag} className={tagClass}>
            {tag}
            <button
              onClick={() => handleDeleteTag(tag)}
              className="ml-1 text-xs text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
        {addMode ? (
          <>
            {/* Overlay to block all other interactions */}
            <div
              className={modal({ part: "overlay" })}
              style={{ pointerEvents: "auto" }}
            />
            <div
              className={`${modal({ part: "content" })} flex items-center gap-1`}
            >
              <AutocompleteInput
                inputRef={inputRef}
                value={input}
                onChange={setInput}
                suggestions={suggestions.filter((t) => !tags.includes(t))}
                placeholder="Add or search tag..."
                onSelect={handleAddTag}
                onEnter={handleAddTag}
                onEscapePressed={handleClose}
                showAllOnEmpty={true}
                className="h-7 border rounded px-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              />
              <OkButton
                onClick={() => handleAddTag(input)}
                disabled={!input.trim() || tags.includes(input.trim())}
              />
              <CancelButton onClick={handleClose} />
            </div>
          </>
        ) : (
          <AddButton onClick={handleAdd} />
        )}
      </div>
    </>
  );
}
