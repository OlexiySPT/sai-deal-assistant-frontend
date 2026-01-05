import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchDeals,
  selectDeals,
  selectDealsLoading,
  selectDealsTotalItems,
} from "../../features/deals/dealsSlice";
import type { DealsQueryParams } from "../../features/deals/dealsAPI";

interface DealsListProps {
  selectedDealId: number | null;
  onSelectDeal: (id: number) => void;
}

export const DealsList: React.FC<DealsListProps> = ({
  selectedDealId,
  onSelectDeal,
}) => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector(selectDeals);
  const loading = useAppSelector(selectDealsLoading);
  const totalItems = useAppSelector(selectDealsTotalItems);
  const [showDealsOnMobile, setShowDealsOnMobile] = useState(false);

  const [filters, setFilters] = useState<DealsQueryParams>({
    Page: 1,
    PageSize: 20,
  });

  useEffect(() => {
    dispatch(fetchDeals(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key: keyof DealsQueryParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, Page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, Page: newPage }));
  };

  const totalPages = Math.ceil(totalItems / (filters.PageSize || 20));
  const currentPage = filters.Page || 1;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Filters Panel */}
      <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold mb-1.5 text-gray-800 dark:text-gray-100">
          Deals
        </h2>
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.Name || ""}
            onChange={(e) => handleFilterChange("Name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Industry..."
            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.Industry || ""}
            onChange={(e) => handleFilterChange("Industry", e.target.value)}
          />
        </div>
      </div>

      {/* Deals List */}
      <div
        className={`flex-1 overflow-y-auto ${
          showDealsOnMobile ? "block" : "hidden"
        } md:block`}
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
              <div
                key={deal.id}
                onClick={() => onSelectDeal(deal.id)}
                className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  selectedDealId === deal.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {deal.name || "Untitled Deal"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {deal.industry || "No industry"}
                </div>
                <div className="flex gap-2 mt-1">
                  {deal.type && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {deal.type}
                    </span>
                  )}
                  {deal.state && (
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                      {deal.state}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className={`p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${
          showDealsOnMobile ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {totalItems} total
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2 py-0.5 text-xs rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Prev
            </button>
            <span className="px-2 py-0.5 text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2 py-0.5 text-xs rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
