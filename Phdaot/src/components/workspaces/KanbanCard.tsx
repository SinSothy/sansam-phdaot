"use client";

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { cn } from "@/lib/utils";

export type KanbanTag = {
  label: string;
  colorClass: string;
};

export type KanbanAvatar = {
  src: string;
  alt: string;
};

export type KanbanCardProps = {
  id: string;
  index: number;
  title: string;
  tags?: KanbanTag[];
  comments?: number;
  attachments?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  dueDate?: string;
  dueColorClass?: string;
  avatars?: KanbanAvatar[];
  isDone?: boolean;
  highlightColor?: string;
  
  onUpdateTitle?: (title: string) => void;
  onDelete?: () => void;
};

export function KanbanCard({
  id,
  index,
  title,
  tags = [],
  comments = 0,
  attachments = 0,
  tasksCompleted = 0,
  tasksTotal = 0,
  dueDate,
  dueColorClass,
  avatars = [],
  isDone = false,
  highlightColor,
  onUpdateTitle,
  onDelete
}: KanbanCardProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleTitleSubmit = () => {
    if (editTitle.trim() !== '' && onUpdateTitle) {
      onUpdateTitle(editTitle);
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            // Prevent triggering edit if clicking the delete button
            if ((e.target as HTMLElement).tagName !== 'BUTTON' && !(e.target as HTMLElement).closest('button')) {
              // Optionally could edit on click, but maybe a double click or specific icon is better
            }
          }}
          className={cn(
            "bg-surface-container-lowest p-4 rounded-xl transition-all group relative",
            isDone 
              ? "opacity-60 bg-surface-container-lowest/60 shadow-none border border-outline-variant/10 grayscale" 
              : "shadow-[0_4px_24px_rgba(27,28,28,0.04)] hover:shadow-[0_8px_32px_rgba(27,28,28,0.08)]",
            highlightColor && `border-l-4 ${highlightColor}`,
            snapshot.isDragging && "shadow-[0_8px_32px_rgba(0,61,155,0.15)] z-50 rotate-2 scale-105"
          )}
        >
          {/* Action buttons shown on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded p-1 shadow-sm">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100"
              title="Edit card"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(); }}
              className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-100"
              title="Delete card"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, idx) => (
                <span key={idx} className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", tag.colorClass)}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}
          
          {isEditing ? (
            <textarea 
               autoFocus
               value={editTitle}
               onChange={e => setEditTitle(e.target.value)}
               onBlur={handleTitleSubmit}
               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleTitleSubmit())}
               className={cn("w-full bg-slate-50 dark:bg-slate-800 border border-primary/30 rounded p-1 mb-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary", isDone ? "text-slate-500" : "text-on-surface font-semibold")}
               rows={2}
               onClick={e => e.stopPropagation()}
            />
          ) : (
            <h4 className={cn("font-semibold mb-3 leading-tight", isDone ? "text-slate-500 line-through" : "text-on-surface")}>
              {title}
            </h4>
          )}
          
          <div className={cn("flex items-center justify-between", isDone && "opacity-50")}>
            <div className="flex flex-wrap items-center gap-3 text-secondary text-xs">
              {isDone ? (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                </span>
              ) : (
                <>
                  {attachments > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">attachment</span> {attachments}
                    </span>
                  )}
                  {comments > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span> {comments}
                    </span>
                  )}
                  {tasksTotal > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_box</span> {tasksCompleted}/{tasksTotal}
                    </span>
                  )}
                  {dueDate && (
                    <span className={cn("flex items-center gap-1", dueColorClass)}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span> {dueDate}
                    </span>
                  )}
                </>
              )}
            </div>
            
            {avatars.length > 0 && (
              <div className={cn("flex", avatars.length > 1 ? "-space-x-2" : "")}>
                {avatars.map((avatar, idx) => (
                  <img 
                    key={idx} 
                    alt={avatar.alt} 
                    src={avatar.src} 
                    className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-white object-cover" 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
