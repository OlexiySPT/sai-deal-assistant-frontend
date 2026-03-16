import React from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../sizeUtils";

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
      readView={function (): React.ReactNode {
        const selected = options.find((opt) => opt.id === value);
        if (!selected) {
          return <span className="text-gray-400">(empty)</span>;
        }
        return (
          <span className="px-2 py-1 bg-transparent w-full block truncate">
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
            className={`h-${getControlHeightBySize(size)} input border rounded px-2 py-1 w-full block truncate`}
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
