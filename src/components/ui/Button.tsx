"use client";

import { type ReactNode } from "react";
import { m as motion, type HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children" | "disabled"
> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20",
  secondary:
    "bg-white/60 backdrop-blur-sm text-gray-800 border border-white/30 hover:bg-white/80",
  ghost: "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-white/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3 text-base rounded-xl gap-2.5",
};

const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...motionProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center font-medium transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? disabledStyles : ""}
        ${className}
      `}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={isDisabled}
      aria-busy={loading}
      {...motionProps}
    >
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}
