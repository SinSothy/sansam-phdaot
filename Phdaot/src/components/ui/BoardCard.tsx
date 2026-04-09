import React from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BoardCardProps {
  title: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageUrl?: string;
  bgColor?: string;
  statusColor?: string;
  statusText?: string;
  href?: string;
}

/**
 * BoardCard Component
 * Refactored by Senior Frontend to provide a unified, premium look.
 * Backgrounds (images/colors/gradients) now consistently cover the entire card.
 */
export function BoardCard({ 
  title, 
  gradientFrom, 
  gradientTo, 
  imageUrl, 
  bgColor, 
  statusColor, 
  statusText, 
  href = "/planner" 
}: BoardCardProps) {
  
  // Base rendering for the background layer (always full card)
  // Refactored to always show a base color/gradient under the image as a fallback.
  const renderBackground = () => {
    const baseClass = "absolute inset-0 w-full h-full";
    
    return (
      <div className={cn(baseClass, bgColor || cn("bg-gradient-to-br", gradientFrom, gradientTo), "transition-all duration-500")}>
        {imageUrl && (
          <img 
            className="w-full h-full object-cover transition-opacity duration-500" 
            alt="Card Background" 
            src={imageUrl} 
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>
    );
  };

  // If no status provided: Large "Recently Viewed" Style
  if (!statusText) {
    return (
      <Link href={href} className="group relative h-32 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 block border border-white/10">
        {renderBackground()}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300" />
        <div className="relative p-4 h-full flex flex-col justify-between z-10">
          <span className="text-white font-bold text-sm tracking-wide drop-shadow-lg">{title}</span>
          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-lg drop-shadow-md">star</span>
          </div>
        </div>
      </Link>
    );
  }

  // If status provided: "Dashboard / Your Workspaces" Style
  // Refactored to use a glassmorphism overlay at the bottom instead of a top bar
  return (
    <Link href={href} className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 block border border-white/20">
      {renderBackground()}
      
      {/* Content overlay using glassmorphism at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-white/70 backdrop-blur-md border-t border-white/20 translate-y-0 transition-transform">
        <p className="font-extrabold text-sm text-slate-900 line-clamp-1 mb-1.5">{title}</p>
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full shadow-sm", statusColor)} />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{statusText}</span>
        </div>
      </div>

      {/* Hover effect to reveal more of the background */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </Link>
  );
}
