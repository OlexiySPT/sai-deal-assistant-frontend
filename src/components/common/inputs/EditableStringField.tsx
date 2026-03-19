import React, { useState } from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../StylingUtil";
import { text } from "../../cva/text.cva";
import { input } from "../../cva/input.cva";

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
      valueType={EditableFieldValueType.String}
      readView={function (): React.ReactNode {
        if (!value) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
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
              className={text({ style: "url", size })}
            >
              {value}
            </a>
          );
        }
        return <div className={text({ style: "value", size })}>{value}</div>;
      }}
      editView={function ({
        inputValue,
        setInputValue,
        loading,
        handleKeyDown,
      }: EditableFieldFrameChildProps): React.ReactNode {
        return (
          <input
            className={input({ size })}
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
