import React from "react";
import { AiMetadataItem } from "./AiMetadataItem";

interface MetadataItem {
  id: number;
  key?: string | null;
  type?: string | null;
}

interface AiMetadataListPanelProps {
  items: MetadataItem[];
  selectedMetadataId: number | null;
  onSelectMetadata: (id: number) => void;
}

export const AiMetadataListPanel: React.FC<AiMetadataListPanelProps> = ({
  items,
  selectedMetadataId,
  onSelectMetadata,
}) => (
  <div className="flex flex-col h-full min-h-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
    <div className="flex-1 min-h-0 overflow-y-auto">
      {items.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">
          No AI metadata items match filters.
        </div>
      ) : (
        items.map((item) => (
          <AiMetadataItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedMetadataId}
            onClick={() => onSelectMetadata(item.id)}
          />
        ))
      )}
    </div>
  </div>
);
