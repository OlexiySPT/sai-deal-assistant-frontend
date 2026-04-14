import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/datepicker-dark.css";

interface DateTimePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Simple date-time picker for filter panels (no edit/save, just select date/time and propagate ISO string or null)
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date & time",
  className = "",
  minDate,
  maxDate,
}) => {
  return (
    <DatePicker
      selected={value ? new Date(value) : null}
      onChange={(date: Date | null) => {
        onChange(date ? date.toISOString() : null);
      }}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="yyyy-MM-dd HH:mm"
      className={className}
      placeholderText={placeholder}
      isClearable
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

export default DateTimePicker;
