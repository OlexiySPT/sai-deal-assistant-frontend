import React, { useEffect, useState, useRef } from "react";
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
import { getCachedDealStatuses } from "../../features/deals/dealsAPI";
import { CreateOrUpdateDealDialog } from "./CreateOrUpdateDealDialog";
import AddButton from "../common/buttons/AddButton";

// Deal state icon component
const DealStateIcon: React.FC<{ state: string | null }> = ({ state }) => {
  const stateKey = state?.toLowerCase() || "";

  // Icons for different states
  if (stateKey.includes("lead") || stateKey.includes("new")) {
    return (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>New Lead</title>
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (stateKey.includes("proposal") || stateKey.includes("pending")) {
    return (
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Proposal Pending</title>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (stateKey.includes("negotiation") || stateKey.includes("progress")) {
    return (
      <svg
        className="w-4 h-4 text-orange-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>In Negotiation</title>
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (
    stateKey.includes("won") ||
    stateKey.includes("success") ||
    stateKey.includes("closed won")
  ) {
    return (
      <svg
        className="w-4 h-4 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Deal Won</title>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (stateKey.includes("lost") || stateKey.includes("closed lost")) {
    return (
      <svg
        className="w-4 h-4 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Deal Lost</title>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (stateKey.includes("qualified")) {
    return (
      <svg
        className="w-4 h-4 text-purple-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <title>Qualified Lead</title>
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path
          fillRule="evenodd"
          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  // Default icon
  return (
    <svg
      className="w-4 h-4 text-gray-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <title>{state || "Unknown State"}</title>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
        clipRule="evenodd"
      />
    </svg>
  );
};

// New memoized row to avoid full list redraw on selection
const DealRow: React.FC<{
  deal: any;
  isSelected: boolean;
  onClick: (id: number, opts?: { immediate?: boolean }) => void;
}> = ({ deal, isSelected, onClick }) => {
  return (
    <div
      data-deal-id={deal.id}
      onClick={() => onClick(deal.id, { immediate: true })}
      role="button"
      className={`px-3 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <DealStateIcon state={deal.state} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {deal.name || "Untitled Deal"}
          </div>
          {deal.type && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {deal.type}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MemoDealRow = React.memo(
  DealRow,
  (prev, next) =>
    prev.deal.id === next.deal.id && prev.isSelected === next.isSelected,
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
    SortDirection: 1,
  });
  const industryInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [industryDraft, setIndustryDraft] = useState("");
  const nameInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nameDraft, setNameDraft] = useState("");

  // Status (autocomplete) filter
  const [statuses, setStatuses] = useState<string[]>([]);
  const statusInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [statusDraft, setStatusDraft] = useState("");

  // Initialize filters from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const name = params.get("name");
    const industry = params.get("industry");
    const status = params.get("status");
    const stateIds = params.get("stateIds");
    const typeIds = params.get("typeIds");

    setFilters((prev) => ({
      ...prev,
      Page: page ? Number(page) : prev.Page,
      Name: name ?? prev.Name,
      Industry: industry ?? prev.Industry,
      Status: status ?? prev.Status,
    }));

    if (stateIds) {
      setSelectedStates(stateIds.split(",").map((s) => Number(s)));
    }
    if (typeIds) {
      setSelectedTypes(typeIds.split(",").map((s) => Number(s)));
    }

    if (name) setNameDraft(name);
    if (industry) setIndustryDraft(industry);
    if (status) setStatusDraft(status);

    const handlePop = () => {
      const p = new URLSearchParams(window.location.search);
      const pg = p.get("page");
      const nm = p.get("name");
      const ind = p.get("industry");
      const st = p.get("status");
      const sIds = p.get("stateIds");
      const tIds = p.get("typeIds");

      setFilters((prev) => ({
        ...prev,
        Page: pg ? Number(pg) : prev.Page,
        Name: nm ?? prev.Name,
        Industry: ind ?? prev.Industry,
        Status: st ?? prev.Status,
      }));

      setSelectedStates(sIds ? sIds.split(",").map((s) => Number(s)) : []);
      setSelectedTypes(tIds ? tIds.split(",").map((s) => Number(s)) : []);

      setNameDraft(nm ?? "");
      setIndustryDraft(ind ?? "");
      setStatusDraft(st ?? "");
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    dispatch(loadAllEnums());
    // Load cached statuses for status autocomplete
    getCachedDealStatuses()
      .then(setStatuses)
      .catch(() => setStatuses([]));
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
    if (nameDraft === (filters.Name || "")) return;
    if (nameInputTimeout.current) clearTimeout(nameInputTimeout.current);
    nameInputTimeout.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, Name: nameDraft, Page: 1 }));
    }, 300);
    return () => {
      if (nameInputTimeout.current) clearTimeout(nameInputTimeout.current);
    };
  }, [nameDraft]);

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
    if (filters.Name) params.set("name", String(filters.Name));
    else params.delete("name");
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
          <AddButton onClick={() => setShowCreateDialog(true)} />
        </div>
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
          />
          <MultiSelect
            options={dealStates.map((state: any) => ({
              id: state.Id,
              label: state.State,
            }))}
            selectedValues={selectedStates}
            onChange={(values) => setSelectedStates(values as number[])}
            placeholder="All States"
          />
          <MultiSelect
            options={dealTypes.map((type: any) => ({
              id: type.Id,
              label: type.Type,
            }))}
            selectedValues={selectedTypes}
            onChange={(values) => setSelectedTypes(values as number[])}
            placeholder="All Types"
          />
          <input
            type="text"
            placeholder="Industry..."
            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={industryDraft}
            onChange={(e) => setIndustryDraft(e.target.value)}
          />
          <div>
            <AutocompleteInput
              value={statusDraft}
              onChange={(v) => setStatusDraft(v)}
              suggestions={statuses}
              placeholder="Status..."
              onSelect={(s) => {
                setStatusDraft(s);
                setFilters((prev) => ({ ...prev, Status: s, Page: 1 }));
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
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
      <CreateOrUpdateDealDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={handleDealCreated}
      />
    </div>
  );
};
