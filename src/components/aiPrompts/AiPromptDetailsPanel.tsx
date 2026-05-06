import React from "react";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import EditableStringField from "../common/inputs/EditableStringField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";

interface PromptDetails {
  id: number;
  key?: string | null;
  version?: string | null;
  text?: string | null;
}

interface AiPromptDetailsPanelProps {
  selectedPrompt: PromptDetails | null;
  allPrompts: PromptDetails[];
  onRefresh: () => void;
}

export const AiPromptDetailsPanel: React.FC<AiPromptDetailsPanelProps> = ({
  selectedPrompt,
  allPrompts,
  onRefresh,
}) => (
  <div className="flex flex-col h-full min-h-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
    <div className="flex-1 min-h-0 p-3 overflow-y-auto">
      {selectedPrompt ? (
        <div className="flex flex-col h-full gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase">Key</div>
              <AutocompleteEditableStringField
                value={selectedPrompt.key}
                entity="AiPrompt"
                field="key"
                id={selectedPrompt.id}
                label=""
                options={Array.from(
                  new Set(
                    allPrompts
                      .map((prompt) => prompt.key || "")
                      .filter(Boolean) as string[],
                  ),
                )}
                onUpdated={onRefresh}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Version</div>
              <EditableStringField
                value={selectedPrompt.version}
                entity="AiPrompt"
                field="version"
                id={selectedPrompt.id}
                label=""
                onUpdated={onRefresh}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <EditableMultilineStringField
              value={selectedPrompt.text}
              entity="AiPrompt"
              field="text"
              id={selectedPrompt.id}
              label="Prompt text"
              rows={12}
              onUpdated={onRefresh}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-sm text-gray-500">
          Select an AI prompt from the list.
        </div>
      )}
    </div>
  </div>
);
