import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'label' | 'caption';
  children: React.ReactNode;
}

export function Typography({ variant = 'body', className, children, ...props }: TypographyProps) {
  switch (variant) {
    case 'h1':
      return <h1 className={cn("text-4xl font-extrabold font-headline tracking-tight text-on-surface", className)} {...props}>{children}</h1>;
    case 'h2':
      return <h2 className={cn("text-2xl font-bold font-headline tracking-tight text-on-surface", className)} {...props}>{children}</h2>;
    case 'h3':
      return <h3 className={cn("text-lg font-bold font-headline tracking-tight text-on-surface uppercase", className)} {...props}>{children}</h3>;
    case 'h4':
      return <h4 className={cn("text-base font-bold font-headline text-on-surface", className)} {...props}>{children}</h4>;
    case 'h5':
      return <h5 className={cn("text-primary font-black text-xl font-headline tracking-tight", className)} {...props}>{children}</h5>;
    case 'label':
      return <span className={cn("text-sm font-semibold font-label text-secondary", className)} {...props}>{children}</span>;
    case 'caption':
        return <span className={cn("text-[10px] font-bold text-secondary uppercase tracking-tighter", className)} {...props}>{children}</span>;
    case 'body':
    default:
      return <p className={cn("text-sm font-medium font-body text-on-surface-variant", className)} {...props}>{children}</p>;
  }
}
