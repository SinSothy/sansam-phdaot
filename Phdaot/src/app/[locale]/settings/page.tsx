"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const [workspace, setWorkspace] = useState({
    name: "Design System Team",
    description: "Premium Workspace for the UX/UI and Front-End engineering teams.",
    domain: "design-system",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = () => {
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage(t('saveSuccess'));
      setTimeout(() => setSaveMessage(""), 3000);
    }, 800);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(t('confirmDelete'));
    if (confirmDelete) {
      alert(t('deleteSuccess'));
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-10">
      <div>
        <Typography variant="h2">{t('pageTitle')}</Typography>
        <Typography variant="body">{t('pageDescription')}</Typography>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm space-y-8">
        <Typography variant="h4">{t('generalSettings')}</Typography>
        
        <div className="space-y-6 max-w-2xl">
          <Input 
            label={t('workspaceName')} 
            placeholder={t('workspaceNamePlaceholder')} 
            icon="workspaces"
            value={workspace.name}
            onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
          />
          <Input 
            label={t('workspaceDescription')} 
            placeholder={t('workspaceDescriptionPlaceholder')} 
            icon="description"
            value={workspace.description}
            onChange={(e) => setWorkspace({ ...workspace, description: e.target.value })}
          />
          <Input 
            label={t('workspaceDomain')} 
            placeholder={t('workspaceDomainPlaceholder')} 
            icon="link"
            value={workspace.domain}
            onChange={(e) => setWorkspace({ ...workspace, domain: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t('saving') : t('saveChanges')}
          </Button>
          {saveMessage && (
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      <div className="bg-error-container/20 p-8 rounded-3xl border border-error/20 space-y-4">
        <Typography variant="h4" className="text-error">{t('dangerZone')}</Typography>
        <Typography variant="body">
          {t('dangerZoneDescription')}
        </Typography>
        <div className="pt-2">
          <Button variant="destructive" onClick={handleDelete}>{t('deleteWorkspace')}</Button>
        </div>
      </div>
    </div>
  );
}
