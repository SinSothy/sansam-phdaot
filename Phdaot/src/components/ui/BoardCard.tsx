import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BoardCardProps {
  title: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl?: string;
  statusColor?: string;
  statusText?: string;
  href?: string;
}

export function BoardCard({ title, gradientFrom, gradientTo, imageUrl, statusColor, statusText, href = "/planner" }: BoardCardProps) {
  // If no status provided, render the "Recently Viewed" large style card
  if (!statusText) {
    return (
      <Link href={href} className="group relative h-32 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 block">
        {imageUrl ? (
          <img className="absolute inset-0 w-full h-full object-cover" alt="Card Background" src={imageUrl} />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", gradientFrom, gradientTo)} />
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
        <div className="relative p-4 h-full flex flex-col justify-between">
          <span className="text-white font-bold text-sm tracking-wide">{title}</span>
          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-lg">star</span>
          </div>
        </div>
      </Link>
    );
  }

  // Otherwise render the "Your Workspaces" stacked card style
  return (
    <Link href={href} className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
      <div className={cn("h-16 bg-gradient-to-r", gradientFrom, gradientTo)} />
      <div className="p-4">
        <p className="font-bold text-sm text-on-surface">{title}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn("w-2 h-2 rounded-full", statusColor)} />
          <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{statusText}</span>
        </div>
      </div>
    </Link>
  );
}
