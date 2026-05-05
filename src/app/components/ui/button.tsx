import React from "react";
import { cn } from "./utils";

// buttonVariants kept for shadcn component compatibility (e.g. pagination.tsx)
export function buttonVariants(opts: { variant?: string; size?: string; className?: string } = {}) {
  const { variant = "default", size = "default", className = "" } = opts;
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
    outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
    secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
  };
  const sizes: Record<string, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-6",
    icon: "h-9 w-9",
  };
  return cn(base, variants[variant] ?? variants.default, sizes[size] ?? sizes.default, className);
}

type ButtonVariant = "default" | "primary" | "outline" | "ghost" | "danger";
type ButtonRounded = "none" | "sm" | "md" | "lg" | "xl" | "full";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  rounded?: ButtonRounded;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClassMap: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  primary: "bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300 shadow-sm",
  outline: "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 bg-transparent",
  ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300",
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 shadow-sm",
};

const roundedClassMap: Record<ButtonRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  rounded = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  type = "button",
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClassMap[variant],
        roundedClassMap[rounded],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

export { Button };
export default Button;

