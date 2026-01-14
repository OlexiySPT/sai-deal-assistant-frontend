import { useState } from "react";
import { ActivityBar } from "../components/layout/ActivityBar";
import { DealsList } from "../components/deals/DealsList";
import { DealDetails } from "../components/deals/DealDetails";

export const Home = () => {
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(20); // percentage
  const [activeView, setActiveView] = useState<string | null>("deals");

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
              onSelectDeal={setSelectedDealId}
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
              onSelectDeal={setSelectedDealId}
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
