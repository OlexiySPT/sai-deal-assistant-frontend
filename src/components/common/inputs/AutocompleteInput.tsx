import React, { useEffect, useState, useRef } from "react";

interface AutocompleteInputProps {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  onSelect?: (v: string) => void; // selection from list
  onEnter?: (v: string) => void; // user pressed Enter (legacy)
  onEnterPressed?: (v: string) => void; // Enter pressed when dropdown is not visible
  onEscapePressed?: () => void; // Escape pressed when dropdown is not visible
  className?: string;
  showAllOnEmpty?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  onSelect,
  onEnter,
  onEnterPressed,
  onEscapePressed,
  className,
  showAllOnEmpty = false,
  inputRef,
}: AutocompleteInputProps) {
  const [dropdown, setDropdown] = useState<string[]>([]);
  const [dropdownIndex, setDropdownIndex] = useState<number>(-1);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // When true, the next value change should NOT reopen the dropdown (used after selections)
  const suppressReopenRef = useRef(false);
  // Tracks whether the user has manually edited (typed) in the input during this interaction
  const hasEditedRef = useRef(false);
  // True only on the very first mount; used to prevent auto-opening the dropdown when component just appears
  const initialMountRef = useRef(true);
  // Ref to the dropdown container so we can scroll highlighted items into view
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If a selection just occurred, suppress reopening the dropdown on the subsequent value change
    if (suppressReopenRef.current) {
      suppressReopenRef.current = false;
      setDropdown([]);
      setDropdownIndex(-1);
      setDropdownVisible(false);
      return;
    }

    const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
    const filtered = value
      ? safeSuggestions.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase()),
        )
      : showAllOnEmpty || (hasEditedRef.current && value === "")
        ? safeSuggestions
        : [];

    setDropdown(filtered);
    setDropdownIndex(filtered.length > 0 ? 0 : -1);

    // Do not auto-open dropdown on initial mount if the user hasn't interacted yet
    if (initialMountRef.current && !hasEditedRef.current) {
      setDropdownVisible(false);
    } else {
      setDropdownVisible(filtered.length > 0);
    }
  }, [value, suggestions, showAllOnEmpty]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const safeDropdown = Array.isArray(dropdown) ? dropdown : [];
    const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
    if (e.key === "ArrowDown" || e.key === "Down") {
      // mark that user interacted via keyboard
      initialMountRef.current = false;
      e.preventDefault();
      if (safeDropdown.length > 0) {
        setDropdownVisible(true);
        const current = dropdownIndex;
        // Move down but do not wrap when reaching the last item
        const newIndex =
          current < 0
            ? 0
            : current < safeDropdown.length - 1
              ? current + 1
              : current;
        setDropdownIndex(newIndex);
        // Scroll the newly highlighted item into view
        requestAnimationFrame(() => {
          const el = dropdownRef.current?.querySelector(
            `[data-index="${newIndex}"]`,
          ) as HTMLElement | null;
          el?.scrollIntoView({ block: "nearest" });
        });
      } else if (safeSuggestions.length > 0) {
        // Open dropdown when user presses Down (even if input is empty and showAllOnEmpty is false)
        setDropdown(safeSuggestions);
        const newIndex = 0;
        setDropdownIndex(newIndex);
        setDropdownVisible(true);
        requestAnimationFrame(() => {
          const el = dropdownRef.current?.querySelector(
            `[data-index="${newIndex}"]`,
          ) as HTMLElement | null;
          el?.scrollIntoView({ block: "nearest" });
        });
      }
      return;
    }
    if (e.key === "ArrowUp" || e.key === "Up") {
      // mark that user interacted via keyboard
      initialMountRef.current = false;
      e.preventDefault();
      if (dropdown.length > 0) {
        const current = dropdownIndex;
        // Move up but do not wrap when reaching the first item
        const newIndex =
          current < 0
            ? dropdown.length - 1
            : current > 0
              ? current - 1
              : current;
        setDropdownIndex(newIndex);
        requestAnimationFrame(() => {
          const el = dropdownRef.current?.querySelector(
            `[data-index="${newIndex}"]`,
          ) as HTMLElement | null;
          el?.scrollIntoView({ block: "nearest" });
        });
      } else if (suggestions.length > 0) {
        // Open dropdown and move to last item on Up
        setDropdown(suggestions);
        const newIndex = suggestions.length - 1;
        setDropdownIndex(newIndex);
        setDropdownVisible(true);
        requestAnimationFrame(() => {
          const el = dropdownRef.current?.querySelector(
            `[data-index="${newIndex}"]`,
          ) as HTMLElement | null;
          el?.scrollIntoView({ block: "nearest" });
        });
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (dropdown.length > 0 && dropdownIndex >= 0) {
        const selected = dropdown[dropdownIndex];
        // Prevent the value-change effect from reopening the dropdown
        suppressReopenRef.current = true;
        if (onSelect) onSelect(selected);
        onChange(selected);
        setDropdown([]);
        setDropdownIndex(-1);
        setDropdownVisible(false);
      } else if (!dropdownVisible && onEnterPressed) {
        onEnterPressed(value);
      } else if (onEnter) {
        // For Enter without a highlighted dropdown item, similarly suppress reopen
        suppressReopenRef.current = true;
        onEnter(value);
        setDropdown([]);
        setDropdownIndex(-1);
        setDropdownVisible(false);
      }
      return;
    }
    if (e.key === "Escape") {
      if (!dropdownVisible && onEscapePressed) {
        onEscapePressed();
      }
      setDropdownVisible(false);
      return;
    }
  };

  // Delay the blur close slightly so clicks on items register (onMouseDown is used for items)
  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 100);
  };

  return (
    <div className="relative" style={{ minWidth: 0 }}>
      <input
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          // mark that the user has edited the input (typing)
          hasEditedRef.current = true;
          initialMountRef.current = false;
          onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onMouseDown={() => {
          // user interaction via mouse counts as interaction
          initialMountRef.current = false;
        }}
        onFocus={() => {
          // don't open dropdown automatically if component just mounted and user hasn't interacted yet
          if (initialMountRef.current && !hasEditedRef.current) return;
          setDropdownVisible(
            dropdown.length > 0 ||
              (value === "" && hasEditedRef.current && suggestions.length > 0),
          );
        }}
        onBlur={handleBlur}
      />
      {dropdown.length > 0 && dropdownVisible && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-1 w-full z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg max-h-40 overflow-y-auto"
        >
          {dropdown.map((s, idx) => (
            <div
              key={s}
              data-index={idx}
              className={`px-3 py-1 cursor-pointer text-sm ${dropdownIndex === idx ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              onMouseDown={() => {
                // Prevent the value-change effect from reopening the dropdown
                suppressReopenRef.current = true;
                if (onSelect) onSelect(s);
                onChange(s);
                setDropdown([]);
                setDropdownIndex(-1);
                setDropdownVisible(false);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutocompleteInput;
