
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-base font-semibold hover:bg-lime-hover",
  secondary:
    "bg-violet text-white font-semibold hover:opacity-90",
  ghost:
    "bg-elevated text-ink-primary border border-line hover:border-line-hover",
  outline:
    "bg-transparent text-lime border border-lime hover:bg-lime/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-14 px-8 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-lime focus-visible:ring-offset-2
        focus-visible:ring-offset-base
        disabled:opacity-40 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
