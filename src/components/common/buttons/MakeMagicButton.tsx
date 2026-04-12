import React from "react";
import { IconActionButton } from "./IconActionButton";
import type { IconActionButtonProps } from "./IconActionButton";

// SVG for Magic Stick glyph
const MagicStickIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6.75 3.75 18.75m12-12 1.5-1.5m-7.5 7.5 1.5-1.5m6 6 1.5-1.5m-7.5 7.5 1.5-1.5M21 6.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>
);

export interface MakeMagicButtonProps extends Omit<
  IconActionButtonProps,
  "icon" | "ariaLabel"
> {
  ariaLabel?: string;
}

export const MakeMagicButton: React.FC<MakeMagicButtonProps> = ({
  size = "sm",
  colorClass = "primary",
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
