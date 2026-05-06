import React from "react";
import { IconActionButton, IconActionButtonProps } from "./IconActionButton";

const clipboardIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12H7.5a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 7.5 4.5h9A2.25 2.25 0 0 1 18.75 6.75v3A2.25 2.25 0 0 1 16.5 12H15m-6 0h6m-3 0v8.25m-6-8.25h12a2.25 2.25 0 0 1 2.25 2.25v6.75A2.25 2.25 0 0 1 18 21.75H6A2.25 2.25 0 0 1 3.75 19.5V12.75A2.25 2.25 0 0 1 6 10.5Z"
    />
  </svg>
);

interface CopyToClipboardButtonProps extends Omit<
  IconActionButtonProps,
  "colorClass" | "icon" | "ariaLabel" | "value"
> {
  value?: string | null;
}

export default function CopyToClipboardButton({
  value,
  ...props
}: CopyToClipboardButtonProps) {
  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Silent failure if clipboard access is unavailable.
    }
  };

  return (
    <IconActionButton
      {...props}
      onClick={handleCopy}
      colorClass="grey"
      ariaLabel="Copy to clipboard"
      icon={clipboardIcon}
    />
  );
}
