import React, { useState } from "react";

interface TextareaProps {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  hint?: string;
  maxLength?: number;
}

const TextArea: React.FC<TextareaProps> = ({
  label = "Text Area",
  placeholder = "Enter your message",
  name,
  rows = 3,
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  errorMessage,
  hint = "",
  maxLength = 2000+200,
}) => {
  const [charCount, setCharCount] = useState(value?.length || 0);
  


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setCharCount(e.target.value.length);
      onChange(e); // Pass full event to parent
    }
  };

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className}`;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
  } else {
    textareaClasses += ` bg-transparent text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="text-sm text-gray-600 dark:text-white mb-1 block">
          {label}
          <span className="text-error-500"> *</span>
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={maxLength}
        className={textareaClasses}
      />
      <div className="flex justify-between text-xs mt-1">
        {errorMessage ? (
          <p className="text-error-500">{errorMessage}</p>
        ) : (
          hint && (
            <p className={`text-sm ${error ? "text-error-500" : "text-gray-500 dark:text-gray-400"}`}>
              {hint}
            </p>
          )
        )}
        {/* <span className="text-gray-500 dark:text-gray-400">
          {charCount}/{maxLength} characters
        </span> */}
      </div>

    </div>
  );
};

export default TextArea;
