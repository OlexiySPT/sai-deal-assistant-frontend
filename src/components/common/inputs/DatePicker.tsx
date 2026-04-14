import React from "react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/datepicker-dark.css";

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Simple date picker for filter panels (no edit/save, just select date and propagate ISO string or null)
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  minDate,
  maxDate,
}) => {
  return (
    <DatePickerLib
      selected={value ? new Date(value) : null}
      onChange={(date: Date | null) => {
        onChange(date ? date.toISOString().slice(0, 10) : null);
      }}
      dateFormat="yyyy-MM-dd"
      className={className}
      placeholderText={placeholder}
      isClearable
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

export default DatePicker;
