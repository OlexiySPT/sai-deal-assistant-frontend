import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/datepicker-dark.css";
import EditableFieldFrame, {
  EditableFieldFrameChildProps,
  EditableFieldValueType,
} from "./frames/EditableFieldFrame";
import { SizeType } from "../StylingUtil";
import { text } from "../../cva/text-cva";
import { input } from "../../cva/input-cva";

interface EditableDateTimeFieldProps {
  value: string | null | undefined; // ISO date-time string
  entity: string;
  field: string;
  id: number;
  validation?: "None" | "NotNull" | "NotEmpty";
  onUpdated?: () => void;
  label?: string;
  size?: SizeType;
  width?: string;
}

export default function EditableDateTimeField({
  value,
  entity,
  field,
  id,
  validation = "None",
  onUpdated,
  label,
  size = "sm",
  width,
}: EditableDateTimeFieldProps) {
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
      valueType={EditableFieldValueType.DateTime}
      width={width}
      readView={function (): React.ReactNode {
        if (!value) {
          return (
            <span className={text({ style: "value", size })}>(empty)</span>
          );
        }
        let formatted = value;
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
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
        const dateValue = inputValue ? new Date(inputValue as string) : null;
        return (
          <DatePicker
            selected={dateValue}
            onChange={(date: Date | null) => {
              setInputValue(date ? date.toISOString() : null);
            }}
            showTimeSelect
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            className={input({ size })}
            disabled={loading}
            autoFocus
            onKeyDown={(event) =>
              handleKeyDown(event as React.KeyboardEvent<HTMLInputElement>)
            }
            placeholderText="Select date & time"
          />
        );
      }}
    />
  );
}
