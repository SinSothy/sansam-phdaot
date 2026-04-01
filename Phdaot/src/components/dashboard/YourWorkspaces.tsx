"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CreateBoardDialog, BoardData } from "./CreateBoardDialog";
import { toast } from "sonner";

export function YourWorkspaces() {
  const t = useTranslations('Dashboard');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleCreateBoard = (data: BoardData) => {
    console.log("Creating board:", data);
    toast.success(t('newBoardInWorkspace', { workspace: data.workspace }), {
      description: data.title,
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">workspaces</span>
          <h3 className="text-lg font-bold font-headline uppercase">{t('yourWorkspaces')}</h3>
        </div>
      </div>

      {/* Workspace Item: Design System Team */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
            DS
          </div>
          <div>
            <h4 className="font-bold text-base">{t('designSystemTeam')}</h4>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-3 py-1.5 bg-surface-container-low text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('boards')}</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('membersCount', { count: 12 })}</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-all">{t('settings')}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 4 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-blue-400 to-indigo-400" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.componentLibrary')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('active')}</span>
              </div>
            </div>
          </Link>
          {/* Card 5 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-orange-400 to-red-400" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.docHub')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('updating')}</span>
              </div>
            </div>
          </Link>
          {/* Card 6 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-purple-400 to-pink-400" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.brandAssets')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('active')}</span>
              </div>
            </div>
          </Link>
          {/* Card 7 */}
          <Link href="/planner" className="group relative h-40 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest transition-all hover:shadow-2xl hover:-translate-y-1 block">
            <div className="h-16 bg-gradient-to-r from-slate-400 to-slate-500" />
            <div className="p-4">
              <p className="font-bold text-sm text-on-surface">{t('boardTitles.archive2023')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{t('archived')}</span>
              </div>
            </div>
          </Link>
          
          {/* Create New Board Card */}
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="group relative h-40 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xl active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <span className="font-bold text-sm text-secondary group-hover:text-primary transition-colors">{t('createNewBoard')}</span>
          </button>
        </div>
      </div>

      <CreateBoardDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onCreate={handleCreateBoard}
      />
    </section>
  );
}
