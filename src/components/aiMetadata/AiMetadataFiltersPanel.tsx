import React from "react";
import AddButton from "../common/buttons/AddButton";
import Button from "../common/buttons/Button";

interface AiMetadataFiltersPanelProps {
  typeFilter: string;
  keyFilter: string;
  onTypeFilterChange: (value: string) => void;
  onKeyFilterChange: (value: string) => void;
  onClearAll: () => void;
  onAddMetadata: () => void;
}

export const AiMetadataFiltersPanel: React.FC<AiMetadataFiltersPanelProps> = ({
  typeFilter,
  keyFilter,
  onTypeFilterChange,
  onKeyFilterChange,
  onClearAll,
  onAddMetadata,
}) => (
  <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-1.5">
      <div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          AI Metadata
        </h2>
      </div>
      <div className="flex gap-2">
        <AddButton onClick={onAddMetadata} />
        <Button
          type="button"
          className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>
    </div>
    <div className="space-y-1.5">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by type..."
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        {typeFilter && (
          <Button
            type="button"
            className="!px-0 !py-0 !border-none !bg-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
            style={{ padding: 0 }}
            aria-label="Clear type filter"
            onClick={() => onTypeFilterChange("")}
          >
            ×
          </Button>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Key..."
          value={keyFilter}
          onChange={(e) => onKeyFilterChange(e.target.value)}
          className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        {keyFilter && (
          <Button
            type="button"
            className="!px-0 !py-0 !border-none !bg-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
            style={{ padding: 0 }}
            aria-label="Clear key filter"
            onClick={() => onKeyFilterChange("")}
          >
            ×
          </Button>
        )}
      </div>
    </div>
  </div>
);
