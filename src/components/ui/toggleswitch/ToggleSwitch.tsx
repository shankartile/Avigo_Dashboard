import React from 'react';
import { Tooltip } from '@mui/material';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  id?: string;
  tooltipTitle?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  id,
  tooltipTitle,
  disabled = false,
}) => {
  const toggleButton = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        disabled
          ? 'bg-gray-200 cursor-not-allowed blur-[1px] opacity-60'
          : checked
          ? 'bg-blue-600'
          : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // ✅ show different tooltip when disabled
  const effectiveTooltip = disabled ? 'Not publish yet' : tooltipTitle;

  return (
    <div className="flex items-center gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      {effectiveTooltip ? (
        <Tooltip title={effectiveTooltip}>
          <span>{toggleButton}</span>
        </Tooltip>
      ) : (
        toggleButton
      )}
    </div>
  );
};

export default ToggleSwitch;
