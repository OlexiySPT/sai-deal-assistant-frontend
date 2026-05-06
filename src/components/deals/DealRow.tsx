import React from "react";
import { DealStateIcon } from "./DealStateIcon";

interface DealRowProps {
  deal: any;
  stateId: number | null;
  states: any[];
  isSelected: boolean;
  onClick: (id: number, opts?: { immediate?: boolean }) => void;
}

const DealRowComponent: React.FC<DealRowProps> = ({
  deal,
  stateId,
  states,
  isSelected,
  onClick,
}) => {
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

export const DealRow = React.memo(
  DealRowComponent,
  (prev, next) =>
    prev.deal === next.deal &&
    prev.stateId === next.stateId &&
    prev.states === next.states &&
    prev.isSelected === next.isSelected &&
    prev.onClick === next.onClick,
);
