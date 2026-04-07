"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CreateBoardDialog } from "@/components/dashboard/CreateBoardDialog";
import { CreateWorkspaceDialog } from "@/components/dashboard/CreateWorkspaceDialog";
import { useUIStore } from "@/api/store/useUIStore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

/**
 * Main application layout.
 * Optimized by Senior Frontend: Centralized Modal Management.
 * Dialogs are now global and triggered via the UI store.
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Dashboard');
  const { isCreateBoardOpen, isCreateWorkspaceOpen, toggleCreateBoard, toggleCreateWorkspace } = useUIStore();

  const handleCreateBoardSuccess = (data: any) => {
    // Show a success toast globally when a board is created successfully
    toast.success(t('newBoardInWorkspace', { workspace: data.workspace }), {
      description: data.title,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 min-w-0 transition-all duration-300">
          {children}
        </main>
      </div>

      {/* Global Dialogs - Managing state centrally prevents redundant component creation */}
      <CreateBoardDialog 
        isOpen={isCreateBoardOpen}
        onClose={() => toggleCreateBoard(false)}
        onCreate={handleCreateBoardSuccess}
      />
      <CreateWorkspaceDialog 
        isOpen={isCreateWorkspaceOpen}
        onClose={() => toggleCreateWorkspace(false)}
      />
    </div>
  );
}
