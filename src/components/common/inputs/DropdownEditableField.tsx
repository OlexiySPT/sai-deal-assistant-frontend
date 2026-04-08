import React from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../StylingUtil";
import { text } from "../../cva/text-cva";
import { input } from "../../cva/input-cva";

interface DropdownEditableFieldProps {
  value: number | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
  options: Array<{ id: number; value: string }>;
  width?: string;
}

export default function DropdownEditableField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
  options,
  width,
}: DropdownEditableFieldProps) {
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
      valueType={EditableFieldValueType.Number}
      width={width}
      readView={function (): React.ReactNode {
        const selected = options.find((opt) => opt.id === value);
        if (!selected) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
        }
        return (
          <span className={text({ style: "value", size })}>
            {selected.value}
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
          <select
            className={`${input({ size })}`}
            value={inputValue ?? ""}
            onChange={(e) => setInputValue(Number(e.target.value))}
          >
            {validation === "NotNull" ? null : (
              <option value="">(empty)</option>
            )}
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          </select>
        );
      }}
    />
  );
}
