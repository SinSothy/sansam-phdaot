'use client'

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Workspace } from "@/api/types";
import { workspaceManager } from "@/api/managers/workspace.manager";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface GeneralSettingsTabProps {
  workspace: Workspace;
}

export function GeneralSettingsTab({ workspace }: GeneralSettingsTabProps) {
  const t = useTranslations('WorkspaceSettings');
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: workspace.name,
    description: workspace.description || "",
  });
  const [workspaceType, setWorkspaceType] = useState("marketing"); // Default or from workspace if available
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await workspaceManager.updateWorkspace({
        id: workspace.id,
        name: formData.name,
        description: formData.description,
      });
    } catch (error) {
      // Error handled by manager
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      await workspaceManager.deleteWorkspace(workspace.id);
      router.push("/");
    } catch (error) {
      // Error handled by manager
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12 max-w-3xl">
      {/* General Settings Form */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface">{t('general.title')}</h2>
          <p className="text-sm text-secondary">{t('general.description')}</p>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">{t('general.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 placeholder:text-outline-variant transition-all text-on-surface font-bold shadow-sm"
              placeholder={t('general.namePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">{t('general.type')}</label>
            <CustomSelect
              value={workspaceType}
              onSelect={setWorkspaceType}
              options={[
                { label: 'Marketing', value: "marketing", icon: "campaign" },
                { label: 'Engineering', value: "engineering", icon: "terminal" },
                { label: 'Sales', value: "sales", icon: "payments" },
                { label: 'Design', value: "design", icon: "palette" },
                { label: 'Operations', value: "operations", icon: "settings_accessibility" },
              ]}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-secondary ml-1">{t('general.descriptionLabel')}</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 placeholder:text-outline-variant transition-all text-on-surface font-medium resize-none shadow-sm"
              placeholder={t('general.descriptionPlaceholder')}
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isSaving || !formData.name.trim()}
              className="px-8 py-3.5 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />}
              {isSaving ? t('general.saving') : t('general.saveChanges')}
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="pt-10 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-error/10 text-error">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-headline text-error">{t('dangerZone.title')}</h3>
            <p className="text-xs text-secondary font-medium">{t('dangerZone.description')}</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-error/5 border border-error/20 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-bold text-on-surface-variant">
              {t('dangerZone.confirmDescription')}
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full max-w-md bg-surface-container-low border-none focus:ring-2 focus:ring-error rounded-xl px-4 py-3 placeholder:text-outline-variant transition-all text-error font-black shadow-inner"
              placeholder='Type "DELETE" to confirm'
            />
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting || deleteConfirmation !== "DELETE"}
            className="px-8 py-3 bg-error text-white font-bold rounded-xl shadow-lg shadow-error/20 hover:bg-error/90 hover:shadow-xl hover:shadow-error/30 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
          >
            {isDeleting && <span className="mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block align-middle" />}
            {t('dangerZone.deleteWorkspace')}
          </button>
        </div>
      </section>
    </div>
  );
}

// Reusing CustomSelect logic (simplified for this component)
function CustomSelect({ value, onSelect, options }: { value: string; onSelect: (v: string) => void; options: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 transition-all text-on-surface font-bold shadow-sm hover:bg-surface-container-lowest",
          isOpen && "ring-2 ring-primary"
        )}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <span className="material-symbols-outlined text-primary text-xl">
              {selectedOption.icon}
            </span>
          )}
          <span>{selectedOption?.label}</span>
        </div>
        <span className={cn(
          "material-symbols-outlined text-secondary transition-transform duration-200",
          isOpen && "rotate-180"
        )}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-[110] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold transition-all rounded-xl",
                  option.value === value
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                )}
              >
                {option.icon && (
                  <span className={cn(
                    "material-symbols-outlined text-xl",
                    option.value === value ? "text-primary font-fill" : "text-secondary"
                  )}>
                    {option.icon}
                  </span>
                )}
                <span className="flex-grow text-left uppercase tracking-tight">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
