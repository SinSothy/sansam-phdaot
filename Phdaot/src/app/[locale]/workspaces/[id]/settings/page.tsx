'use client'

import React, { use } from "react";
import { useSearchParams } from "next/navigation";
import { useWorkspaceStore } from "@/api/store/useWorkspaceStore";
import { WorkspaceSettingsLayout } from "@/components/workspace/WorkspaceSettingsLayout";
import { BoardsTab } from "@/components/workspace/tabs/BoardsTab";
import { MembersTab } from "@/components/workspace/tabs/MembersTab";
import { GeneralSettingsTab } from "@/components/workspace/tabs/GeneralSettingsTab";
import { useRouter } from "@/i18n/navigation";

interface WorkspaceSettingsPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'boards';
  const router = useRouter();

  const { workspaces, isLoadingWorkspaces } = useWorkspaceStore();
  const workspace = workspaces.find((ws) => ws.id === id);

  if (isLoadingWorkspaces && !workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-container-lowest">
        <span className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-lowest gap-4">
        <span className="material-symbols-outlined text-6xl text-error">warning</span>
        <h2 className="text-2xl font-bold font-headline">Workspace Not Found</h2>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'boards':
        return <BoardsTab boards={workspace.boards || []} />;
      case 'members':
        return <MembersTab workspaceId={workspace.id} />;
      case 'settings':
        return <GeneralSettingsTab workspace={workspace} />;
      default:
        return <BoardsTab boards={workspace.boards || []} />;
    }
  };

  return (
    <WorkspaceSettingsLayout 
      activeTab={activeTab} 
      workspaceName={workspace.name}
      workspaceId={workspace.id}
    >
      {renderTabContent()}
    </WorkspaceSettingsLayout>
  );
}
