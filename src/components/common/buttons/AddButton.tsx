import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const addIcon = (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export default function AddButton(
  props: Omit<IconActionButtonProps, "colorClass" | "icon" | "ariaLabel">,
) {
  return (
    <IconActionButton
      {...props}
      colorClass="blue"
      ariaLabel="Add"
      icon={addIcon}
      className={`w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors ${props.className || ""}`}
      title={props.title || "Add new deal"}
    />
  );
}
