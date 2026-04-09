"use client";

import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { Task, TaskStatus } from '@/api/types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';


export type KanbanColumnProps = {
  id: string;
  index: number;
  title: string;
  status: TaskStatus;
  count: number;
  highlightBadge?: boolean;
  cards: Task[];

  onAddCard: () => void;
  onUpdateColTitle: (title: string) => void;
  onDeleteCol: () => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
};


export function KanbanColumn({
  id,
  index,
  title,
  status,
  count,
  highlightBadge = false,
  cards,
  onAddCard,
  onUpdateColTitle,
  onDeleteCol,
  onUpdateCardTitle,
  onDeleteCard
}: KanbanColumnProps) {
  const t = useTranslations('Planner');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleTitleSubmit = () => {
    if (editTitle.trim() !== '') {
      onUpdateColTitle(editTitle);
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
          className={cn(
            "w-80 flex flex-col max-h-full shrink-0 transition-shadow duration-200",
            snapshot.isDragging ? "shadow-2xl rotate-1 z-50 opacity-90" : ""
          )}
        >
          {/* Column Container */}
          <div className="flex flex-col max-h-full bg-slate-100/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-outline-variant/20 shadow-sm overflow-hidden">
            
            {/* Header Area */}
            <div
              className="flex items-center justify-between px-5 pt-5 pb-3 group/header"
              {...provided.dragHandleProps}
            >
              <div className="flex-1 flex items-center gap-3 min-w-0">
                {isEditing ? (
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                    className="font-black text-on-surface font-headline bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-0.5 border border-primary focus:outline-none w-full"
                  />
                ) : (
                  <h3
                    className="font-black text-on-surface font-headline flex-1 cursor-text truncate text-sm uppercase tracking-wider italic"
                    onClick={() => setIsEditing(true)}
                    title="Click to edit list name"
                  >
                    {title}
                  </h3>
                )}
                
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center",
                  highlightBadge 
                    ? "bg-primary text-on-primary ring-4 ring-primary/20" 
                    : "bg-surface-container-highest text-on-surface-variant"
                )}>
                  {count}
                </span>
              </div>

              <div className="flex items-center opacity-0 group-hover/header:opacity-100 transition-opacity">
                <button
                  onClick={onDeleteCol}
                  className="text-slate-400 hover:text-red-500 rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete list"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>

                </button>
              </div>
            </div>

            {/* Cards Area */}
            <Droppable droppableId={id} type="card">
              {(provided, snapshot) => (
                <div
                  className={cn(
                    "flex flex-col gap-3 overflow-y-auto px-4 pb-4 kanban-column-scroll h-full min-h-[100px] transition-colors duration-200",
                    snapshot.isDraggingOver ? "bg-primary/5" : ""
                  )}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex flex-col gap-3 pt-2">
                    {cards?.map((card, idx) => (
                      <KanbanCard
                        key={card.id}
                        id={card.id}
                        index={idx}
                        title={card.title}
                        tags={card.tags}
                        comments={card.comments}
                        attachments={card.attachments}
                        tasksCompleted={card.tasksCompleted}
                        tasksTotal={card.tasksTotal}
                        dueDate={card.dueDate}
                        dueColorClass={card.dueColorClass}
                        avatars={card.avatars}
                        isDone={card.isDone}
                        highlightColor={card.highlightColor}
                        onUpdateTitle={(newTitle) => onUpdateCardTitle(card.id, newTitle)}
                        onDelete={() => onDeleteCard(card.id)}
                      />
                    ))}
                  </div>
                  {provided.placeholder}

                  {/* Add Task Button - Modern Ghost Style */}
                  <button
                    onClick={onAddCard}
                    className="flex items-center gap-2 w-full p-4 rounded-2xl text-secondary dark:text-slate-400 border border-dashed border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 group/add mt-1 sticky bottom-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm"
                  >
                    <div className="h-6 w-6 rounded-lg bg-surface-container-high flex items-center justify-center group-hover/add:bg-primary group-hover/add:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">{t('newTask')}</span>
                  </button>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </Draggable>
  );
}

