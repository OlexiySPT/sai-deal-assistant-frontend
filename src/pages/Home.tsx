import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "../app/hooks";
import { ActivityBar } from "../components/layout/ActivityBar";
import { DealsList } from "../components/deals/DealsList";
import { DealDetails } from "../components/deals/DealDetails";
import { fetchDealWithDependents } from "../features/deals/dealsSlice";

export const Home = () => {
  const dispatch = useAppDispatch();

  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  // separate state used to trigger actual detail fetches (debounced when navigating via keyboard)
  const [selectedDealForFetch, setSelectedDealForFetch] = useState<
    number | null
  >(null);
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(20); // percentage
  const [activeView, setActiveView] = useState<string | null>("deals");

  const handleSelectDeal = (id: number, opts?: { immediate?: boolean }) => {
    setSelectedDealId(id);
    // update URL will be handled by effect that watches selectedDealId
    if (fetchTimerRef.current) {
      clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = null;
    }

    if (opts?.immediate) {
      setSelectedDealForFetch(id);
      dispatch(fetchDealWithDependents(id));
    } else {
      // debounce fetch to avoid rapid fetches when navigating with keyboard
      fetchTimerRef.current = setTimeout(() => {
        setSelectedDealForFetch(id);
        dispatch(fetchDealWithDependents(id));
        fetchTimerRef.current = null;
      }, 300);
    }
  };

  // Initialize selected deal from URL and keep in sync with history
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("dealId");
    if (id) {
      setSelectedDealId(Number(id));
      // fetch immediately on initial load from URL
      setSelectedDealForFetch(Number(id));
      dispatch(fetchDealWithDependents(Number(id)));
    }

    const handlePop = () => {
      const p = new URLSearchParams(window.location.search);
      const d = p.get("dealId");
      const newId = d ? Number(d) : null;
      setSelectedDealId(newId);
      if (newId) {
        setSelectedDealForFetch(newId);
        dispatch(fetchDealWithDependents(newId));
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [dispatch]);

  // Push selected deal into URL when it changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedDealId) params.set("dealId", String(selectedDealId));
    else params.delete("dealId");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [selectedDealId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const containerWidth = window.innerWidth;
      const newWidth = startWidth + (delta / containerWidth) * 100;
      // Constrain between 15% and 40%
      setLeftPanelWidth(Math.min(Math.max(newWidth, 15), 40));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex md:flex-row flex-col h-full overflow-hidden">
      {/* Activity Bar */}
      <div className="hidden md:block">
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Left Panel - Deals List (conditionally shown) */}
      {activeView === "deals" && (
        <>
          <div
            style={{ width: `${leftPanelWidth}%` }}
            className="border-r border-gray-200 dark:border-gray-700 hidden md:block"
          >
            <DealsList
              selectedDealId={selectedDealId}
              onSelectDeal={handleSelectDeal}
            />
          </div>

          {/* Splitter */}
          <div
            onMouseDown={handleMouseDown}
            className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 cursor-col-resize transition-colors hidden md:block"
          />
        </>
      )}

      {/* Right Panel - Deal Details */}
      <div
        className="flex-1 overflow-hidden flex flex-col w-full md:w-auto"
        style={{
          width:
            window.innerWidth >= 768 && activeView === "deals"
              ? `${100 - leftPanelWidth}%`
              : undefined,
        }}
      >
        {/* Deals List for Mobile - at top */}
        {activeView === "deals" && (
          <div className="md:hidden border-b border-gray-200 dark:border-gray-700">
            <DealsList
              selectedDealId={selectedDealId}
              onSelectDeal={handleSelectDeal}
            />
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <DealDetails dealId={selectedDealId} />
        </div>
      </div>
    </div>
  );
};
