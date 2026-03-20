import React, { useState } from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../StylingUtil";
import AutocompleteInput from "./AutocompleteInput";
import { text } from "../../cva/text-cva";
import { input } from "../../cva/input-cva";

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
      valueType={EditableFieldValueType.String}
      readView={function (): React.ReactNode {
        if (!value) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
        }
        return <span className={text({ style: "value", size })}>{value}</span>;
      }}
      editView={function ({
        inputValue,
        setInputValue,
        handleCancel,
        handleSave,
      }: EditableFieldFrameChildProps): React.ReactNode {
        return (
          <AutocompleteInput
            className={input({ size })}
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
