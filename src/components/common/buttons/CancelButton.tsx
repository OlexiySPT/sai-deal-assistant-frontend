import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const cancelIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="18"
      x2="18"
      y2="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function CancelButton(
  props: Omit<IconActionButtonProps, "colorClass" | "icon" | "ariaLabel">,
) {
  return (
    <IconActionButton
      {...props}
      colorClass="red"
      ariaLabel="Cancel"
      icon={cancelIcon}
    />
  );
}
