import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline
      points="24,19 1,19 1,5 24,5 24,19"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <line x1="6" y1="7" x2="6" y2="17" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default function EditButton(
  props: Omit<IconActionButtonProps, "colorClass" | "icon" | "ariaLabel">,
) {
  return (
    <IconActionButton
      {...props}
      colorClass="grey"
      ariaLabel="Edit"
      icon={editIcon}
    />
  );
}
