import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../common/Dialog";
import AddButton from "../common/buttons/AddButton";
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

  const filtersPanel = (
    <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            AI Metadata
          </h2>
        </div>
        <div className="flex gap-2">
          <AddButton onClick={() => setShowAddDialog(true)} />
          <button
            type="button"
            className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            onClick={() => {
              setTypeFilter("");
              setKeyFilter("");
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
            placeholder="Search by type..."
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {typeFilter && (
            <button
              type="button"
              className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
              style={{ padding: 0 }}
              aria-label="Clear type filter"
              onClick={() => setTypeFilter("")}
            >
              ×
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Key..."
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
      </div>
    </div>
  );

  const listPanel = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredMetadata.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No AI metadata items match filters.
          </div>
        ) : (
          filteredMetadata.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedMetadataId(item.id)}
              className={`w-full text-left px-3 py-1 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition ${
                item.id === selectedMetadataId
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
          ))
        )}
      </div>
    </div>
  );

  const detailsPanel = (
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
                      aiMetadata
                        .map((item) => item.type || "")
                        .filter(Boolean) as string[],
                    ),
                  )}
                  onUpdated={refreshMetadata}
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
                      aiMetadata
                        .map((item) => item.key || "")
                        .filter(Boolean) as string[],
                    ),
                  )}
                  onUpdated={refreshMetadata}
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
                  onUpdated={refreshMetadata}
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
                onUpdated={refreshMetadata}
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

  const listFooter = (
    <div className="px-3 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {filteredMetadata.length} total
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
        title="AI Metadata"
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
