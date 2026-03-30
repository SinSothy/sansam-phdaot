"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "next-intl";

interface Board {
  id: string;
  name: string;
}

interface MemberActionProps {
  member: {
    id: string;
    name: string;
    role: string;
    boards: Board[];
  };
  onUpdateRole: () => void;
  onActionClick: () => void; // Remove or Leave
}

export function MemberAction({ member, onUpdateRole, onActionClick }: MemberActionProps) {
  const t = useTranslations();
  const [showBoards, setShowBoards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close boards list when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowBoards(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shared button style to ensure uniform sizing (W: 130px, H: 40px)
  const uniformButtonStyle = "w-32 h-10 rounded-xl bg-surface-container-high text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-surface-container-highest active:scale-95";

  return (
    <div className="flex items-center gap-3 relative" ref={containerRef}>
      {/* Boards Dropdown Button */}
      <div className="relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowBoards(!showBoards); }}
          className={cn(uniformButtonStyle, showBoards && "bg-primary text-on-primary")}
        >
          {t('Common.boards')} ({member.boards.length})
          <span className="material-symbols-outlined text-lg">
            {showBoards ? "expand_less" : "expand_more"}
          </span>
        </button>

        {/* Boards List Dropdown */}
        {showBoards && (
          <div 
            className="absolute top-12 left-0 w-64 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant z-10 overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-surface-container-low border-b border-outline-variant">
              <Typography variant="label" className="text-xs uppercase opacity-70">{t('Team.joinedBoards')}</Typography>
            </div>
            <div className="max-h-60 overflow-y-auto kanban-column-scroll">
              {member.boards.length > 0 ? (
                member.boards.map((board) => (
                  <button
                    key={board.id}
                    className="w-full text-left p-3 hover:bg-surface-container-high transition-colors flex items-center gap-3 group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-sm">dashboard</span>
                    </div>
                    <span className="text-sm font-medium">{board.name}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <Typography variant="body" className="text-xs opacity-50">{t('Team.noBoards')}</Typography>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Role Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onUpdateRole(); }}
        className={uniformButtonStyle}
      >
        {member.role}
        <span className="material-symbols-outlined text-sm opacity-50">help</span>
      </button>

      {/* Action Button (Remove/Leave) */}
      <button 
        onClick={(e) => { e.stopPropagation(); onActionClick(); }}
        className={cn(
          uniformButtonStyle,
          "hover:bg-error-container hover:text-error"
        )}
      >
        <span className="material-symbols-outlined text-lg">
          {member.name === "SinSothy" ? "logout" : "close"}
        </span>
        {member.name === "SinSothy" ? t('Common.leave') : t('Common.remove')}
      </button>
    </div>
  );
}
