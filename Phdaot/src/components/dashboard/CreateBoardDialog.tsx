"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";
import { Typography } from "@/components/ui/Typography";

interface CreateBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (boardData: BoardData) => void;
}

export interface BoardData {
  title: string;
  workspace: string;
  visibility: "workspace" | "private" | "public";
  background: string;
  isImage: boolean;
}

const BACKGROUND_PHOTOS = [
  {
    id: "mountain",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6bmxQPy5swyTvQBfS0YPQx7taaRWfC6NRiD1jLp5sim_IF8rPNPoLsIvZHkSP8vw-k0SkpzjD1Af9nVnxKLPMKx5Jq91WA-ysefd0ryfnqjtn6Wc3wPbq8xGgM-rmPvnQT6U1jIhLIJaqKu-Gf-SrDOQXgBhqWbN4WyO9w8L3fXR3NWCPpBQQFhr_RWfghOdS5kHAktuxH0cLUE6sjYDx7s8avhIA-XVxHgtsbQV9CH_jr9ArC5DIb05AoxIFaVfZN3mpPtHW",
    alt: "Mountain peaks under blue sky",
  },
  {
    id: "forest",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8qtymcmw30BEF7bc86ew_0Bja40iTs5RgFA0QsfCUCwQEn_IieDWAXlQAoZ2e93Kg0or1MOXpPoktAyY716dVTp40A0xjp8oMDRDveUno__RtCtF3XuscLJKwAu5ZBMw4-906v7crcBzz9zhylyyJmUsiVyIf2xrw-OJRGAdkcBHt1Qarydm2K402pY3R7IgBb_gDBbMcyJ7q_fT3QN9MFJ-xyaBBYGKtMObRJ18-Ri6LDdBS5-BkHkixpipM-wPTy3jGtsbd",
    alt: "Lush green forest floor",
  },
  {
    id: "fog",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4HRSzFxNY43TY9SeSdGhYueeVVkTVCYpVrjaEGZ_vyxQfYU7n7DOJheBvP796UHl8hZZY4nFDAgpGXbTFjeQ9ZlRvkDTBTTMNywN-w9lWg_CPOvs1c4fzRXxjrtmXvbt_owvQmPI-3cfLtzfMIub3GzTfeVxhE__O3T3hp8CQJQJJQcw4mdgv5fWMsyFVQp-VzzCJ4eMJ1IEhfBDIDKPjMQRokXbOCAjYcOJ2G-_F878r_OM0A5r3Slg-JjMuBqLBd7IaLxQp",
    alt: "Ethereal misty pine forest",
  },
  {
    id: "redwood",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_piGRte1f2MpSSkTX-X7jC4B98XfEeP3ALEUaSiaRn_-AYPOVgbmJB75p2VI6f0G7lB_o-VmDPodXz1vplGNp8s2mWjwAbb0cflEMgd8DdakVO16h3Lqqv-FJNl_dxDPf6P-juroDoJyAiyRfn1COsz5jxKI8Pfd2iILmtQiiFfj-ihrq3YvPL-wPHoS8aSxlYDatCfpGclEiFOFZtE-IlVWNFXS5duMg7-fPm0NEwPsXc2ThJV2XeEl9lTTCtlAOL_YkfswX",
    alt: "Sunlight through redwood trees",
  },
];

const COLORS = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-rose-600",
  "bg-slate-500",
];

export function CreateBoardDialog({ isOpen, onClose, onCreate }: CreateBoardDialogProps) {
  const t = useTranslations("Dashboard");
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [workspace, setWorkspace] = useState("Engineering Team");
  const [visibility, setVisibility] = useState<"workspace" | "private" | "public">("workspace");
  const [background, setBackground] = useState(BACKGROUND_PHOTOS[0].url);
  const [isImage, setIsImage] = useState(true);

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

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({
      title,
      workspace,
      visibility,
      background,
      isImage
    });
    // Reset form
    setTitle("");
    onClose();
  };

  const content = (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/20 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 border border-white/20",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* Left Side: Preview */}
        <div className="w-full md:w-5/12 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 border-r border-outline-variant/20">
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-widest mb-1">{t('boardPreview')}</h3>
            <p className="text-xs text-on-surface-variant">{t('liveVisual')}</p>
          </div>
          
          {/* Board Mockup */}
          <div 
            className={cn(
              "w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg relative bg-cover bg-center transition-all duration-500",
              !isImage && background
            )}
            style={isImage ? { backgroundImage: `url('${background}')` } : {}}
          >
            <div className="absolute inset-0 bg-black/10 backdrop-brightness-95 p-3 flex gap-2">
              <div className="w-1/3 h-full flex flex-col gap-1.5">
                <div className="h-3 w-3/4 bg-white/30 rounded-sm mb-1" />
                <div className="h-10 w-full bg-white/80 rounded shadow-sm" />
                <div className="h-8 w-full bg-white/80 rounded shadow-sm" />
              </div>
              <div className="w-1/3 h-full flex flex-col gap-1.5">
                <div className="h-3 w-1/2 bg-white/30 rounded-sm mb-1" />
                <div className="h-12 w-full bg-white/80 rounded shadow-sm" />
                <div className="h-6 w-full bg-white/80 rounded shadow-sm opacity-60" />
              </div>
              <div className="w-1/3 h-full flex flex-col gap-1.5">
                <div className="h-3 w-2/3 bg-white/30 rounded-sm mb-1" />
                <div className="h-14 w-full bg-white/80 rounded shadow-sm" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3 w-full">
            <div className="flex items-center gap-3 text-xs text-on-surface-variant bg-surface-container-low/50 p-3 rounded-lg backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-primary text-sm font-fill">info</span>
              <span>{t('backgroundNote')}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full md:w-7/12 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <Typography variant="h2" className="text-2xl font-extrabold text-on-surface tracking-tight leading-none">
              {t('createNewBoard')}
            </Typography>
            <IconButton icon="close" onClick={onClose} variant="ghost" className="rounded-full hover:bg-surface-container-high -mt-1 -mr-1" />
          </div>

          <div className="flex-grow space-y-6">
            {/* Board Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="board-title">
                {t('boardTitle')}
              </label>
              <input
                id="board-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 placeholder:text-outline-variant transition-all text-on-surface font-medium"
                placeholder={t('boardTitlePlaceholder')}
              />
            </div>

            {/* Workspace & Visibility Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">{t('workspaceLabel')}</label>
                <CustomSelect
                  value={workspace}
                  onSelect={setWorkspace}
                  options={[
                    { label: t('designSystemTeam'), value: "Engineering Team" },
                    { label: "Marketing Team", value: "Marketing Team" },
                    { label: "Product Design", value: "Product Design" },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">{t('visibility')}</label>
                <CustomSelect
                  value={visibility}
                  onSelect={(v) => setVisibility(v as any)}
                  options={[
                    { label: t('workspaceLabel'), value: "workspace", icon: "group" },
                    { label: t('private'), value: "private", icon: "lock" },
                    { label: t('public'), value: "public", icon: "public" },
                  ]}
                />
              </div>
            </div>

            {/* Background Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-on-surface-variant">{t('background')}</label>
                <button className="text-xs font-bold text-primary hover:underline">{t('browseAll')}</button>
              </div>

              {/* Grid of Photos */}
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_PHOTOS.map((photo) => (
                  <button 
                    key={photo.id}
                    onClick={() => { setBackground(photo.url); setIsImage(true); }}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden transition-all duration-200",
                      background === photo.url && isImage ? "ring-2 ring-primary ring-offset-2 scale-95 shadow-md" : "hover:opacity-80"
                    )}
                  >
                    <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" />
                    {background === photo.url && isImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="material-symbols-outlined text-white text-lg">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Solid Colors */}
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button 
                    key={color}
                    onClick={() => { setBackground(color); setIsImage(false); }}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform duration-200",
                      color,
                      background === color && !isImage ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm" : "hover:scale-110"
                    )}
                  />
                ))}
                <button className="w-8 h-8 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-xs text-secondary">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={handleCreate}
              disabled={!title.trim()}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {t('createBoardBtn')}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 text-secondary font-semibold hover:bg-surface-container-high rounded-xl transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
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
          "w-full flex items-center justify-between bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 transition-all text-on-surface font-medium shadow-sm hover:bg-surface-container-lowest",
          isOpen && "ring-2 ring-primary"
        )}
      >
        <div className="flex items-center gap-2">
          {selectedOption.icon && (
            <span className="material-symbols-outlined text-secondary text-lg">
              {selectedOption.icon}
            </span>
          )}
          <span>{selectedOption.label}</span>
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
          <div 
            className="fixed inset-0 z-[80]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-[90] bg-white/90 backdrop-blur-xl border border-outline-variant rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
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
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-xl",
                    option.value === value 
                      ? "bg-primary/10 text-primary" 
                      : "text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  {option.icon && (
                    <span className={cn(
                      "material-symbols-outlined text-lg",
                      option.value === value ? "text-primary" : "text-secondary"
                    )}>
                      {option.icon}
                    </span>
                  )}
                  <span className="flex-grow text-left">{option.label}</span>
                  {option.value === value && (
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
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
