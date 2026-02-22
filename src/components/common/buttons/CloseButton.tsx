import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const closeIcon = (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function CloseButton(
  props: Omit<IconActionButtonProps, "colorClass" | "icon" | "ariaLabel">,
) {
  return (
    <IconActionButton
      {...props}
      colorClass="gray"
      ariaLabel="Close"
      icon={closeIcon}
      className={`w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors ${props.className || ""}`}
      title={props.title || "Close"}
    />
  );
}
