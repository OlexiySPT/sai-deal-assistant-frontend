import React, { useState } from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
} from "./frames/EditableFieldFrame";
import { SizeType } from "../sizeUtils";

interface EditableStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
}

export default function EditableStringField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
}: EditableStringFieldProps) {
  return (
    <EditableFieldFrame
      value={value}
      entity={entity}
      field={field}
      id={id}
      validation={validation}
      onUpdated={onUpdated}
      label={label}
      size={size}
      readView={function (): React.ReactNode {
        if (!value) {
          return <span className="text-gray-400">(empty)</span>;
        }
        // URL detection
        let isUrl = false;
        try {
          const url = new URL(value);
          isUrl = url.protocol === "http:" || url.protocol === "https:";
        } catch {}
        if (isUrl) {
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 hover:underline px-2 py-1 bg-transparent w-full block truncate`}
            >
              {value}
            </a>
          );
        }
        return (
          <span className={`px-2 py-1 bg-transparent w-full block truncate`}>
            {value}
          </span>
        );
      }}
      editView={function ({
        inputValue,
        setInputValue,
        loading,
        handleKeyDown,
      }: EditableFieldFrameChildProps): React.ReactNode {
        return (
          <input
            className={"input border rounded px-2 py-1 w-full block truncate"}
            type="text"
            value={inputValue as string}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        );
      }}
    />
  );
}
