import React from "react";
import { IconActionButton } from "./IconActionButton";
import type { IconActionButtonProps } from "./IconActionButton";

// SVG for magic glyph as a four-ray star
const MagicStickIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.5 0 L11 6.5 L17.5 8 L11 9.5 L9.5 16 L8 9.5 L1.5 8 L8 6.5 Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 20.5 L15.8 21.8 L15 23.1 L13.2 22 L15 20.5 Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 16.5 L14.8 17.7 L14 19 L12.2 17.8 L14 16.5 Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.8 11 L18.6 12.2 L17.8 13.4 L16 12.3 L17.8 11 Z"
    />
  </svg>
);

export interface MakeMagicButtonProps extends Omit<
  IconActionButtonProps,
  "icon" | "ariaLabel" | "colorClass"
> {
  ariaLabel?: string;
  colorClass?: IconActionButtonProps["colorClass"];
}

export const MakeMagicButton: React.FC<MakeMagicButtonProps> = ({
  size = "sm",
  colorClass = "grey",
  ariaLabel = "Make Magic",
  ...props
}) => (
  <IconActionButton
    size={size}
    colorClass={colorClass}
    icon={<MagicStickIcon />}
    ariaLabel={ariaLabel}
    {...props}
  />
);
