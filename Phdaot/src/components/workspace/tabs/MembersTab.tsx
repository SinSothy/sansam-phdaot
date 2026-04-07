'use client'

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useMemberStore } from "@/api/store/useMemberStore";

interface MembersTabProps {
  workspaceId: string;
}

export function MembersTab({ workspaceId }: MembersTabProps) {
  const t = useTranslations('WorkspaceSettings.members');
  const commonT = useTranslations('Common');
  const teamT = useTranslations('Team');
  
  // Note: In a real app we'd filter members by workspaceId
  // For this implementation we use the general member store
  const { members } = useMemberStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface">{t('title')}</h2>
          <p className="text-sm text-secondary">{t('description')}</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          {t('invite')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={member.id}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-on-primary font-bold shadow-sm"
              style={{ backgroundColor: member.avatarColor || '#3b82f6' }}
            >
              {member.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-on-surface truncate">{member.name}</h4>
              <p className="text-xs text-secondary truncate">{member.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`
                px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                ${member.role === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}
              `}>
                {member.role}
              </span>
              <p className="text-[10px] text-outline font-medium">
                {teamT('lastActive', { time: member.lastActive || 'recently' })}
              </p>
            </div>
          </motion.div>
        ))}

        {members.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-secondary bg-surface-container-high/20 rounded-3xl border-2 border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-5xl mb-3 text-outline-variant">group_off</span>
            <p className="font-bold text-lg">{teamT('noMembersFound')}</p>
            <p className="text-sm opacity-60">Try inviting someone to your workspace!</p>
          </div>
        )}
      </div>
    </div>
  );
}
