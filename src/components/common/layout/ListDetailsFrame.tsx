import React from "react";

interface ListDetailsFrameProps {
  filters: React.ReactNode;
  list: React.ReactNode;
  listFooter?: React.ReactNode;
  details?: React.ReactNode;
  detailsHeader?: React.ReactNode;
  showListOnMobile?: boolean;
  listClassName?: string;
  detailsClassName?: string;
}

export const ListDetailsFrame: React.FC<ListDetailsFrameProps> = ({
  filters,
  list,
  listFooter,
  details,
  detailsHeader,
  showListOnMobile = true,
  listClassName = "",
  detailsClassName = "",
}) => {
  const listPaneClasses = [
    "flex-1 min-h-0 overflow-hidden",
    showListOnMobile ? "block" : "hidden",
    "md:block",
    listClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const detailsPaneClasses = [
    "hidden md:flex md:flex-col md:min-h-0 md:w-1/2 overflow-hidden",
    detailsClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="shrink-0">{filters}</div>

      <div className="flex-1 min-h-0 overflow-hidden md:flex md:items-stretch">
        <div className={listPaneClasses}>{list}</div>
        {details && (
          <div className={detailsPaneClasses}>
            {detailsHeader && <div className="shrink-0">{detailsHeader}</div>}
            <div className="flex-1 min-h-0 overflow-hidden">{details}</div>
          </div>
        )}
      </div>

      {listFooter && <div className="shrink-0">{listFooter}</div>}
    </div>
  );
};
