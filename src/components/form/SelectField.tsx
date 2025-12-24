import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  name?: string;
  value: string;
  options: Option[] | string[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  disabled = false,
}) => {
  // Normalize options (string[] or {value,label}[])
  const normalizedOptions: Option[] =
    typeof options[0] === "string"
      ? (options as string[]).map((o) => ({
          value: o,
          label: o,
        }))
      : (options as Option[]);

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm text-gray-600 dark:text-gray-300">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          value
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      >
        {/* Placeholder */}
        <option style={{color:"black"}} value="" disabled>
          {placeholder}
        </option>

        {/* Options */}
        {normalizedOptions.map((option) => (
          <option style={{color:"black"}}
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
