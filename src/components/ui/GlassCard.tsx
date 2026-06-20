"use client";

import { type ReactNode } from "react";
import { m as motion, type HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Extra Tailwind classes */
  className?: string;
  /** Enable hover lift + shadow effect */
  hover?: boolean;
  /** Glass intensity variant */
  variant?: "default" | "strong" | "subtle";
}

const variantClasses: Record<NonNullable<GlassCardProps["variant"]>, string> = {
  default: "glass rounded-2xl",
  strong: "glass-strong rounded-2xl",
  subtle: "glass-subtle rounded-2xl",
};

export default function GlassCard({
  children,
  className = "",
  hover = false,
  variant = "default",
  ...motionProps
}: GlassCardProps) {
  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow:
                "0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 8px 20px -8px rgba(5, 150, 105, 0.08)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
