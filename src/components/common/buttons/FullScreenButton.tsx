import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const fullScreenIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 8V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2m-8 0H6a2 2 0 01-2-2v-2"
    />
  </svg>
);

export function FullScreenButton(
  props: Omit<IconActionButtonProps, "colorClass" | "icon" | "ariaLabel">,
) {
  return (
    <IconActionButton
      {...props}
      colorClass="grey"
      ariaLabel="Full Screen"
      icon={fullScreenIcon}
    />
  );
}

export default FullScreenButton;
