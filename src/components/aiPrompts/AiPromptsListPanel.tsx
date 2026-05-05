import React from "react";
import { PromptItem } from "./PromptItem";

interface AiPromptsListPanelProps {
  items: Array<{
    id: number;
    key?: string | null;
    version?: string | null;
  }>;
  selectedPromptId: number | null;
  onSelectPrompt: (id: number) => void;
}

export const AiPromptsListPanel: React.FC<AiPromptsListPanelProps> = ({
  items,
  selectedPromptId,
  onSelectPrompt,
}) => (
  <div className="flex flex-col h-full min-h-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
    <div className="flex-1 min-h-0 overflow-y-auto">
      {items.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">
          No AI prompts match filters.
        </div>
      ) : (
        items.map((prompt) => (
          <PromptItem
            key={prompt.id}
            prompt={prompt}
            isSelected={prompt.id === selectedPromptId}
            onClick={() => onSelectPrompt(prompt.id)}
          />
        ))
      )}
    </div>
  </div>
);
