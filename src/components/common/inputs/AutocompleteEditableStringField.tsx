import React, { useState } from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
} from "./frames/EditableFieldFrame";
import { SizeType } from "../sizeUtils";
import AutocompleteInput from "./AutocompleteInput";

interface AutocompleteEditableStringFieldProps {
  value: string | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Email" | "Url";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
  options: string[];
}

export default function AutocompleteEditableStringField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
  options,
}: AutocompleteEditableStringFieldProps) {
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
        return (
          <span className={`px-2 py-1 bg-transparent w-full block truncate`}>
            {value}
          </span>
        );
      }}
      editView={function ({
        inputValue,
        setInputValue,
        handleCancel,
        handleSave,
      }: EditableFieldFrameChildProps): React.ReactNode {
        return (
          <AutocompleteInput
            className={"input border rounded px-2 py-1 w-full block truncate"}
            value={inputValue}
            onChange={setInputValue}
            suggestions={Array.isArray(options) ? options : []}
            showAllOnEmpty={true}
            onEnterPressed={handleSave}
            onEscapePressed={handleCancel}
          />
        );
      }}
    />
  );
}
