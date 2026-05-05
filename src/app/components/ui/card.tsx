import React from "react";
import { cn } from "./utils";

type CardVariant = "default" | "ghost";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

const paddingClassMap: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const variantClassMap: Record<CardVariant, string> = {
  default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  ghost: "bg-transparent border-0",
};

const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  hoverable = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl shadow-sm",
        variantClassMap[variant],
        paddingClassMap[padding],
        hoverable && "transition-all duration-200 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

