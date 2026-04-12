import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchDeals,
  selectDeals,
  selectDealsLoading,
  selectDealsTotalItems,
} from "../../features/deals/dealsSlice";
import {
  selectEnumValues,
  loadAllEnums,
} from "../../features/enums/enumsSlice";
import type { DealsQueryParams } from "../../features/deals/dealsAPI";
import { MultiSelect } from "../common/inputs/MultiSelect";
import AutocompleteInput from "../common/inputs/AutocompleteInput";
import { getCachedStringOptions } from "../../features/options/optionsAPI";
import DatePicker from "../common/inputs/DatePicker";
import { CreateDealDialog } from "./CreateDealDialog";
import AddButton from "../common/buttons/AddButton";
import { DealStateIcon } from "./DealStateIcon";

// New memoized row to avoid full list redraw on selection
const DealRow: React.FC<{
  deal: any;
  stateId: number | null;
  states: any[];
  isSelected: boolean;
  onClick: (id: number, opts?: { immediate?: boolean }) => void;
}> = ({ deal, stateId, states, isSelected, onClick }) => {
  const meta = [
    deal.firmName,
    deal.lastActionDate
      ? new Date(deal.lastActionDate).toLocaleDateString()
      : null,
    deal.status,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      data-deal-id={deal.id}
      onClick={() => onClick(deal.id, { immediate: true })}
      role="button"
      className={`px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <DealStateIcon id={stateId} states={states} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {deal.name || "Untitled Deal"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {meta || deal.state || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoDealRow = React.memo(
  DealRow,
  (prev, next) =>
    prev.deal === next.deal &&
    prev.stateId === next.stateId &&
    prev.states === next.states &&
    prev.isSelected === next.isSelected &&
    prev.onClick === next.onClick,
);

interface DealsListProps {
  selectedDealId: number | null;
  onSelectDeal: (id: number, opts?: { immediate?: boolean }) => void;
}

export const DealsList: React.FC<DealsListProps> = ({
  selectedDealId,
  onSelectDeal,
}) => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector(selectDeals);
  const loading = useAppSelector(selectDealsLoading);
  const totalItems = useAppSelector(selectDealsTotalItems);
  const dealStates = useAppSelector(selectEnumValues("dealstate"));
  const dealTypes = useAppSelector(selectEnumValues("dealtype"));
  const [showDealsOnMobile, setShowDealsOnMobile] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedStates, setSelectedStates] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [filters, setFilters] = useState<DealsQueryParams>({
    Page: 1,
    PageSize: 20,
    SortBy: "createdAt",
    SortDirection: "Desc",
    "HasEventInThisPeriod.StartDate": undefined,
    "HasEventInThisPeriod.EndDate": undefined,
  });
  const [eventStartDate, setEventStartDate] = useState<string | null>(null);
  const [eventEndDate, setEventEndDate] = useState<string | null>(null);
  const industryInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [industryDraft, setIndustryDraft] = useState("");
  const firmNameInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [firmNameDraft, setFirmNameDraft] = useState("");

  // Status (autocomplete) filter
  const [statuses, setStatuses] = useState<string[]>([]);
  const statusInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [statusDraft, setStatusDraft] = useState("");

  // Industry (autocomplete) filter
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const hasInitialStateIdsFromUrlRef = useRef(false);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const firmName = params.get("firmName");
    const industry = params.get("industry");
    const status = params.get("status");
    const stateIds = params.get("stateIds");
    const typeIds = params.get("typeIds");

    hasInitialStateIdsFromUrlRef.current = !!stateIds;

    const parsedStateIds = stateIds
      ? stateIds.split(",").map((s) => Number(s))
      : [];
    const parsedTypeIds = typeIds
      ? typeIds.split(",").map((s) => Number(s))
      : [];

    setFilters((prev) => ({
      ...prev,
      Page: page ? Number(page) : prev.Page,
      FirmName: firmName ?? prev.FirmName,
      Industry: industry ?? prev.Industry,
      Status: status ?? prev.Status,
      StateIds: parsedStateIds.length > 0 ? parsedStateIds : undefined,
      TypeIds: parsedTypeIds.length > 0 ? parsedTypeIds : undefined,
    }));

    if (stateIds) {
      setSelectedStates(parsedStateIds);
    }
    if (typeIds) {
      setSelectedTypes(parsedTypeIds);
    }

    if (firmName) setFirmNameDraft(firmName);
    if (industry) setIndustryDraft(industry);
    if (status) setStatusDraft(status);

    const handlePop = () => {
      const p = new URLSearchParams(window.location.search);
      const pg = p.get("page");
      const fn = p.get("firmName");
      const ind = p.get("industry");
      const st = p.get("status");
      const sIds = p.get("stateIds");
      const tIds = p.get("typeIds");

      const popStateIds = sIds ? sIds.split(",").map((s) => Number(s)) : [];
      const popTypeIds = tIds ? tIds.split(",").map((s) => Number(s)) : [];

      setFilters((prev) => ({
        ...prev,
        Page: pg ? Number(pg) : prev.Page,
        FirmName: fn ?? prev.FirmName,
        Industry: ind ?? prev.Industry,
        Status: st ?? prev.Status,
        StateIds: popStateIds.length > 0 ? popStateIds : undefined,
        TypeIds: popTypeIds.length > 0 ? popTypeIds : undefined,
      }));

      setSelectedStates(popStateIds);
      setSelectedTypes(popTypeIds);

      setFirmNameDraft(fn ?? "");
      setIndustryDraft(ind ?? "");
      setStatusDraft(st ?? "");
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    dispatch(loadAllEnums());
    // Load cached statuses for status autocomplete
    getCachedStringOptions({ entityType: "Deal", fieldName: "Status" })
      .then(setStatuses)
      .catch(() => setStatuses([]));
    // Load cached industries for industry autocomplete
    getCachedStringOptions({ entityType: "Deal", fieldName: "Industry" })
      .then(setIndustryOptions)
      .catch(() => setIndustryOptions([]));
  }, [dispatch]);

  // Throttle industry filter
  useEffect(() => {
    if (industryDraft === (filters.Industry || "")) return;
    if (industryInputTimeout.current)
      clearTimeout(industryInputTimeout.current);
    industryInputTimeout.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, Industry: industryDraft, Page: 1 }));
    }, 300);
    return () => {
      if (industryInputTimeout.current)
        clearTimeout(industryInputTimeout.current);
    };
  }, [industryDraft]);

  // Throttle status filter
  useEffect(() => {
    if (statusDraft === (filters.Status || "")) return;
    if (statusInputTimeout.current) clearTimeout(statusInputTimeout.current);
    statusInputTimeout.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, Status: statusDraft, Page: 1 }));
    }, 300);
    return () => {
      if (statusInputTimeout.current) clearTimeout(statusInputTimeout.current);
    };
  }, [statusDraft]);

  // Throttle name filter
  useEffect(() => {
    if (firmNameDraft === (filters.FirmName || "")) return;
    if (firmNameInputTimeout.current)
      clearTimeout(firmNameInputTimeout.current);
    firmNameInputTimeout.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, FirmName: firmNameDraft, Page: 1 }));
    }, 300);
    return () => {
      if (firmNameInputTimeout.current)
        clearTimeout(firmNameInputTimeout.current);
    };
  }, [firmNameDraft]);

  useEffect(() => {
    dispatch(fetchDeals(filters));
  }, [dispatch, filters]);

  // Auto-select first deal when none is selected
  useEffect(() => {
    if (!selectedDealId && deals && deals.length > 0) {
      onSelectDeal(deals[0].id);
    }
  }, [deals, selectedDealId, onSelectDeal]);

  // Update URL params when filters or selected types/states change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filters.Page) params.set("page", String(filters.Page));
    else params.delete("page");
    if (filters.FirmName) params.set("firmName", String(filters.FirmName));
    else params.delete("firmName");
    if (filters.Industry) params.set("industry", String(filters.Industry));
    else params.delete("industry");
    if (filters.Status) params.set("status", String(filters.Status));
    else params.delete("status");
    if (selectedStates && selectedStates.length > 0)
      params.set("stateIds", selectedStates.join(","));
    else params.delete("stateIds");
    if (selectedTypes && selectedTypes.length > 0)
      params.set("typeIds", selectedTypes.join(","));
    else params.delete("typeIds");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [filters, selectedStates, selectedTypes]);

  // Prevent overriding Page when initializing from URL params
  const initializingRef = useRef(true);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      StateIds: selectedStates.length > 0 ? selectedStates : undefined,
      Page: initializingRef.current ? prev.Page : 1,
    }));
  }, [selectedStates]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      TypeIds: selectedTypes.length > 0 ? selectedTypes : undefined,
      Page: initializingRef.current ? prev.Page : 1,
    }));
  }, [selectedTypes]);

  // Clear initializing flag after first render/effects
  useEffect(() => {
    initializingRef.current = false;
  }, []);

  const handleFilterChange = (key: keyof DealsQueryParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, Page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, Page: newPage }));
  };

  const totalPages = Math.ceil(totalItems / (filters.PageSize || 20));
  const currentPage = filters.Page || 1;

  const stateIdByName = useMemo(() => {
    const entries = dealStates
      .map((state: any) => [String(state.State), Number(state.Id)] as const)
      .filter(([, id]) => Number.isFinite(id));
    return Object.fromEntries(entries) as Record<string, number>;
  }, [dealStates]);

  const listRef = useRef<HTMLDivElement | null>(null);

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!deals || deals.length === 0) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const idx = deals.findIndex((d) => d.id === selectedDealId);
    let newIdx = idx;
    if (e.key === "ArrowDown") {
      newIdx = idx < 0 ? 0 : Math.min(deals.length - 1, idx + 1);
    } else if (e.key === "ArrowUp") {
      newIdx = idx < 0 ? deals.length - 1 : Math.max(0, idx - 1);
    }
    const newId = deals[newIdx].id;
    onSelectDeal(newId, { immediate: false });
    // ensure newly selected row is visible
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(
        `[data-deal-id="${newId}"]`,
      ) as HTMLElement | null;
      el?.scrollIntoView({ block: "nearest" });
    });
  };

  const handleDealCreated = () => {
    setShowCreateDialog(false);
    // Optionally, you could refresh the deals list here if needed
    dispatch(fetchDeals(filters));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Filters Panel */}
      <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Deals
          </h2>
          <div className="flex gap-2">
            <AddButton onClick={() => setShowCreateDialog(true)} />
            <button
              type="button"
              className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              onClick={() => {
                setFilters({
                  Page: 1,
                  PageSize: 20,
                  SortBy: "createdAt",
                  SortDirection: "Desc",
                  "HasEventInThisPeriod.StartDate": undefined,
                  "HasEventInThisPeriod.EndDate": undefined,
                });
                setFirmNameDraft("");
                setIndustryDraft("");
                setStatusDraft("");
                setSelectedStates([]);
                setSelectedTypes([]);
                setEventStartDate(null);
                setEventEndDate(null);
              }}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by firm name..."
              className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={firmNameDraft}
              onChange={(e) => setFirmNameDraft(e.target.value)}
            />
            {firmNameDraft && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear firm name"
                onClick={() => setFirmNameDraft("")}
              >
                ×
              </button>
            )}
          </div>
          <div className="relative">
            <MultiSelect
              options={dealStates.map((state: any) => ({
                id: state.Id,
                label: state.State,
              }))}
              selectedValues={selectedStates}
              onChange={(values) => setSelectedStates(values as number[])}
              placeholder="All States"
            />
            {selectedStates.length > 0 && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear state filter"
                onClick={() => setSelectedStates([])}
              >
                ×
              </button>
            )}
          </div>
          <div className="relative flex-1 min-w-0 flex gap-2 items-center">
            <DatePicker
              value={eventStartDate}
              onChange={(date) => {
                setEventStartDate(date);
                setFilters((prev) => ({
                  ...prev,
                  "HasEventInThisPeriod.StartDate": date || undefined,
                  Page: 1,
                }));
              }}
              placeholder="Start date"
              className="w-full max-w-[12rem] pr-2 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ minWidth: 0 }}
            />
            <span className="text-xs">–</span>
            <DatePicker
              value={eventEndDate}
              onChange={(date) => {
                setEventEndDate(date);
                setFilters((prev) => ({
                  ...prev,
                  "HasEventInThisPeriod.EndDate": date || undefined,
                  Page: 1,
                }));
              }}
              placeholder="End date"
              className="w-full max-w-[12rem] pr-2 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ minWidth: 0 }}
            />
          </div>
          <div className="relative">
            <AutocompleteInput
              value={statusDraft}
              onChange={(v) => setStatusDraft(v)}
              suggestions={statuses}
              placeholder="Status..."
              onSelect={(s) => {
                setStatusDraft(s);
                setFilters((prev) => ({ ...prev, Status: s, Page: 1 }));
              }}
              className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {statusDraft && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear status"
                onClick={() => setStatusDraft("")}
              >
                ×
              </button>
            )}
          </div>
          <div className="relative">
            <MultiSelect
              options={dealTypes.map((type: any) => ({
                id: type.Id,
                label: type.Type,
              }))}
              selectedValues={selectedTypes}
              onChange={(values) => setSelectedTypes(values as number[])}
              placeholder="All Types"
            />
            {selectedTypes.length > 0 && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear type filter"
                onClick={() => setSelectedTypes([])}
              >
                ×
              </button>
            )}
          </div>
          <div className="relative">
            <AutocompleteInput
              value={industryDraft}
              onChange={setIndustryDraft}
              suggestions={industryOptions}
              placeholder="Industry..."
              onSelect={(s) => {
                setIndustryDraft(s);
                setFilters((prev) => ({ ...prev, Industry: s, Page: 1 }));
              }}
              className="w-full pr-7 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {industryDraft && (
              <button
                type="button"
                className="absolute right-1 top-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                style={{ padding: 0 }}
                aria-label="Clear industry"
                onClick={() => setIndustryDraft("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div
        ref={listRef}
        tabIndex={0}
        onKeyDown={handleListKeyDown}
        className={`flex-1 overflow-y-auto ${
          showDealsOnMobile ? "block" : "hidden"
        } md:block focus:outline-none focus:ring-0`}
      >
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : deals.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No deals found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {deals.map((deal) => (
              <MemoDealRow
                key={deal.id}
                deal={deal}
                stateId={
                  deal.state ? (stateIdByName[deal.state] ?? null) : null
                }
                states={dealStates}
                isSelected={selectedDealId === deal.id}
                onClick={onSelectDeal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className={`px-3 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${
          showDealsOnMobile ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {totalItems} total
          </span>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              Prev
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <CreateDealDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={handleDealCreated}
      />
    </div>
  );
};
