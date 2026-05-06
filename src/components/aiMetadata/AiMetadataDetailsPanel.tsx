import React from "react";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import EditableStringField from "../common/inputs/EditableStringField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";

interface MetadataItem {
  id: number;
  type?: string | null;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

interface AiMetadataDetailsPanelProps {
  selectedMetadata: MetadataItem | null;
  allMetadata: MetadataItem[];
  onRefresh: () => void;
}

export const AiMetadataDetailsPanel: React.FC<AiMetadataDetailsPanelProps> = ({
  selectedMetadata,
  allMetadata,
  onRefresh,
}) => (
  <div className="flex flex-col h-full min-h-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
    <div className="flex-1 min-h-0 p-3 overflow-y-auto">
      {selectedMetadata ? (
        <div className="flex flex-col h-full gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase">Type</div>
              <AutocompleteEditableStringField
                value={selectedMetadata.type}
                entity="AiMetadata"
                field="type"
                id={selectedMetadata.id}
                label=""
                options={Array.from(
                  new Set(
                    allMetadata
                      .map((item) => item.type || "")
                      .filter(Boolean) as string[],
                  ),
                )}
                onUpdated={onRefresh}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Key</div>
              <AutocompleteEditableStringField
                value={selectedMetadata.key}
                entity="AiMetadata"
                field="key"
                id={selectedMetadata.id}
                label=""
                options={Array.from(
                  new Set(
                    allMetadata
                      .map((item) => item.key || "")
                      .filter(Boolean) as string[],
                  ),
                )}
                onUpdated={onRefresh}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Version</div>
              <EditableStringField
                value={selectedMetadata.version}
                entity="AiMetadata"
                field="version"
                id={selectedMetadata.id}
                label=""
                onUpdated={onRefresh}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <EditableMultilineStringField
              value={selectedMetadata.text}
              entity="AiMetadata"
              field="text"
              id={selectedMetadata.id}
              label="Metadata text"
              rows={12}
              onUpdated={onRefresh}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-sm text-gray-500">
          Select an AI metadata item from the list.
        </div>
      )}
    </div>
  </div>
);
