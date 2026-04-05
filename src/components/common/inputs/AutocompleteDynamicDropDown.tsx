import React, { useCallback, useEffect, useRef, useState } from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { SizeType } from "../StylingUtil";
import { text } from "../../cva/text-cva";
import { input } from "../../cva/input-cva";

export interface DynamicDropdownQueryParams {
  Name?: string;
  SortBy?: string;
  SortDirection?: "Asc" | "Desc";
  Page?: number;
  PageSize?: number;
  SortDescending?: boolean;
}

export interface DynamicDropdownItemDto {
  id: number;
  name: string | null;
}

export interface DynamicDropdownQueryResult {
  totalItems: number;
  items: DynamicDropdownItemDto[] | null;
}

export type DynamicDropdownLoadOptions = (
  params?: DynamicDropdownQueryParams,
) => Promise<DynamicDropdownQueryResult>;

interface AutocompleteDynamicDropDownInputProps {
  value: string;
  onChange: (v: string) => void;
  loadOptions: DynamicDropdownLoadOptions;
  placeholder?: string;
  onSelect?: (item: DynamicDropdownItemDto) => void;
  onEnter?: (v: string) => void;
  onEnterPressed?: (v: string) => void;
  onEscapePressed?: () => void;
  className?: string;
  showAllOnEmpty?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  pageSize?: number;
  throttleMs?: number;
  minSearchLength?: number;
  sortBy?: string;
  sortDirection?: "Asc" | "Desc";
  buildParams?: (
    search: string,
    page: number,
    pageSize: number,
  ) => DynamicDropdownQueryParams;
}

export interface AutocompleteDynamicDropDownProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
  width?: string;
  loadOptions: DynamicDropdownLoadOptions;
  placeholder?: string;
  pageSize?: number;
  throttleMs?: number;
  minSearchLength?: number;
  showAllOnEmpty?: boolean;
  sortBy?: string;
  sortDirection?: "Asc" | "Desc";
  onOptionSelected?: (item: DynamicDropdownItemDto) => void;
  buildParams?: (
    search: string,
    page: number,
    pageSize: number,
  ) => DynamicDropdownQueryParams;
}

function getItemLabel(item: DynamicDropdownItemDto): string {
  const trimmedName = (item.name ?? "").trim();
  return trimmedName || `Item ${item.id}`;
}

function dedupeItems(
  items: DynamicDropdownItemDto[],
): DynamicDropdownItemDto[] {
  const seen = new Map<number, DynamicDropdownItemDto>();
  for (const item of items) {
    seen.set(item.id, item);
  }
  return Array.from(seen.values());
}

export function AutocompleteDynamicDropDownInput({
  value,
  onChange,
  loadOptions,
  placeholder,
  onSelect,
  onEnter,
  onEnterPressed,
  onEscapePressed,
  className,
  showAllOnEmpty = false,
  inputRef,
  pageSize = 20,
  throttleMs = 500,
  minSearchLength = 1,
  sortBy = "name",
  sortDirection = "Asc",
  buildParams,
}: AutocompleteDynamicDropDownInputProps) {
  const [items, setItems] = useState<DynamicDropdownItemDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownIndex, setDropdownIndex] = useState<number>(-1);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const requestTimerRef = useRef<number | null>(null);
  const suppressFetchRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const initialFocusRef = useRef(true);
  const lastSearchRef = useRef((value ?? "").trim());

  const hasMore = items.length < totalItems;

  const scrollHighlightedIntoView = useCallback((index: number) => {
    requestAnimationFrame(() => {
      const el = dropdownRef.current?.querySelector(
        `[data-index="${index}"]`,
      ) as HTMLElement | null;
      el?.scrollIntoView({ block: "nearest" });
    });
  }, []);

  const clearDropdown = useCallback(() => {
    setItems([]);
    setPage(1);
    setTotalItems(0);
    setDropdownIndex(-1);
    setDropdownVisible(false);
    setError(null);
  }, []);

  const requestOptions = useCallback(
    async (searchText: string, requestedPage: number, append: boolean) => {
      const normalizedSearch = searchText.trim();
      const canSearch =
        normalizedSearch.length >= minSearchLength ||
        (showAllOnEmpty && normalizedSearch.length === 0);

      if (!canSearch) {
        clearDropdown();
        return;
      }

      const requestId = ++requestIdRef.current;
      lastSearchRef.current = normalizedSearch;
      setLoading(true);
      setError(null);
      setDropdownVisible(true);

      try {
        const params = buildParams
          ? buildParams(normalizedSearch, requestedPage, pageSize)
          : {
              Name: normalizedSearch || undefined,
              Page: requestedPage,
              PageSize: pageSize,
              SortBy: sortBy,
              SortDirection: sortDirection,
              SortDescending: sortDirection === "Desc",
            };

        const response = await loadOptions(params);

        if (requestId !== requestIdRef.current) {
          return;
        }

        const nextItems = Array.isArray(response?.items) ? response.items : [];
        setTotalItems(response?.totalItems ?? nextItems.length);
        setPage(requestedPage);
        setItems((current) =>
          append ? dedupeItems([...current, ...nextItems]) : nextItems,
        );
        setDropdownIndex((current) => {
          if (current >= 0) return current;
          return nextItems.length > 0 ? 0 : -1;
        });
      } catch (err: any) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setError(err?.message || "Failed to load suggestions");
        if (!append) {
          setItems([]);
          setDropdownIndex(-1);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [
      buildParams,
      clearDropdown,
      loadOptions,
      minSearchLength,
      pageSize,
      showAllOnEmpty,
      sortBy,
      sortDirection,
    ],
  );

  const scheduleRequest = useCallback(
    (searchText: string, requestedPage: number, append: boolean) => {
      if (requestTimerRef.current !== null) {
        window.clearTimeout(requestTimerRef.current);
      }

      requestTimerRef.current = window.setTimeout(() => {
        requestTimerRef.current = null;
        void requestOptions(searchText, requestedPage, append);
      }, throttleMs);
    },
    [requestOptions, throttleMs],
  );

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }

    if (!hasInteractedRef.current) {
      return;
    }

    scheduleRequest(value ?? "", 1, false);
  }, [scheduleRequest, value]);

  useEffect(() => {
    return () => {
      if (requestTimerRef.current !== null) {
        window.clearTimeout(requestTimerRef.current);
      }
    };
  }, []);

  const selectItem = (item: DynamicDropdownItemDto) => {
    suppressFetchRef.current = true;
    onChange(getItemLabel(item));
    onSelect?.(item);
    setDropdownVisible(false);
    setDropdownIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "Down") {
      e.preventDefault();
      hasInteractedRef.current = true;

      if (items.length === 0) {
        if (!loading) {
          scheduleRequest(value ?? "", 1, false);
        }
        return;
      }

      setDropdownVisible(true);
      setDropdownIndex((current) => {
        const nextIndex =
          current < 0 ? 0 : Math.min(current + 1, items.length - 1);
        scrollHighlightedIntoView(nextIndex);
        return nextIndex;
      });
      return;
    }

    if (e.key === "ArrowUp" || e.key === "Up") {
      e.preventDefault();
      if (items.length === 0) {
        return;
      }

      setDropdownVisible(true);
      setDropdownIndex((current) => {
        const nextIndex = current <= 0 ? 0 : current - 1;
        scrollHighlightedIntoView(nextIndex);
        return nextIndex;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (dropdownVisible && dropdownIndex >= 0 && items[dropdownIndex]) {
        selectItem(items[dropdownIndex]);
      } else if (!dropdownVisible && onEnterPressed) {
        onEnterPressed(value);
      } else if (onEnter) {
        onEnter(value);
      }
      return;
    }

    if (e.key === "Escape") {
      if (!dropdownVisible && onEscapePressed) {
        onEscapePressed();
      }
      setDropdownVisible(false);
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => setDropdownVisible(false), 100);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 12;

    if (nearBottom && hasMore && !loading) {
      scheduleRequest(lastSearchRef.current, page + 1, true);
    }
  };

  return (
    <div className="relative w-full" style={{ minWidth: 0 }}>
      <input
        ref={inputRef}
        className={className}
        placeholder={placeholder}
        autoFocus
        value={value}
        onChange={(e) => {
          hasInteractedRef.current = true;
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (initialFocusRef.current) {
            initialFocusRef.current = false;
            return;
          }

          hasInteractedRef.current = true;
          if (items.length > 0) {
            setDropdownVisible(true);
            return;
          }
          if (showAllOnEmpty && (value ?? "").trim().length === 0) {
            scheduleRequest("", 1, false);
          }
        }}
        onMouseDown={() => {
          initialFocusRef.current = false;
          hasInteractedRef.current = true;
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />

      {dropdownVisible && (items.length > 0 || loading || error) && (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute left-0 mt-1 w-full z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg max-h-56 overflow-y-auto"
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              data-index={idx}
              className={`px-3 py-1 cursor-pointer text-sm ${dropdownIndex === idx ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              onMouseDown={() => selectItem(item)}
            >
              {getItemLabel(item)}
            </div>
          ))}

          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-300">
              Loading...
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-300">
              No matches found
            </div>
          )}

          {error && (
            <div className="px-3 py-2 text-xs text-red-600 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AutocompleteDynamicDropDown({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
  width,
  loadOptions,
  placeholder,
  pageSize = 20,
  throttleMs = 500,
  minSearchLength = 1,
  showAllOnEmpty = false,
  sortBy = "name",
  sortDirection = "Asc",
  onOptionSelected,
  buildParams,
}: AutocompleteDynamicDropDownProps) {
  return (
    <EditableFieldFrame
      value={value}
      entity={entity}
      field={field}
      id={id}
      validation={validation}
      onUpdated={onUpdated}
      label={label}
      size={size}
      valueType={EditableFieldValueType.String}
      width={width}
      readView={function (): React.ReactNode {
        if (!value) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
        }
        return <span className={text({ style: "value", size })}>{value}</span>;
      }}
      editView={function ({
        inputValue,
        setInputValue,
        handleCancel,
        handleSave,
      }: EditableFieldFrameChildProps): React.ReactNode {
        return (
          <AutocompleteDynamicDropDownInput
            className={input({ size })}
            value={inputValue}
            onChange={setInputValue}
            loadOptions={loadOptions}
            placeholder={placeholder}
            onSelect={onOptionSelected}
            showAllOnEmpty={showAllOnEmpty}
            pageSize={pageSize}
            throttleMs={throttleMs}
            minSearchLength={minSearchLength}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onEnterPressed={handleSave}
            onEscapePressed={handleCancel}
            buildParams={buildParams}
          />
        );
      }}
    />
  );
}
