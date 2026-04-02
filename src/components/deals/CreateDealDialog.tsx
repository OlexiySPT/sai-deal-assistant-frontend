import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectEnumValues,
  loadAllEnums,
} from "../../features/enums/enumsSlice";
import {
  createDeal,
  updateDeal,
  getDealById,
  getCachedDealStatuses,
} from "../../features/deals/dealsAPI";
import { getFirmsDropdown } from "../../features/firms/firmsAPI";
import { Dialog } from "../common/Dialog";
import AutocompleteInput from "../common/inputs/AutocompleteInput";
import { todayLocalYmd } from "../../utils/date";

interface CreateDealDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (deal: any) => void;
  dealId?: number | null; // If provided, dialog is in edit mode
}

interface DealFormState {
  name: string;
  firmId: number;
  description: string;
  url: string;
  aiSearchInfo: string;
  aiBriefDescription: string;
  industry: string;
  status: string;
  typeId: number;
  stateId: number;
  startDate: string | null;
}

export const CreateDealDialog: React.FC<CreateDealDialogProps> = ({
  open,
  onClose,
  onCreated,
  dealId,
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
  });
  const [isEdit, setIsEdit] = useState(false);

  const [statuses, setStatuses] = useState<string[]>([]);
  const [firms, setFirms] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    let mounted = true;
    getCachedDealStatuses().then((data) => {
      if (mounted) setStatuses(data || []);
    });
    getFirmsDropdown({
      Page: 1,
      PageSize: 200,
      SortBy: "name",
      SortDirection: "Asc",
    })
      .then((response) => {
        if (!mounted) return;
        setFirms(
          (response.items || []).map((firm) => ({
            id: firm.id,
            name: firm.name || `Firm ${firm.id}`,
          })),
        );
      })
      .catch(() => {
        if (mounted) setFirms([]);
      });
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
          });
        })
        .catch(() => setError("Failed to load deal"))
        .finally(() => setLoading(false));
    } else if (!dealId && open) {
      setIsEdit(false);
      setForm({
        name: "",
        firmId: 0,
        startDate: todayLocalYmd(),
        description: "",
        url: "",
        aiSearchInfo: "",
        aiBriefDescription: "",
        industry: "DotNet",
        status: "New",
        typeId: 3,
        stateId: 1,
      });
    }
    // eslint-disable-next-line
  }, [dealId, open]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
            <label className="w-32 text-sm font-medium">Firm</label>
            <select
              name="firmId"
              value={form.firmId}
              onChange={handleChange}
              className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              required
            >
              <option value={0} disabled>
                Select firm...
              </option>
              {firms.map((firm) => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-32 text-sm font-medium">Industry</label>
            <input
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="flex-1 border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
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
        <div className="md:col-span-2 flex flex-col items-start gap-2 mt-2">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Saving..."
                : "Saving..."
              : isEdit
                ? "Update Deal"
                : "Create Deal"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
