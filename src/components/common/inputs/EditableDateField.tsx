import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/datepicker-dark.css";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { getControlHeightBySize, SizeType } from "../StylingUtil";
import { text } from "../../cva/text-cva";
import { input } from "../../cva/input-cva";

interface EditableDateFieldProps {
  value: string | null | undefined; // ISO date string (YYYY-MM-DD)
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty" | "Date";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
  width?: string;
}

export default function EditableDateField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
  width,
}: EditableDateFieldProps) {
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
      valueType={EditableFieldValueType.Date}
      width={width}
      readView={function (): React.ReactNode {
        if (!value) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
        }
        // Format date for display as yyyy-MM-dd
        let formatted = value;
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            formatted = `${year}-${month}-${day}`;
          }
        } catch {}
        return (
          <div className={text({ style: "value", size })}>{formatted}</div>
        );
      }}
      editView={function ({
        inputValue,
        setInputValue,
        loading,
        handleKeyDown,
      }: EditableFieldFrameChildProps): React.ReactNode {
        // inputValue is string (YYYY-MM-DD) or null
        const dateValue = inputValue ? new Date(inputValue as string) : null;
        return (
          <DatePicker
            selected={dateValue}
            onChange={(date: Date | null) => {
              setInputValue(date ? date.toISOString().slice(0, 10) : null);
            }}
            dateFormat="yyyy-MM-dd"
            className={input({ size })}
            disabled={loading}
            autoFocus
            onKeyDown={handleKeyDown}
            placeholderText="Select date"
          />
        );
      }}
    />
  );
}
