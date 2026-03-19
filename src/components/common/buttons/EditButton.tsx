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
      points="24,20 1,20 1,1 24,1"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <line
      x1="12"
      y1="4"
      x2="12"
      y2="16"
      stroke="currentColor"
      strokeWidth="1"
    />{" "}
    <line x1="9" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1" />
    <line
      x1="9"
      y1="16"
      x2="15"
      y2="16"
      stroke="currentColor"
      strokeWidth="1"
    />
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
