import React from "react";

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md";
}

const CancelButton: React.FC<CancelButtonProps> = ({
  size = "md",
  ...props
}) => (
  <button
    type="button"
    {...props}
    className={`inline-flex items-center justify-center rounded p-1 focus:outline-none transition-colors
      ${size === "sm" ? "w-7 h-7 text-base" : "w-8 h-8 text-lg"}
      bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700
      text-red-700 dark:text-red-300
      disabled:opacity-50 disabled:pointer-events-none
      ${props.className || ""}`}
    aria-label={props["aria-label"] || "Cancel"}
  >
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

export default CancelButton;
