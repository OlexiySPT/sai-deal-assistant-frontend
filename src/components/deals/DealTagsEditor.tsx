import React, { useEffect, useState, useRef } from "react";
import {
  getDealTags,
  getExistingTags,
  addDealTag,
  deleteDealTag,
  clearExistingTagsCache,
} from "../../features/dealTags/dealTagsAPI";
import AutocompleteInput from "../common/inputs/AutocompleteInput";
import CloseButton from "../common/buttons/CloseButton";

interface DealTagsEditorProps {
  dealId: number;
  onClose: () => void;
}

export const DealTagsEditor: React.FC<DealTagsEditorProps> = ({
  dealId,
  onClose,
}) => {
  const [tags, setTags] = useState<{ id: number; tag: string }[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    getDealTags(dealId).then((data) => {
      setTags(
        data.filter((t) => t.tag).map((t) => ({ id: t.id, tag: t.tag! })),
      );
      setLoading(false);
    });
    getExistingTags().then(setExistingTags);
  }, [dealId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddTag = async (tag: string, closeDropdown = false) => {
    if (!tag.trim() || tags.some((t) => t.tag === tag)) return;
    setLoading(true);
    setError(null);
    try {
      const newTag = await addDealTag({ id: 0, tag, dealId });
      setTags((prev) => [...prev, { id: newTag.id, tag: newTag.tag! }]);
      // Update existing tags list so the suggestion set reflects the new tag immediately
      setExistingTags((prev) => (newTag.tag ? [newTag.tag, ...prev] : prev));
      // clear the cache so future calls will re-fetch if needed
      try {
        clearExistingTagsCache();
      } catch (e) {
        /* ignore */
      }
      setInput("");
    } catch (err: any) {
      console.error("Failed to add tag", err);
      setError(err?.message || "Failed to add tag");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTag = async (id: number) => {
    setLoading(true);
    await deleteDealTag(id);
    setTags(tags.filter((t) => t.id !== id));
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm"
          >
            {tag.tag}
            <button
              onClick={() => handleDeleteTag(tag.id)}
              className="ml-1 text-xs text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div style={{ minWidth: 0, flex: 1 }}>
          <AutocompleteInput
            inputRef={inputRef}
            value={input}
            onChange={(v) => setInput(v)}
            suggestions={existingTags.filter(
              (t) => !tags.some((tag) => tag.tag === t),
            )}
            placeholder="Add or search tag..."
            onSelect={(s) => handleAddTag(s, true)}
            onEnter={(v) => handleAddTag(v.trim(), true)}
            className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        <CloseButton onClick={onClose} className="ml-2" />
      </div>
    </div>
  );
};
