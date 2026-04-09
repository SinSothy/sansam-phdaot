"use client";

import React, { useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { KanbanHeader } from './KanbanHeader';
import { useTranslations } from 'next-intl';
import { useTaskStore } from '@/api/store/useTaskStore';
import { taskManager } from '@/api/managers/task.manager';
import { TaskStatus } from '@/api/types';

export function KanbanBoard({ boardId }: { boardId?: string }) {
  const t = useTranslations('Planner');
  const { columns, setBoardData, moveTask, moveColumn } = useTaskStore();

  // Senior Frontend: Board now initializes empty and reflects real server data.
  useEffect(() => {
    // Subscribe to real-time updates for this board
    if (boardId) {
      taskManager.subscribeToBoard(boardId);
      taskManager.fetchBoardColumns(boardId);
    }
  }, [boardId]);


  // Drag End handler
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Moving columns - Senior strategy: Handled via store and eventually synced
    if (type === 'column') {
      moveColumn(source.index, destination.index);
      return;
    }

    // Moving cards - Standardized Real-time integration
    if (type === 'card' && boardId) {
      const sourceCol = columns.find(c => c.id === source.droppableId);
      const destCol = columns.find(c => c.id === destination.droppableId);

      if (sourceCol && destCol) {
        taskManager.moveTask(
          draggableId,
          sourceCol.status,
          destCol.status,
          destination.index
        );
      }
    }
  }, [boardId, columns, moveColumn]);

  // CRU(D) Actions routed through Manager for real-time sync
  const handleAddNewColumn = async () => {
    if (!boardId) return;
    await taskManager.createColumn(boardId, t('newList'));
  };

  const handleAddNewTask = (status: TaskStatus) => {
    if (!boardId) return;
    taskManager.createTask(boardId, status, t('newTask'));
  };

  const handleUpdateTaskTitle = (taskId: string, status: TaskStatus, title: string) => {
    taskManager.updateTaskTitle(taskId, status, title);
  };

  const handleDeleteTask = (taskId: string, status: TaskStatus) => {
    taskManager.deleteTask(taskId, status);
  };

  const handleUpdateColumnTitle = (status: TaskStatus, title: string) => {
    const { updateColumnTitle } = useTaskStore.getState();
    updateColumnTitle(status, title);
    // taskManager.updateColumnTitle(boardId, status, title);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!boardId) return;
    taskManager.deleteColumn(boardId, columnId);
  };

  const totalTasks = columns.reduce((acc, col) => acc + (col.tasks?.length || 0), 0);

  return (
    <div className="flex flex-col h-full w-full bg-surface relative overflow-hidden">
      <KanbanHeader boardId={boardId} />


      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Background Overlay */}
        <div
          className="absolute inset-0 z-0 bg-primary pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,61,155,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        {columns.length === 0 ? (
          <BoardEmptyState onAddFirstList={handleAddNewColumn} />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" type="column" direction="horizontal">
              {(provided) => (
                <div
                  className="flex-grow overflow-x-auto kanban-scroll p-6 relative z-10 w-full h-full"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex items-start gap-6 min-w-max h-full pb-4">
                    {columns.map((col, index) => (
                      <KanbanColumn
                        key={col.id}
                        id={col.id}
                        index={index}
                        title={col.title}
                        status={col.status}
                        count={col.tasks?.length || 0}
                        highlightBadge={col.highlightBadge}
                        cards={(col.tasks || []) as any}

                        // Methods passed for CRUD managed by taskManager
                        onAddCard={() => handleAddNewTask(col.status)}
                        onUpdateColTitle={(title) => handleUpdateColumnTitle(col.status, title)}
                        onDeleteCol={() => handleDeleteColumn(col.id)}
                        onUpdateCardTitle={(taskId, title) => handleUpdateTaskTitle(taskId, col.status, title)}
                        onDeleteCard={(taskId) => handleDeleteTask(taskId, col.status)}
                      />
                    ))}
                    {provided.placeholder}

                    {/* Add Another List Button */}
                    <div className="w-80 shrink-0">
                      <button
                        onClick={handleAddNewColumn}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all border border-dashed border-outline-variant/30 text-secondary font-semibold font-headline text-sm shadow-sm hover:shadow-md"
                      >
                        <span className="material-symbols-outlined">add</span>
                        {t('addColumn')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>
    </div>
  );
}


/**
 * Premium Empty State for a new Kanban Board
 * Refactored to use standard localization keys.
 */
function BoardEmptyState({ onAddFirstList }: { onAddFirstList: () => void }) {
  const t = useTranslations('Planner');

  return (
    <div className="flex-grow flex items-center justify-center p-6 relative z-10">
      <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative h-48 w-48 mx-auto bg-surface-container-highest rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl rotate-3">
            <span className="material-symbols-outlined text-7xl text-primary drop-shadow-lg">dashboard_customize</span>
          </div>
        </div>

        <h2 className="text-3xl font-black font-headline tracking-tighter text-on-surface mb-3 uppercase italic">
          {t('emptyState.title')}
        </h2>
        <p className="text-secondary font-medium mb-10 leading-relaxed px-4">
          {t('emptyState.description')}
        </p>

        <button
          onClick={onAddFirstList}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="relative z-10">{t('emptyState.button')}</span>
        </button>

        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-outline opacity-40">
          <div className="h-px w-8 bg-current" />
          <span>{t('emptyState.hint')}</span>
          <div className="h-px w-8 bg-current" />
        </div>
      </div>
    </div>
  );
}


