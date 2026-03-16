import React from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../sizeUtils";

interface EditableNumberFieldProps {
  value: number | null | undefined;
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
  decimalAccuracy?: number; // Number of digits after decimal point
  thousandsSeparator?: boolean; // Whether to use thousands separator
}

function formatNumber(
  value: number | null | undefined,
  decimalAccuracy: number = 0,
  thousandsSeparator: boolean = false,
): string {
  if (value === null || value === undefined || isNaN(value)) return "(empty)";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimalAccuracy,
    maximumFractionDigits: decimalAccuracy,
    useGrouping: thousandsSeparator,
  });
}

export default function EditableNumberField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
  decimalAccuracy = 0,
  thousandsSeparator = false,
}: EditableNumberFieldProps) {
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
        if (value === null || value === undefined || isNaN(value)) {
          return <span className="text-gray-400">(empty)</span>;
        }
        return (
          <span className="px-2 py-1 bg-transparent w-full block truncate">
            {formatNumber(value, decimalAccuracy, thousandsSeparator)}
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
            className={`h-${getControlHeightBySize(size)} input border rounded px-2 py-1 w-full block truncate hide-number-spin`} // Add custom class
            type="number"
            step={decimalAccuracy > 0 ? Math.pow(10, -decimalAccuracy) : 1}
            value={inputValue ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val === "" ? null : Number(val));
            }}
            disabled={loading}
            autoFocus
            onKeyDown={handleKeyDown}
            style={{
              MozAppearance: "textfield",
            }}
          />
        );
      }}
    />
  );
}
