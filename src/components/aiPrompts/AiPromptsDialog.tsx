import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../common/Dialog";
import AddButton from "../common/buttons/AddButton";
import MultilineStringEditor from "../common/inputs/MultilineStringEditor";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import EditableStringField from "../common/inputs/EditableStringField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";
import {
  fetchAiPrompts,
  createAiPrompt,
  selectAiPrompts,
  selectAiPromptsListLoading,
  selectAiPromptsTotalItems,
} from "../../features/aiPrompts/aiPromptsSlice";
import type { CreateAiPromptCommand } from "../../features/aiPrompts/aiPromptsAPI";

interface AiPromptsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AiPromptsDialog: React.FC<AiPromptsDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const aiPrompts = useAppSelector(selectAiPrompts);
  const loading = useAppSelector(selectAiPromptsListLoading);
  const totalItems = useAppSelector(selectAiPromptsTotalItems);

  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [keyFilter, setKeyFilter] = useState("");
  const [versionFilter, setVersionFilter] = useState("");

  const selectedPrompt = useMemo(
    () => aiPrompts.find((prompt) => prompt.id === selectedPromptId) ?? null,
    [aiPrompts, selectedPromptId],
  );

  const filteredPrompts = useMemo(
    () =>
      aiPrompts.filter((prompt) => {
        const keyMatches = keyFilter
          ? String(prompt.key || "")
              .toLowerCase()
              .includes(keyFilter.toLowerCase())
          : true;
        const versionMatches = versionFilter
          ? String(prompt.version || "")
              .toLowerCase()
              .includes(versionFilter.toLowerCase())
          : true;
        return keyMatches && versionMatches;
      }),
    [aiPrompts, keyFilter, versionFilter],
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchAiPrompts());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open && aiPrompts.length > 0 && selectedPromptId === null) {
      setSelectedPromptId(aiPrompts[0].id);
    }
  }, [open, aiPrompts, selectedPromptId]);

  const handleAddPrompt = async (command: CreateAiPromptCommand) => {
    const resultAction = await dispatch(createAiPrompt(command));
    if (createAiPrompt.fulfilled.match(resultAction)) {
      const created = resultAction.payload;
      setSelectedPromptId(created.id);
      setShowAddDialog(false);
      dispatch(fetchAiPrompts());
    }
  };

  const refreshPrompts = () => {
    if (selectedPromptId !== null) {
      dispatch(fetchAiPrompts());
    }
  };

  const filtersPanel = (
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
          <AddButton onClick={() => setShowAddDialog(true)} />
          <button
            type="button"
            className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            onClick={() => {
              setKeyFilter("");
              setVersionFilter("");
            }}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by key..."
            value={keyFilter}
            onChange={(e) => setKeyFilter(e.target.value)}
            className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {keyFilter && (
            <button
              type="button"
              className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
              style={{ padding: 0 }}
              aria-label="Clear key filter"
              onClick={() => setKeyFilter("")}
            >
              ×
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by version..."
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {versionFilter && (
            <button
              type="button"
              className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
              style={{ padding: 0 }}
              aria-label="Clear version filter"
              onClick={() => setVersionFilter("")}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const listPanel = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No AI prompts match filters.
          </div>
        ) : (
          filteredPrompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => setSelectedPromptId(prompt.id)}
              className={`w-full text-left px-3 py-1 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition ${
                prompt.id === selectedPromptId
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {prompt.key || "Untitled"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Version: {prompt.version || "n/a"}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const detailsPanel = (
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
                      aiPrompts
                        .map((prompt) => prompt.key || "")
                        .filter(Boolean) as string[],
                    ),
                  )}
                  onUpdated={refreshPrompts}
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
                  onUpdated={refreshPrompts}
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
                onUpdated={refreshPrompts}
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

  const listFooter = (
    <div className="px-3 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {filteredPrompts.length} total
        </span>
        <div className="flex gap-3 items-center">
          <button
            type="button"
            disabled
            className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">1 / 1</span>
          <button
            type="button"
            disabled
            className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="AI Prompts"
        dialogClassName=" max-w-[80vw]"
      >
        <div className="h-full min-h-0 bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden rounded max-h-[80vh] h-[80vh]">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex-1 min-h-0 flex overflow-hidden">
              <div className="flex flex-col min-h-0 w-[30%] max-w-[40%] overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="shrink-0">{filtersPanel}</div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  {listPanel}
                </div>
                <div>{listFooter}</div>
              </div>

              <div className="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize" />

              <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                {detailsPanel}
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        title="Add AI Prompt"
        dialogClassName="max-w-2xl"
      >
        <AddAiPromptForm
          onSave={handleAddPrompt}
          onCancel={() => setShowAddDialog(false)}
        />
      </Dialog>
    </>
  );
};

interface AddAiPromptFormProps {
  onSave: (command: CreateAiPromptCommand) => Promise<void>;
  onCancel: () => void;
}

const AddAiPromptForm: React.FC<AddAiPromptFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [key, setKey] = useState("");
  const [version, setVersion] = useState("");
  const [text, setText] = useState("");

  const handleSave = async () => {
    await onSave({ key, version, text });
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Name
        </label>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Version
        </label>
        <input
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="mt-1 w-full rounded border border-gray-300 bg-white text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};
