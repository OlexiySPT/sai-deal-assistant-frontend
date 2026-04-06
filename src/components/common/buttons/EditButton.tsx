import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-[0.9em] w-[0.9em]"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 20l3.75-.75L18.5 8.5a1.414 1.414 0 0 0 0-2L17.5 5.5a1.414 1.414 0 0 0-2 0L4.75 16.25 4 20z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 6.5l3 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
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
