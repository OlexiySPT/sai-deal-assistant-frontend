import React, { useState, useEffect } from "react";
import Button from "../common/buttons/Button";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectEnumValues,
  loadAllEnums,
} from "../../features/enums/enumsSlice";
import {
  createDeal,
  updateDeal,
  getDealById,
} from "../../features/deals/dealsAPI";
import { getCachedStringOptions } from "../../features/options/optionsAPI";
import { getFirmById, getFirmsDropdown } from "../../features/firms/firmsAPI";
import { Dialog } from "../common/Dialog";
import AutocompleteInput from "../common/inputs/AutocompleteInput";
import {
  AutocompleteDynamicDropDownInput,
  DynamicDropdownActionArgs,
  DynamicDropdownItemDto,
} from "../common/inputs/AutocompleteDynamicDropDown";
import { CreateOrEditFirmDialog } from "../firms/CreateOrEditFirmDialog";
import { todayLocalYmd } from "../../utils/date";
import { MakeMagicButton } from "../common/buttons/MakeMagicButton";
import { readPage } from "../../features/dealAutomation/dealAutomationAPI";

interface CreateDealDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (deal: any) => void;
  dealId?: number | null; // If provided, dialog is in edit mode
  initialValues?: Partial<DealFormState>;
}

interface DealFormState {
  name: string;
  firmId: number;
  firmName?: string;
  description: string;
  url: string;
  aiSearchInfo: string;
  aiBriefDescription: string;
  industry: string;
  status: string;
  typeId: number;
  stateId: number;
  startDate: string | null;
  aiFullStructuredInfo: string | null;
}

export const CreateDealDialog: React.FC<CreateDealDialogProps> = ({
  open,
  onClose,
  onCreated,
  dealId,
  initialValues,
}) => {
  const dispatch = useAppDispatch();
  const dealTypes = useAppSelector(selectEnumValues("dealtype"));
  const dealStates = useAppSelector(selectEnumValues("dealstate"));

  useEffect(() => {
    dispatch(loadAllEnums());
  }, [dispatch]);

  const [form, setForm] = useState<DealFormState>({
    name: "",
    firmId: 0,
    description: "",
    url: "",
    aiSearchInfo: "",
    aiBriefDescription: "",
    industry: "",
    status: "",
    typeId: 0,
    stateId: 0,
    startDate: null,
    aiFullStructuredInfo: null,
  });
  const [isEdit, setIsEdit] = useState(false);

  const [statuses, setStatuses] = useState<string[]>([]);
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const [firmName, setFirmName] = useState("");
  const [firmDialogOpen, setFirmDialogOpen] = useState(false);
  const [activeFirmId, setActiveFirmId] = useState<number | null>(null);
  const [initialFirmName, setInitialFirmName] = useState("");

  useEffect(() => {
    let mounted = true;
    getCachedStringOptions({ entityType: "Deal", fieldName: "Status" }).then(
      (data: string[]) => {
        if (mounted) setStatuses(data || []);
      },
    );
    getCachedStringOptions({ entityType: "Deal", fieldName: "Industry" }).then(
      (data: string[]) => {
        if (mounted) setIndustryOptions(data || []);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  // Load deal data if editing
  useEffect(() => {
    if (dealId && open) {
      setIsEdit(true);
      setLoading(true);
      getDealById(dealId)
        .then((deal) => {
          setForm({
            name: deal.name || "",
            firmId: deal.firmId || 0,
            startDate: deal.startDate || null,
            description: deal.description || "",
            url: deal.url || "",
            aiSearchInfo: deal.aiSearchInfo || "",
            aiBriefDescription: deal.aiBriefDescription || "",
            industry: deal.industry || "",
            status: deal.status || "",
            typeId: deal.typeId || 0,
            stateId: deal.stateId || 0,
            aiFullStructuredInfo: null,
          });

          if (deal.firmId) {
            getFirmById(deal.firmId)
              .then((firm) => {
                setFirmName(firm.name || `Firm ${deal.firmId}`);
              })
              .catch(() => {
                setFirmName("");
              });
          } else {
            setFirmName("");
          }
        })
        .catch(() => setError("Failed to load deal"))
        .finally(() => setLoading(false));
    } else if (!dealId && open) {
      setIsEdit(false);
      setForm({
        name: initialValues?.name ?? "",
        firmId: initialValues?.firmId ?? 0,
        startDate: initialValues?.startDate ?? todayLocalYmd(),
        description: initialValues?.description ?? "",
        url: initialValues?.url ?? "",
        aiSearchInfo: initialValues?.aiSearchInfo ?? "",
        aiBriefDescription: initialValues?.aiBriefDescription ?? "",
        industry: initialValues?.industry ?? "DotNet",
        status: initialValues?.status ?? "New",
        typeId: initialValues?.typeId ?? 3,
        stateId: initialValues?.stateId ?? 1,
        aiFullStructuredInfo: initialValues?.aiFullStructuredInfo ?? null,
      });
      setFirmName(initialValues?.firmName ?? "");
    }
    // eslint-disable-next-line
  }, [dealId, open, initialValues]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFirmChange = (value: string) => {
    setFirmName(value);
    setError(null);
    setForm((prev) => ({ ...prev, firmId: 0 }));
  };

  const handleFirmSelected = (item: DynamicDropdownItemDto) => {
    setFirmName(item.name?.trim() || `Firm ${item.id}`);
    setError(null);
    setForm((prev) => ({ ...prev, firmId: item.id }));
  };

  const handleAddFirmRequested = (_args: DynamicDropdownActionArgs) => {
    setActiveFirmId(null);
    setInitialFirmName("");
    setFirmDialogOpen(true);
  };

  const handleEditFirmRequested = ({
    id,
    value,
  }: DynamicDropdownActionArgs) => {
    if (!id) return;
    setActiveFirmId(id);
    setInitialFirmName(value);
    setFirmDialogOpen(true);
  };

  const handleFirmDialogClose = () => {
    setFirmDialogOpen(false);
    setActiveFirmId(null);
    setInitialFirmName("");
  };

  const handleFirmSaved = async (savedFirmId: number) => {
    try {
      const savedFirm = await getFirmById(savedFirmId);
      setFirmName(savedFirm.name || `Firm ${savedFirmId}`);
    } catch {
      setFirmName("");
    } finally {
      setForm((prev) => ({ ...prev, firmId: savedFirmId }));
      handleFirmDialogClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "typeId" || name === "stateId" || name === "firmId"
          ? Number(value)
          : value,
    }));
  };

  const parseReadPageResult = (result: string) => {
    try {
      return JSON.parse(result);
    } catch {
      const parsedResult: Record<string, string> = {};
      let currentKey: string | null = null;

      result.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
        if (match) {
          currentKey = match[1];
          parsedResult[currentKey] = match[2] || "";
        } else if (currentKey) {
          parsedResult[currentKey] += `\n${line}`;
        }
      });

      return parsedResult;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.firmId && firmName.trim() !== "") {
      setError("Please select a firm.");
      setLoading(false);
      return;
    }

    try {
      let deal;
      if (isEdit && dealId) {
        deal = await updateDeal(dealId, { ...form, id: dealId });
      } else {
        deal = await createDeal({ ...form, id: 0 });
      }
      if (onCreated) onCreated(deal);
      onClose();
    } catch (err: any) {
      setError(
        err?.message ||
          (isEdit ? "Failed to update deal" : "Failed to create deal"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title={isEdit ? "Edit Deal" : "Create Deal"}
        dialogClassName="max-w-3xl"
      >
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Left column - 60% width */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Firm</label>
              <div className="flex-1" style={{ minWidth: 0 }}>
                <AutocompleteDynamicDropDownInput
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  value={firmName}
                  onChange={handleFirmChange}
                  loadOptions={getFirmsDropdown}
                  placeholder="Search or select firm..."
                  onSelect={handleFirmSelected}
                  showAllOnEmpty={true}
                  pageSize={10}
                  throttleMs={350}
                  sortBy="name"
                  sortDirection="Asc"
                  selectedId={form.firmId || null}
                  onAddRequested={handleAddFirmRequested}
                  onEditRequested={handleEditFirmRequested}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">URL</label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
              <MakeMagicButton
                onClick={async () => {
                  try {
                    const result = await readPage({
                      dealId: null,
                      url: form.url,
                    });

                    const parsedResult = parseReadPageResult(result);
                    const parsedResultAsString =
                      typeof parsedResult === "string"
                        ? parsedResult
                        : JSON.stringify(parsedResult, null, 2);

                    setForm((prev) => ({
                      ...prev,
                      firmName: parsedResult.company || prev.firmName,
                      name: parsedResult.title || prev.name,
                      description:
                        parsedResult.text ||
                        parsedResult.description ||
                        prev.description,
                      aiFullStructuredInfo:
                        parsedResultAsString || prev.aiFullStructuredInfo,
                    }));
                    console.debug(parsedResult);
                  } catch (err) {
                    console.error("Failed to read page", err);
                  }
                }}
                colorClass={"blue"}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Industry</label>
              <div style={{ minWidth: 0, flex: 1 }}>
                <AutocompleteInput
                  value={form.industry || ""}
                  onChange={(v) =>
                    setForm((prev) => ({ ...prev, industry: v }))
                  }
                  suggestions={industryOptions}
                  placeholder="Type or select industry..."
                  onSelect={(s) =>
                    setForm((prev) => ({ ...prev, industry: s }))
                  }
                  onEnter={(v) => setForm((prev) => ({ ...prev, industry: v }))}
                  className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Type</label>
              <select
                name="typeId"
                value={form.typeId}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                required
              >
                <option value={0} disabled>
                  Select type...
                </option>
                {dealTypes.map((type: any) => (
                  <option key={type.Id} value={type.Id}>
                    {type.Type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">State</label>
              <select
                name="stateId"
                value={form.stateId}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1 bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-gray-300 dark:border-gray-600"
                required
              >
                <option value={0} disabled>
                  Select state...
                </option>
                {dealStates.map((state: any) => (
                  <option key={state.Id} value={state.Id}>
                    {state.State}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium">Status</label>
              <div style={{ minWidth: 0, flex: 1 }}>
                <AutocompleteInput
                  value={form.status || ""}
                  onChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
                  suggestions={statuses}
                  placeholder="Type or select status..."
                  onSelect={(s) => setForm((prev) => ({ ...prev, status: s }))}
                  onEnter={(v) => setForm((prev) => ({ ...prev, status: v }))}
                  className="w-full border rounded px-2 py-1 bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          {/* Right column - 40% width */}
          <div className="space-y-4 flex flex-col h-full md:col-span-1">
            <div className="flex flex-col h-full">
              <label className="text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 flex-1 min-h-[180px]"
              />
            </div>
          </div>
          {/* Submit and error message below both columns */}
          <div className="md:col-span-2 flex flex-col items-end gap-2 mt-2">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
              type="submit"
              className="!aspect-auto w-auto h-auto px-4 py-2 !rounded"
              disabled={loading}
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Saving..."
                : isEdit
                  ? "Update Deal"
                  : "Create Deal"}
            </Button>
          </div>
        </form>
      </Dialog>
      <CreateOrEditFirmDialog
        open={firmDialogOpen}
        onClose={handleFirmDialogClose}
        firmId={activeFirmId}
        initialName={initialFirmName}
        onSaved={handleFirmSaved}
      />
    </>
  );
};
