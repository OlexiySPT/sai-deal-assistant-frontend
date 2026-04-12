import React, { useState, useRef, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";
import InputLabel from "./InputLabel";
import AddButton from "../buttons/AddButton";
import { SizeType } from "../StylingUtil";
import EditablePartFrameBase from "./frames/EditablePartFrameBase";
import { input } from "../../cva/input-cva";
import { breadcrumb, breadcrumbsArea } from "../../cva/breadcrumbs-cva";

interface AutocompleteStringListEditorProps {
  value: string[];
  suggestions: string[];
  editMode: boolean;
  onDelete: (tag: string) => void;
  onAdd: (tag: string) => void;
  className?: string;
  label?: string;
  size?: SizeType;
  width?: string;
}

export default function AutocompleteStringListEditor({
  value,
  suggestions,
  onDelete,
  onAdd,
  className = "",
  label = "",
  size = "sm",
  width,
}: AutocompleteStringListEditorProps) {
  const [inputValue, setInputValue] = useState("");
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
    setInputValue("");
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
      handleAddTag(inputValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setAddMode(false);
    }
  }

  function handleAdd(): void {
    setInputValue("");
    setAddMode(true);
  }

  function handleClose(): void {
    setAddMode(false);
  }
  function editView() {
    return (
      <>
        <AutocompleteInput
          inputRef={inputRef}
          className={`${input({ size })} flex`}
          value={inputValue}
          onChange={setInputValue}
          suggestions={suggestions.filter((t) => !tags.includes(t))}
          placeholder="Add or search tag..."
          onSelect={handleAddTag}
          onEnter={handleAddTag}
          onEscapePressed={handleClose}
          showAllOnEmpty={true}
        />
      </>
    );
  }
  return (
    <>
      <div className={`${breadcrumbsArea({ size })} gap-1 ${className}`}>
        {label && <InputLabel label={label} size={size} />}
        {tags.map((tag) => (
          <span key={tag} className={`${breadcrumb({ size })} items-center`}>
            {tag}
            <button
              onClick={() => handleDeleteTag(tag)}
              className="ml-1 text-xs leading-none"
            >
              ×
            </button>
          </span>
        ))}
        {addMode ? (
          <div className="flex flex-nowrap items-center gap-1">
            <EditablePartFrameBase
              editMode={addMode}
              error={error}
              className={`w-auto flex-nowrap`}
              size={size}
              readView={() => null}
              editView={() => editView()}
              handleEdit={() => {}}
              handleCancel={() => handleClose()}
              handleSave={() => handleAddTag(inputValue)}
              width={width}
            />
          </div>
        ) : (
          <AddButton onClick={handleAdd} size="sm" />
        )}
      </div>
    </>
  );
}
