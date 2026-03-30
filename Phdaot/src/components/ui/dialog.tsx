"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";
import { Typography } from "./Typography";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  const content = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Container */}
      <div
        className={cn(
          "relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant overflow-hidden transform transition-all duration-300",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
          className
        )}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && <Typography variant="h2" className="text-xl">{title}</Typography>}
              {description && <Typography variant="body" className="text-sm opacity-70">{description}</Typography>}
            </div>
            <IconButton icon="close" onClick={onClose} variant="ghost" className="hover:bg-surface-container-high rounded-full" />
          </div>
          
          <div className="pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-4 border-t border-outline-variant mt-6", className)}>
      {children}
    </div>
  );
}
