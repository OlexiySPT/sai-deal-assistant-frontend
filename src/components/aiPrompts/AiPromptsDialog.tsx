import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../common/Dialog";
import AddButton from "../common/buttons/AddButton";
import Button from "../common/buttons/Button";
import { AiPromptsFiltersPanel } from "./AiPromptsFiltersPanel";
import { AiPromptsListPanel } from "./AiPromptsListPanel";
import { AiPromptDetailsPanel } from "./AiPromptDetailsPanel";
import { AiPromptsListFooter } from "./AiPromptsListFooter";
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

  const selectedPrompt = useMemo(() => {
    if (selectedPromptId !== null) {
      return aiPrompts.find((prompt) => prompt.id === selectedPromptId) ?? null;
    }
    return filteredPrompts[0] ?? null;
  }, [aiPrompts, filteredPrompts, selectedPromptId]);

  useEffect(() => {
    if (open) {
      dispatch(fetchAiPrompts());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (
      open &&
      filteredPrompts.length > 0 &&
      (selectedPromptId === null ||
        !filteredPrompts.some((prompt) => prompt.id === selectedPromptId))
    ) {
      setSelectedPromptId(filteredPrompts[0].id);
    }
  }, [open, filteredPrompts, selectedPromptId]);

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
                <div className="shrink-0">
                  <AiPromptsFiltersPanel
                    keyFilter={keyFilter}
                    versionFilter={versionFilter}
                    onKeyFilterChange={setKeyFilter}
                    onVersionFilterChange={setVersionFilter}
                    onClearAll={() => {
                      setKeyFilter("");
                      setVersionFilter("");
                    }}
                    onAddPrompt={() => setShowAddDialog(true)}
                  />
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <AiPromptsListPanel
                    items={filteredPrompts}
                    selectedPromptId={selectedPromptId}
                    onSelectPrompt={setSelectedPromptId}
                  />
                </div>
                <div>
                  <AiPromptsListFooter total={filteredPrompts.length} />
                </div>
              </div>

              <div className="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize" />

              <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                <AiPromptDetailsPanel
                  selectedPrompt={selectedPrompt}
                  allPrompts={aiPrompts}
                  onRefresh={refreshPrompts}
                />
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
    <>
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
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Save
        </Button>
      </div>
    </>
  );
};
