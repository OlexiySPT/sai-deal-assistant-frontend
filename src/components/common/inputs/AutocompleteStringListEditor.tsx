import React, { useState, useRef, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";
import CloseButton from "../buttons/CloseButton";
import EditButton from "../buttons/EditButton";
import InputLabel from "./InputLabel";
import EditablePartFrame, {
  EditablePartFrameChildProps,
} from "./frames/EditablePartFrame";

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
  const [addedTags, setAddedTags] = useState<string[]>();
  const [deletedTags, setDeletedTags] = useState<string[]>();
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
    setAddedTags((prev) => (prev ? [...prev, trimmed] : [trimmed]));
    setTags(newTags);
    setInput("");
    setError(null);
    onChange(newTags);
  }

  function handleDeleteTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setDeletedTags((prev) => (prev ? [...prev, tag] : [tag]));
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

  function handleSave() {
    // In this component, changes are immediately propagated via onChange, so save just exits edit mode
    setEditMode(false);
    onClose?.();
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
      </div>
    );
  }
  return (
    <EditablePartFrame
      readView={function (props: EditablePartFrameChildProps): React.ReactNode {
        return <>{drawTags()}</>;
      }}
      editView={function (props: EditablePartFrameChildProps): React.ReactNode {
        return (
          <>
            {drawTags()}
            <div
              className="absolute left-0 w-fulltext-xs rounded px-3 py-1 shadow-lg animate-fade-in"
              style={{ top: "calc(100% + 0.5rem)" }}
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
                onKeyDown={handleInputKeyDown}
                className=" margin-left-sm w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>
          </>
        );
      }}
      onSave={function (): void {
        handleSave();
      }}
      onCancel={function (): void {
        handleClose();
      }}
      label={label}
      className={className}
      size={"sm"}
    />
  );
}
