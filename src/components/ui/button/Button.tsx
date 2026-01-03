import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "xs" | "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "gradient" | "secondary" | "customBlue"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "button" | "submit" | "reset";

}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "customBlue",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    xs: "px-3 py-2 text-sm",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {

    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    gradient:
      "text-black bg-[linear-gradient(270deg,_#ffe91b_8.66%,_#063f1f_103.05%)] hover:bg-[linear-gradient(270deg,_#e6d419_8.66%,_#052f17_103.05%)]",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    customBlue:
      "bg-[#255593] text-white hover:bg-[#1e467c] disabled:bg-[#8ca5c2]"
  };

  return (
    <button style={{ borderRadius: "10px" }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg  transition ${className} ${sizeClasses[size]
        } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
