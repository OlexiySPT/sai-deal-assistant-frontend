import React from "react";

interface OkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md";
}

const OkButton: React.FC<OkButtonProps> = ({ size = "md", ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex items-center justify-center rounded p-1 focus:outline-none transition-colors
      ${size === "sm" ? "w-7 h-7 text-base" : "w-8 h-8 text-lg"}
      bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700
      text-green-700 dark:text-green-300
      disabled:opacity-50 disabled:pointer-events-none
      ${props.className || ""}`}
    aria-label={props["aria-label"] || "OK"}
  >
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

export default OkButton;
