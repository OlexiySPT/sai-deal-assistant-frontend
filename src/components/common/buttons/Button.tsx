import React from "react";
import { button } from "../../cva/button.cva";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${button({ colorClass: variant === "primary" ? "blue" : "grey", size: "md" })} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
