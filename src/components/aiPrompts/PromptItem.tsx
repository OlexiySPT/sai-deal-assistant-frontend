import React from "react";

export interface PromptItemProps {
  prompt: {
    id: number;
    key?: string | null;
    version?: string | null;
    text?: string | null;
  };
  isSelected: boolean;
  onClick: () => void;
}

const getPromptTitle = (prompt: PromptItemProps["prompt"]) => {
  if (prompt.key) return prompt.key;
  if (prompt.text) return prompt.text.slice(0, 50);
  if (prompt.version) return `Version ${prompt.version}`;
  if (prompt.id !== undefined && prompt.id !== null)
    return `Prompt ${prompt.id}`;
  return "Untitled prompt";
};

const getPromptSubtitle = (prompt: PromptItemProps["prompt"]) => {
  if (prompt.version) return `Version: ${prompt.version}`;
  if (prompt.text) return prompt.text.slice(0, 50);
  if (prompt.key) return `Key: ${prompt.key}`;
  return "No details available";
};

const PromptItemComponent: React.FC<PromptItemProps> = ({
  prompt,
  isSelected,
  onClick,
}) => {
  const title = getPromptTitle(prompt);
  const subtitle = getPromptSubtitle(prompt);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-1 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
        {title}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {subtitle}
      </div>
    </button>
  );
};

export const PromptItem = React.memo(
  PromptItemComponent,
  (prev, next) =>
    prev.prompt === next.prompt &&
    prev.isSelected === next.isSelected &&
    prev.onClick === next.onClick,
);
