'use client'

import React from "react";
import { useTranslations } from "next-intl";
import { BoardCard } from "@/components/ui/BoardCard";
import { Board, BoardStatus } from "@/api/types";

interface BoardsTabProps {
  boards: Board[];
}

export function BoardsTab({ boards }: BoardsTabProps) {
  const t = useTranslations('WorkspaceSettings.boards');
  const dashT = useTranslations('Dashboard');

  const getStatusColor = (status: BoardStatus) => {
    switch (status) {
      case BoardStatus.ACTIVE: return "bg-emerald-500";
      case BoardStatus.UPDATING: return "bg-amber-500";
      case BoardStatus.ARCHIVED: return "bg-slate-300";
      default: return "bg-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface">{t('title')}</h2>
          <p className="text-sm text-secondary">{t('description', { count: boards.length })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            title={board.name}
            gradientFrom="from-primary/40"
            gradientTo="to-secondary/40"
            imageUrl={board.is_image ? board.background : undefined}
            bgColor={!board.is_image ? board.background : undefined}
            statusColor={getStatusColor(board.status)}
            statusText={dashT(board.status.toLowerCase() as any)}
            href={`/planner/${board.id}`}
          />
        ))}

        {boards.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-secondary bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">grid_view_sad</span>
            <p className="font-bold">No boards found in this workspace</p>
          </div>
        )}
      </div>
    </div>
  );
}
