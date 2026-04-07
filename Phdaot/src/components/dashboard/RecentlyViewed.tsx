"use client";

import React from "react";
import { BoardCard } from "@/components/ui/BoardCard";
import { useTranslations } from "next-intl";
import { Board } from "@/api/types";

interface RecentlyViewedProps {
  boards: Board[];
}

/**
 * Dynamic Recently Viewed (now Active Boards) Component
 * Displays a list of active boards from across all workspaces.
 * Optimized by Senior Frontend: Auto-hides if no active boards are present.
 */
export function RecentlyViewed({ boards }: RecentlyViewedProps) {
  const t = useTranslations('Dashboard');

  // If no active boards across all workspaces, hide the entire section (Senior UX recommendation)
  if (!boards || boards.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
        </div>
        <h3 className="text-lg font-extrabold font-headline tracking-tight text-on-surface">
          {t('recentlyViewed')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {boards.map((board) => (
          <BoardCard 
            key={board.id}
            title={board.name}
            gradientFrom="from-primary/40"
            gradientTo="to-secondary/40"
            imageUrl={board.is_image ? board.background : undefined}
            bgColor={!board.is_image ? board.background : undefined}
            href={`/planner/${board.id}`}
          />
        ))}
      </div>
    </section>
  );
}
