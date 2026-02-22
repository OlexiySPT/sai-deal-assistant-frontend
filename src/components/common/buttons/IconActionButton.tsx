import React from "react";
import { getHeightBySize } from "../sizeUtils";

export interface IconActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  colorClass: string; // e.g. 'green' or 'red'
  icon: React.ReactNode;
  ariaLabel: string;
}

export function IconActionButton({
  size = "md",
  colorClass,
  icon,
  ariaLabel,
  className = "",
  ...props
}: IconActionButtonProps) {
  const colorStyles =
    colorClass === "green"
      ? `bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-300`
      : colorClass === "red"
        ? `bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-300`
        : colorClass === "grey"
          ? `bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-500`
          : "";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center rounded p-1 focus:outline-none transition-colors aspect-square ${
        colorStyles
      } w-${getHeightBySize(size)} h-${getHeightBySize(size)} disabled:opacity-50 disabled:pointer-events-none ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
