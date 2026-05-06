import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../common/Dialog";
import AddButton from "../common/buttons/AddButton";
import Button from "../common/buttons/Button";
import { AiMetadataFiltersPanel } from "./AiMetadataFiltersPanel";
import { AiMetadataListPanel } from "./AiMetadataListPanel";
import { AiMetadataDetailsPanel } from "./AiMetadataDetailsPanel";
import { AiMetadataListFooter } from "./AiMetadataListFooter";
import EditableMultilineStringField from "../common/inputs/EditableMultilineStringField";
import EditableStringField from "../common/inputs/EditableStringField";
import AutocompleteEditableStringField from "../common/inputs/AutocompleteEditableStringField";
import {
  fetchAiMetadata,
  createAiMetadata,
  selectAiMetadataItems,
  selectAiMetadataListLoading,
  selectAiMetadataTotalItems,
} from "../../features/aiMetadata/aiMetadataSlice";
import type { CreateAiMetadataCommand } from "../../features/aiMetadata/aiMetadataAPI";

interface AiMetadataDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AiMetadataDialog: React.FC<AiMetadataDialogProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const aiMetadata = useAppSelector(selectAiMetadataItems);
  const loading = useAppSelector(selectAiMetadataListLoading);
  const totalItems = useAppSelector(selectAiMetadataTotalItems);

  const [selectedMetadataId, setSelectedMetadataId] = useState<number | null>(
    null,
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [keyFilter, setKeyFilter] = useState("");

  const selectedMetadata = useMemo(
    () => aiMetadata.find((item) => item.id === selectedMetadataId) ?? null,
    [aiMetadata, selectedMetadataId],
  );

  const filteredMetadata = useMemo(
    () =>
      aiMetadata.filter((item) => {
        const typeMatches = typeFilter
          ? String(item.type || "")
              .toLowerCase()
              .includes(typeFilter.toLowerCase())
          : true;
        const keyMatches = keyFilter
          ? String(item.key || "")
              .toLowerCase()
              .includes(keyFilter.toLowerCase())
          : true;
        return typeMatches && keyMatches;
      }),
    [aiMetadata, typeFilter, keyFilter],
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchAiMetadata());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open && aiMetadata.length > 0 && selectedMetadataId === null) {
      setSelectedMetadataId(aiMetadata[0].id);
    }
  }, [open, aiMetadata, selectedMetadataId]);

  const handleAddMetadata = async (command: CreateAiMetadataCommand) => {
    const resultAction = await dispatch(createAiMetadata(command));
    if (createAiMetadata.fulfilled.match(resultAction)) {
      const created = resultAction.payload;
      setSelectedMetadataId(created.id);
      setShowAddDialog(false);
      dispatch(fetchAiMetadata());
    }
  };

  const refreshMetadata = () => {
    if (selectedMetadataId !== null) {
      dispatch(fetchAiMetadata());
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="AI Metadata"
        dialogClassName=" max-w-[80vw]"
      >
        <div className="h-full min-h-0 bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden rounded max-h-[80vh] h-[80vh]">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex-1 min-h-0 flex overflow-hidden">
              <div className="flex flex-col min-h-0 w-[30%] max-w-[40%] overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <AiMetadataFiltersPanel
                  typeFilter={typeFilter}
                  keyFilter={keyFilter}
                  onTypeFilterChange={setTypeFilter}
                  onKeyFilterChange={setKeyFilter}
                  onClearAll={() => {
                    setTypeFilter("");
                    setKeyFilter("");
                  }}
                  onAddMetadata={() => setShowAddDialog(true)}
                />
                <div className="flex-1 min-h-0 overflow-hidden">
                  <AiMetadataListPanel
                    items={filteredMetadata}
                    selectedMetadataId={selectedMetadataId}
                    onSelectMetadata={setSelectedMetadataId}
                  />
                </div>
                <div>
                  <AiMetadataListFooter total={filteredMetadata.length} />
                </div>
              </div>

              <div className="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize" />

              <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                <AiMetadataDetailsPanel
                  selectedMetadata={selectedMetadata}
                  allMetadata={aiMetadata}
                  onRefresh={refreshMetadata}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        title="Add AI Metadata"
        dialogClassName="max-w-2xl"
      >
        <AddAiMetadataForm
          onSave={handleAddMetadata}
          onCancel={() => setShowAddDialog(false)}
        />
      </Dialog>
    </>
  );
};

interface AddAiMetadataFormProps {
  onSave: (command: CreateAiMetadataCommand) => Promise<void>;
  onCancel: () => void;
}

const AddAiMetadataForm: React.FC<AddAiMetadataFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [type, setType] = useState("");
  const [key, setKey] = useState("");
  const [version, setVersion] = useState("");
  const [text, setText] = useState("");

  const handleSave = async () => {
    await onSave({ type, key, version, text, id: 0 });
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
          Type
        </label>
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 bg-white text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Field
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
    </form>
  );
};
