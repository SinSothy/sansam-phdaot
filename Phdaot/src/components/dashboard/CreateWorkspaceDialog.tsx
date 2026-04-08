"use client";

import React, { useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { Typography } from "@/components/ui/Typography";
import { boardManager } from "@/api/managers/board.manager";
import { CreateWorkspaceRequest } from "@/api/types";
import { toast } from "sonner";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (workspace: any) => void;
}

export function CreateWorkspaceDialog({ isOpen, onClose, onCreate }: CreateWorkspaceDialogProps) {
  const t = useTranslations("Dashboard.createWorkspace");
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<CreateWorkspaceRequest>({
    userID: "",
    name: "",
    description: "",
    slug: "",
  });
  const [workspaceType, setWorkspaceType] = useState("marketing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const workspaceNameId = useId();

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error(t("nameLabel") + " is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalData = {
        ...formData,
        userID: "d933b066-f00a-4402-a782-c731a481c823",
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      };

      const newWorkspace = await boardManager.createWorkspace(finalData);
      if (onCreate) onCreate(newWorkspace);
      onClose();
      setFormData({ name: "", description: "", slug: "", userID: "" });
    } catch (error) {
      // Error handling managed by manager
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop - Standardized with CreateBoardDialog */}
      <div
        className="absolute inset-0 bg-on-surface/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Content - Standardized Width and Style */}
      <div
        className={cn(
          "relative w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 border border-white/20",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* Top Banner - Standardized with Premium Gradient */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#002B5B] via-primary to-primary-container">
          {/* Abstract Glassmorphic Decorative Elements */}
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-primary-container/20 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="absolute bottom-8 left-10 right-20">
            <Typography variant="h2" className="text-3xl font-black text-on-primary tracking-tight leading-tight">
              {t('title')}
            </Typography>
            <p className="text-on-primary text-sm font-medium mt-2">
              {t('subtitle')}
            </p>
          </div>

          <IconButton
            icon="close"
            onClick={onClose}
            variant="ghost"
            className="absolute top-6 right-6 text-on-primary/60 hover:text-on-primary hover:bg-on-primary/10 transition-all rounded-full p-2"
          />
        </div>

        {/* Single Column Form - Restored Layout */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-w-2xl mx-auto">

          {/* Workspace Name Input */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface-variant ml-1" htmlFor={workspaceNameId}>
              {t('nameLabel')}
            </label>
            <div className="relative group">
              <input
                id={workspaceNameId}
                autoFocus
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-4 placeholder:text-outline-variant transition-all text-on-surface font-medium"
                placeholder={t('namePlaceholder')}
              />
              <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center" />
            </div>
          </div>

          {/* Workspace Type & Description Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-on-surface-variant ml-1">{t('typeLabel')}</label>
              <CustomSelect
                value={workspaceType}
                onSelect={setWorkspaceType}
                options={[
                  { label: t('types.marketing'), value: "marketing", icon: "campaign" },
                  { label: t('types.engineering'), value: "engineering", icon: "terminal" },
                  { label: t('types.sales'), value: "sales", icon: "payments" },
                  { label: t('types.design'), value: "design", icon: "palette" },
                  { label: t('types.operations'), value: "operations", icon: "settings_accessibility" },
                ]}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-on-surface-variant">{t('descriptionLabel')}</label>
                <span className="text-[10px] font-black uppercase tracking-widest text-outline opacity-60">
                  {t('optional')}
                </span>
              </div>
              <textarea
                rows={1}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('descriptionPlaceholder')}
                className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-4 placeholder:text-outline-variant transition-all text-on-surface font-medium resize-none shadow-sm"
              />
            </div>
          </div>

          {/* Standardized Footer Actions */}
          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              )}
              {t('submit')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 text-secondary font-semibold hover:bg-surface-container-high rounded-xl transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

interface CustomSelectProps {
  value: string;
  onSelect: (value: string) => void;
  options: { label: string; value: string; icon?: string }[];
}

function CustomSelect({ value, onSelect, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-4 transition-all text-on-surface font-medium shadow-sm hover:bg-surface-container-lowest",
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
          <div className="fixed inset-0 z-[80]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-[90] bg-white/95 backdrop-blur-xl border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold transition-colors rounded-xl",
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
                  {option.value === value && (
                    <span className="material-symbols-outlined text-primary text-lg font-fill">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
