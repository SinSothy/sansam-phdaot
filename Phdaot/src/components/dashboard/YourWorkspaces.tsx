'use client'

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { boardManager } from "@/api/managers/board.manager";
import { useWorkspaceStore } from "@/api/store/useWorkspaceStore";
import { useUIStore } from "@/api/store/useUIStore";
import { toast } from "sonner";
import { EmptyWorkspace } from "./EmptyWorkspace";
import { BoardCard } from "@/components/ui/BoardCard";
import { BoardStatus } from "@/api/types";
import { RecentlyViewed } from "./RecentlyViewed";
import { useRouter } from "@/i18n/navigation";

export function YourWorkspaces() {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { workspaces, isLoadingWorkspaces } = useWorkspaceStore();
  const { openCreateBoard, openCreateWorkspace } = useUIStore();

  useEffect(() => {
    // Initial fetch of workspaces with their boards (Senior optimization)
    boardManager.fetchDashboardData();
  }, []);



  if (isLoadingWorkspaces && workspaces.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <EmptyWorkspace onCreateClick={openCreateWorkspace} />
    );
  }

  const getStatusColor = (status: BoardStatus) => {
    switch (status) {
      case BoardStatus.ACTIVE: return "bg-emerald-500";
      case BoardStatus.UPDATING: return "bg-amber-500";
      case BoardStatus.ARCHIVED: return "bg-slate-300";
      default: return "bg-slate-300";
    }
  };

  // Senior Optimization: Filter all active boards across all workspaces for the summary section
  const allActiveBoards = workspaces
    .flatMap((workspace) => workspace.boards || [])
    .filter((board) => board.status === BoardStatus.ACTIVE);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <RecentlyViewed boards={allActiveBoards} />
      
      <section className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">workspaces</span>
            <h3 className="text-lg font-bold font-headline uppercase tracking-tight">{t('yourWorkspaces')}</h3>
          </div>
        </div>

        {workspaces.map((workspace) => (
          <div key={workspace.id} className="mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-extrabold shadow-sm border border-primary/10">
                {workspace.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-lg text-on-surface tracking-tight">{workspace.name}</h4>
                <p className="text-xs text-secondary font-medium">{workspace.description || t('workspaceLabel')}</p>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button className="px-4 py-2 bg-surface-container-low text-xs font-bold rounded-xl hover:bg-surface-container-high transition-all text-secondary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  {t('boards')}
                </button>
                <button className="px-4 py-2 text-xs font-bold rounded-xl hover:bg-surface-container-high transition-all text-secondary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  {t('membersCount', { count: 0 })}
                </button>
                <button 
                  onClick={() => router.push(`/workspaces/${workspace.id}/settings`)}
                  className="px-4 py-2 text-xs font-bold rounded-xl hover:bg-surface-container-high transition-all text-secondary flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">settings</span>
                  {t('settings')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Render Actual Boards */}
              {workspace.boards?.map((board) => (
                <BoardCard
                  key={board.id}
                  title={board.name}
                  gradientFrom="from-primary/40"
                  gradientTo="to-secondary/40"
                  imageUrl={board.is_image ? board.background : undefined}
                  bgColor={!board.is_image ? board.background : undefined}
                  statusColor={getStatusColor(board.status)}
                  statusText={t(board.status.toLowerCase() as any)}
                  href={`/planner/${board.id}`}
                />
              ))}

              {/* Create New Board Card */}
              <button
                onClick={openCreateBoard}
                className="group relative h-40 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xl active:scale-[0.98] bg-surface-container-lowest"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </div>
                <span className="font-bold text-sm text-secondary group-hover:text-primary transition-colors">{t('createNewBoard')}</span>
              </button>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
