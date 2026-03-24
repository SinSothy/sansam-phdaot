import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: 'ghost' | 'surface' | 'primary';
}

export function IconButton({ icon, variant = 'ghost', className, ...props }: IconButtonProps) {
  
  const baseClasses = "p-2 transition-colors duration-200 rounded-lg flex items-center justify-center outline-none";
  const variants = {
    ghost: "text-on-surface-variant hover:bg-surface-container-low",
    surface: "text-secondary hover:bg-surface-container-high bg-surface-container-low",
    primary: "text-on-primary bg-primary hover:opacity-90 active:scale-95"
  };

  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
