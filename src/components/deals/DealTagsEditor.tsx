import React, { useEffect, useState, useRef } from "react";
import {
  getDealTags,
  getExistingTags,
  addDealTag,
  deleteDealTag,
} from "../../features/dealTags/dealTagsAPI";

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
  const [dropdown, setDropdown] = useState<string[]>([]);
  const [dropdownIndex, setDropdownIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
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
    if (input) {
      const filtered = existingTags.filter(
        (t) =>
          t.toLowerCase().includes(input.toLowerCase()) &&
          !tags.some((tag) => tag.tag === t),
      );
      setDropdownVisible(true);
      setDropdown(filtered);
      setDropdownIndex(filtered.length > 0 ? 0 : -1);
    } else {
      const filtered = existingTags.filter(
        (t) => !tags.some((tag) => tag.tag === t),
      );
      setDropdown(filtered);
      setDropdownIndex(filtered.length > 0 ? 0 : -1);
    }
  }, [input, existingTags, tags]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddTag = async (tag: string, closeDropdown = false) => {
    if (!tag.trim() || tags.some((t) => t.tag === tag)) return;
    setLoading(true);
    const newTag = await addDealTag({ id: 0, tag, dealId });
    setTags([...tags, { id: newTag.id, tag: newTag.tag! }]);
    setInput("");
    setLoading(false);
    //if (closeDropdown) setDropdown([]);
    if (closeDropdown) setDropdownVisible(false);
    inputRef.current?.focus();
  };

  const handleDeleteTag = async (id: number) => {
    setLoading(true);
    await deleteDealTag(id);
    setTags(tags.filter((t) => t.id !== id));
    setLoading(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "Down") {
      e.preventDefault();
      if (dropdown.length > 0) {
        setDropdownVisible(true);
        setDropdownIndex((prev) => (prev < dropdown.length - 1 ? prev + 1 : 0));
      }
      return;
    }
    if (e.key === "ArrowUp" || e.key === "Up") {
      e.preventDefault();
      if (dropdown.length > 0) {
        setDropdownIndex((prev) => (prev > 0 ? prev - 1 : dropdown.length - 1));
      }
      return;
    }
    if (dropdown.length > 0 && e.key === "Enter" && dropdownIndex >= 0) {
      e.preventDefault();
      handleAddTag(dropdown[dropdownIndex], true);
      return;
    }
    if (e.key === "Enter" && input.trim()) {
      handleAddTag(input.trim(), true);
      return;
    }
    if (e.key === "Escape") {
      onClose();
      return;
    }
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
        <div className="relative" style={{ minWidth: 0, flex: 1 }}>
          <input
            ref={inputRef}
            className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            placeholder="Add or search tag..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          {dropdown.length > 0 && dropdownVisible && (
            <div className="absolute left-0 mt-1 w-48 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg max-h-40 overflow-y-auto">
              {dropdown.map((tag, idx) => (
                <div
                  key={tag}
                  className={`px-3 py-1 cursor-pointer text-sm ${dropdownIndex === idx ? "bg-purple-100 dark:bg-purple-800" : "hover:bg-purple-100 dark:hover:bg-purple-800"}`}
                  onClick={() => handleAddTag(tag, true)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm whitespace-nowrap"
        >
          Close
        </button>
      </div>
    </div>
  );
};
