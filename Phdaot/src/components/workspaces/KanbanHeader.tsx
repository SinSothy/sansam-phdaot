import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBoardStore } from '@/api/store/useBoardStore';
import { boardManager } from '@/api/managers/board.manager';
import { cn } from '@/lib/utils';


export function KanbanHeader({ boardId }: { boardId?: string }) {
  const t = useTranslations('Planner');
  const boards = useBoardStore((state) => state.boards);
  const board = boards.find(b => b.id === boardId);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (boardId && !board) {
      boardManager.fetchBoardDetail(boardId);
    }
  }, [boardId, board]);

  return (
    <header className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md w-full sticky top-[0px] z-40 flex items-center justify-between px-6 py-2 border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className={cn(
            "p-2 rounded-md transition-all active:scale-95 leading-none",
            isFavorited ? "text-amber-500" : "text-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80"
          )}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "" }}>
            {isFavorited ? "star" : "star_border"}
          </span>
        </button>
        <h1 className="font-headline font-extrabold text-2xl text-blue-700 dark:text-blue-400">
          {board?.name || "..."}
        </h1>
        {board && (
          <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {t(`header.visibility.${board.visibility.toLowerCase()}` as any, { defaultValue: board.visibility })}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-md transition-all">
          <span className="material-symbols-outlined text-xl">filter_list</span>
          <span className="text-sm">{t('header.filter')}</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-md transition-all">
          <span className="material-symbols-outlined text-xl">visibility</span>
          <span className="text-sm">{t('header.view')}</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-md transition-all">
          <span className="material-symbols-outlined text-xl">smart_toy</span>
          <span className="text-sm">{t('header.automation')}</span>
        </button>

        <button className="p-2 text-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-md transition-all leading-none border-l border-outline-variant/30 ml-2 pl-3">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
    </header>
  );
}

