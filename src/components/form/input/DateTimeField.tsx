import React, { FC } from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface DateTimeFieldProps {
  label?: string;
  name?: string;
  type: "date" | "time";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  maxDate?: string;
  minDate?: string;
  widthClass?: string;
}

const DateTimeField: FC<DateTimeFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  maxDate,
  minDate,
  widthClass = '40'
}) => {
  const handleDateTimeChange = (newValue: any) => {
    if (!onChange) return;

    const fakeEvent = {
      target: {
        name,
        value: newValue
          ? type === "date"
            ? dayjs(newValue).format("YYYY-MM-DD")
            : dayjs(newValue).format("HH:mm")
          : "",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent);
  };

  const inputClasses = `h-9 w-full text-xs border-b bg-transparent px-1 py-1 
    placeholder:text-gray-400 focus:outline-none focus:ring-0 
    dark:bg-transparent dark:text-white dark:placeholder:text-white/30 
    ${disabled ? "text-gray-500 border-gray-300 opacity-50 cursor-not-allowed" : ""}
    ${error ? "border-error-500 focus:border-error-400" : "border-gray-300 focus:border-brand-500"}`;

  return (
    <div className={`relative w-${widthClass}`}>
      {label && (
        <label htmlFor={name} className="text-xs text-gray-600 dark:text-white mb-0.5 block">
          {label}
        </label>
      )}
      <div className="w-full">
        {type === "date" ? (
          <DatePicker
            // maxDate={dayjs(maxDate || new Date())}
            maxDate={maxDate ? dayjs(maxDate) : undefined}

            minDate={minDate ? dayjs(minDate) : undefined}
            format="DD/MM/YYYY" // shorter format
            value={value ? dayjs(value) : null}
            onChange={handleDateTimeChange}
            disabled={disabled}
            slotProps={{
              textField: {
                id: name,
                name: name,
                variant: "standard",
                fullWidth: true,
                placeholder: "DD/MM/YYYY",
                InputProps: {
                  disableUnderline: true,
                  className: inputClasses + ' text-xs',
                  style: { fontSize: '13px' },
                },
                InputLabelProps: {
                  shrink: true,
                },
              },
            }}
          />

        ) : (
          <TimePicker
            value={value ? dayjs(`2025-01-01T${value}`) : null}
            onChange={handleDateTimeChange}
            disabled={disabled}
            slotProps={{
              textField: {
                id: name,
                name: name,
                variant: "standard",
                fullWidth: true,
                InputProps: {
                  disableUnderline: true,
                  className: inputClasses,
                },
                InputLabelProps: {
                  shrink: true,
                },
              },
            }}
          />
        )}
      </div>
      {helperText && (
        <p className={`mt-0.5 text-[10px] ${error ? "text-error-500" : "text-gray-500"}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default DateTimeField;
