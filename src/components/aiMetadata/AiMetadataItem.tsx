import React from "react";

export interface AiMetadataItemProps {
  item: {
    id: number;
    key?: string | null;
    type?: string | null;
  };
  isSelected: boolean;
  onClick: () => void;
}

const AiMetadataItemComponent: React.FC<AiMetadataItemProps> = ({
  item,
  isSelected,
  onClick,
}) => (
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
      {item.key || "Untitled"}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400">
      Type: {item.type || "n/a"}
    </div>
  </button>
);

export const AiMetadataItem = React.memo(
  AiMetadataItemComponent,
  (prev, next) =>
    prev.item === next.item &&
    prev.isSelected === next.isSelected &&
    prev.onClick === next.onClick,
);
