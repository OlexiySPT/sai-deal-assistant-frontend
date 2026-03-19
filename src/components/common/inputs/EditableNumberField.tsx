import React from "react";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../StylingUtil";
import { input } from "../../cva/input.cva";
import { text } from "../../cva/text.cva";

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
      valueType={EditableFieldValueType.Number}
      readView={function (): React.ReactNode {
        if (value === null || value === undefined || isNaN(value)) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
        }
        return (
          <span className={text({ style: "value", size })}>
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
            className={`${input({ size })} hide-number-spin`} // Add custom class
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
