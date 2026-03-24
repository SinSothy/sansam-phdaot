import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', fullWidth = false, className, children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight transition-all outline-none rounded-xl active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:opacity-90 shadow-sm",
    default: "bg-primary text-on-primary hover:opacity-90 shadow-sm",
    secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed shadow-sm",
    ghost: "bg-transparent text-secondary hover:bg-surface-container-high hover:text-on-surface",
    destructive: "bg-error text-on-error hover:opacity-90 shadow-sm",
    outline: "border-2 border-outline-variant bg-transparent text-secondary hover:border-outline hover:text-on-surface"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "h-9 w-9"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)} 
      {...props}
    >
      {children}
    </button>
  );
}
