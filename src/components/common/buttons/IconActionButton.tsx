import React from "react";
import {
  ColorClassType,
  getControlHeightBySize,
  getHeightBySize,
  SizeType,
} from "../StylingUtil";
import { button } from "../../cva/button.cva";

export interface IconActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: SizeType;
  colorClass: ColorClassType;
  icon: React.ReactNode;
  ariaLabel: string;
}

export function IconActionButton({
  size = "sm",
  colorClass,
  icon,
  ariaLabel,
  className = "",
  ...props
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`${button({ colorClass, size })} ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
