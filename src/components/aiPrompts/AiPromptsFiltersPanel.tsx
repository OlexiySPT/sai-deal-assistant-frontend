import React from "react";
import AddButton from "../common/buttons/AddButton";
import Button from "../common/buttons/Button";

interface AiPromptsFiltersPanelProps {
  keyFilter: string;
  versionFilter: string;
  onKeyFilterChange: (value: string) => void;
  onVersionFilterChange: (value: string) => void;
  onClearAll: () => void;
  onAddPrompt: () => void;
}

export const AiPromptsFiltersPanel: React.FC<AiPromptsFiltersPanelProps> = ({
  keyFilter,
  versionFilter,
  onKeyFilterChange,
  onVersionFilterChange,
  onClearAll,
  onAddPrompt,
}) => (
  <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-1.5">
      <div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          AI Prompts
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Filters, list and details
        </div>
      </div>
      <div className="flex gap-2">
        <AddButton onClick={onAddPrompt} />
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
          placeholder="Search by key..."
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
      <div className="relative">
        <input
          type="text"
          placeholder="Search by version..."
          value={versionFilter}
          onChange={(e) => onVersionFilterChange(e.target.value)}
          className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        {versionFilter && (
          <Button
            type="button"
            className="!px-0 !py-0 !border-none !bg-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
            style={{ padding: 0 }}
            aria-label="Clear version filter"
            onClick={() => onVersionFilterChange("")}
          >
            ×
          </Button>
        )}
      </div>
    </div>
  </div>
);
