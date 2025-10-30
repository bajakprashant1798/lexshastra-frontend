"use client";

import clsx from "clsx";

/**
 * Production-grade Button component.
 * Variants: primary | outline | ghost
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ring-ring cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-black hover:bg-primary/90 active:scale-[0.97] shadow-sm",
    outline:
      "border border-border/50 text-foreground hover:bg-foreground/10 active:scale-[0.97]",
    ghost:
      "text-foreground hover:bg-foreground/10 active:scale-[0.97]",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
