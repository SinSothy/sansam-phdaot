'use client'

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface WorkspaceSettingsLayoutProps {
  children: ReactNode;
  activeTab: string;
  workspaceName: string;
  workspaceId: string;
}

export function WorkspaceSettingsLayout({ 
  children, 
  activeTab, 
  workspaceName,
  workspaceId 
}: WorkspaceSettingsLayoutProps) {
  const t = useTranslations('WorkspaceSettings');

  const tabs: Tab[] = [
    { id: 'boards', label: t('tabs.boards'), icon: 'dashboard' },
    { id: 'members', label: t('tabs.members'), icon: 'group' },
    { id: 'settings', label: t('tabs.settings'), icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-black font-headline tracking-tight text-on-surface">
                {workspaceName}
              </h1>
              <p className="text-secondary font-medium">{t('pageSubtitle')}</p>
            </div>
          </div>

          {/* Premium Tab Navigation */}
          <nav className="flex items-center gap-1 p-1 bg-surface-container-high rounded-2xl w-fit">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={`/workspaces/${workspaceId}/settings?tab=${tab.id}`}
                  className={`
                    relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                    ${isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-surface-container-lowest border border-primary/10 shadow-sm rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="material-symbols-outlined text-[18px] relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Content Area */}
        <main className="bg-surface-container-low/50 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl shadow-primary/5 min-h-[500px]">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
