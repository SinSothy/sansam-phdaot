"use client";

import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { KanbanCard, KanbanCardProps } from './KanbanCard';

export type KanbanColumnProps = {
  id: string;
  index: number;
  title: string;
  count: number;
  highlightBadge?: boolean;
  cards: KanbanCardProps[];
  
  onAddCard: () => void;
  onUpdateColTitle: (title: string) => void;
  onDeleteCol: () => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
};

import { useTranslations } from 'next-intl';

export function KanbanColumn({ 
  id, 
  index, 
  title, 
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
          className={`w-80 flex flex-col max-h-full shrink-0 ${snapshot.isDragging ? 'opacity-80' : ''}`}
        >
          {/* Header Area */}
          <div 
            className="flex items-center justify-between px-3 py-2 mb-2 group"
            {...provided.dragHandleProps}
          >
            {isEditing ? (
              <input 
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="font-bold text-secondary font-headline bg-transparent border-b border-primary focus:outline-none w-full mr-2"
              />
            ) : (
              <h3 
                className="font-bold text-secondary font-headline flex-1 cursor-text"
                onClick={() => setIsEditing(true)}
                title="Click to edit list name"
              >
                {title}
              </h3>
            )}
            
            <div className="flex items-center gap-2">
              <span className={highlightBadge ? "bg-primary text-on-primary text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full" : "bg-surface-container-high text-on-surface-variant text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"}>
                {count}
              </span>
              {/* Delete Column Button - Shown on hover of header */}
              <button 
                onClick={onDeleteCol} 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Delete list"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
          
          {/* Cards Area */}
          <Droppable droppableId={id} type="card">
            {(provided, snapshot) => (
              <div 
                className={`flex flex-col gap-3 overflow-y-auto pr-1 pb-4 kanban-column-scroll h-full min-h-[100px] ${snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5 rounded-xl' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {cards.map((card, idx) => (
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
                {provided.placeholder}
                
                <button 
                  onClick={onAddCard}
                  className="flex items-center gap-2 w-full p-3 rounded-xl text-secondary hover:bg-surface-container-low transition-colors text-sm font-medium mt-1 shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  {t('newTask')}
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
