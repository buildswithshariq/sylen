import { type ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info";

interface BadgeProps {
  /** Badge label text */
  text: string;
  /** Semantic color variant */
  variant?: BadgeVariant;
  /** Optional leading icon (emoji or ReactNode) */
  icon?: ReactNode;
  /** Size variant */
  size?: "sm" | "md";
  /** Extra Tailwind classes */
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800 border-green-200/60",
  warning: "bg-amber-100 text-amber-800 border-amber-200/60",
  danger: "bg-red-100 text-red-800 border-red-200/60",
  info: "bg-sky-100 text-sky-800 border-sky-200/60",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function Badge({
  text,
  variant = "success",
  icon,
  size = "md",
  className = "",
}: Readonly<BadgeProps>) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {text}
    </span>
  );
}
