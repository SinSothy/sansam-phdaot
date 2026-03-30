"use client";

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { KanbanHeader } from './KanbanHeader';
import { KanbanCardProps } from './KanbanCard';
import { useTranslations } from 'next-intl';

type BoardColumnData = {
  id: string;
  title: string;
  highlightBadge?: boolean;
  cards: Omit<KanbanCardProps, 'index' | 'onUpdateTitle' | 'onDelete'>[];
};

export function KanbanBoard() {
  const t = useTranslations('Planner');

  const [boardData, setBoardData] = useState<BoardColumnData[]>([
    {
      id: 'col-1',
      title: t('columns.backlog'),
      highlightBadge: false,
      cards: [
        {
          id: 'card-1',
          title: 'User Interviews for Mobile Redesign',
          tags: [
            { label: 'Research', colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
            { label: 'UX', colorClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }
          ],
          comments: 2,
          avatars: [
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcO95JFrI5yC9TcydkyqvDmH7TvQXnvz1eBzDKnteDlkkWwh6UDhL9LzYGm5GfiGsKRZpixBGfnwUdWb5hlm37Hwr0IzVi34si6HiOYRWmOi4OwKEqUyHozgdJtxLffRfSpNfvSifxC1-0MRpmE5JUU9ABBMoOkTU76CbeSCCXVRzPf5oU7KOd_cnVr2irTgETBQvbEQDJ9Xo2ey8IyqEKX2v-_J_bQMk7ykDcQaarOYW6IwNX_MHAME8cGQU-kKT5pi4-60ce', alt: 'AM' },
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBQ1SRDviT5eZnQeVeUYovBzZJmh81T4Zldde-IPt35GBq_tPTv_auQDdFJsx5jMC7LCLBsyuD4vVPC2rISHXEe2bcKyleBmCRbDMGETFpZ3WGd-YXpXg-kRUMSVE35-SBy7NXMeWf4ejMMwEcAaMhp7g73OOm2OMzh5lHhG71yJgz4ttgZE2itCugT448zT2JQrNHIsPRrqFEMC-9cuHjOp5h658sdLkU2pL3LI3eqtFyRCLPzqpnxVyNtjtozoE4GN3uhWwi', alt: 'JD' }
          ]
        },
        {
          id: 'card-2',
          title: 'API Infrastructure Migration Plan',
          tags: [
            { label: 'Priority', colorClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }
          ],
          attachments: 1,
          avatars: [
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJu8Op0lbtrzGeUBZ7KMGYzyWZzSwAAEHY9eW-w1ZFUOQxinR5l_Oi5pPyG1YxJSmT0vBJQmWsbzT9ewhst5pKw8ETlz62bVM67nGzbiJUEu5ceJR1nnACyMcOVELXQGe0ZIReaT55OpxnnOD3o9ICxK7NwWDc7mLKocOD8MuteVofkwmvbuHkh8Eoiy7MMVEp-Fk2Qjp5ibtBCXSXttgMyrM3y0WkHn1OlMaFnKxXZ-EXWU1E3ZKyen0febnMG_K9pCeI2ODX', alt: 'SK' }
          ]
        }
      ]
    },
    {
      id: 'col-2',
      title: t('columns.inProgress'),
      highlightBadge: true,
      cards: [
        {
          id: 'card-3',
          title: 'Implement Dark Mode using Design Tokens',
          tags: [
            { label: 'Dev', colorClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' }
          ],
          tasksCompleted: 4,
          tasksTotal: 12,
          highlightColor: 'border-primary',
          avatars: [
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Flu4AERGjhmkm7uhHrIh3p9soLkEstxrUBEqtAdqhA1zY5D2q1H0_JlrK2xwVsPbVdNcib8SrWm1mLlIlLNDm42x6xtiyQvWgLjik_IQDQ9mDxm2gKc2K-aVXcIchtxC_pi1yrwe8kJFlDkmVj8Ge88SOInPMGe-mbrFjWDyxT5WNMBlAqgvQLWRGF2vDR6FhQxtp85e49Kte_Zlcccg6oJnqJThvyorL1oEwE_EG-UUHXmI3X5i_W9EDOF-mTYK4d_CLnXD', alt: 'TR' }
          ]
        },
        {
          id: 'card-4',
          title: 'Fluid Grid System Prototypes',
          tags: [
            { label: 'Design', colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' }
          ],
          comments: 5,
          avatars: [
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCNDGJ7rA_7VPsNHGdMkMj3w6I_VtM6z30geJ4ZFbPd_uPnuvSXiORoJdT7U3bMYuAcxSZ6PUMYeRm_JeCe6xiTea4JS1lzoSQgb5QPt2MNmJZVXBltCg0zumrrjepVs0W_CkUtXs8ryfyL5Z9_Ubxf7S0JTQJTXVJL06k8EWeLylz1wf1fgRd1OYfVA1AD9M8lX7cLSRcfVC-TSWrpM_nZu3maGK2kQcBTzsD4PtK0Nq2Lrg0O3SxlxX2omHVtebbZFJbzkjg', alt: 'LW' }
          ]
        }
      ]
    },
    {
      id: 'col-3',
      title: t('columns.testing'),
      highlightBadge: false,
      cards: [
        {
          id: 'card-5',
          title: 'Fix responsive overflow on tablet viewports',
          tags: [
            { label: 'QA', colorClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
            { label: 'Bug', colorClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' }
          ],
          dueDate: 'Tomorrow',
          dueColorClass: 'text-red-600',
          avatars: [
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5QCMCQ1i_Cs9Dgs2IuFhiFjpIUONoBEO-HkZhnWnvPKE09cNSfqEBpf5SLeOSTt9S7AKu0n0pIK-kPeYfwVQDBNvHwO_OcnCROKaHVc2X4Gj6E7DdtoeUnTsZEc-fGlBOwmtAyg-Yg8Oxg9D5YrzETc306c6sZonfSQK1H0iV6yt_RbZ20J0w8dZy5hhUAjI9V4FGL838ufok9ZYg2j2cWY0Y6X0yXULxqlroUwsasCQBeYRIJKAXWFl_4rHz6lyRsG4z1LYm', alt: 'BM' }
          ]
        }
      ]
    },
    {
      id: 'col-4',
      title: t('columns.done'),
      highlightBadge: false,
      cards: [
        {
          id: 'card-6',
          title: 'Q3 Retrospective & Documentation',
          tags: [
            { label: 'Release', colorClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
          ],
          isDone: true,
          avatars: [
            { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIWuyhrWVO_aygwWg0ag_y1UGB0wnE-wj5ZtG8mJU3dGJ5bk8_7ETt8v4zlWZuJD8hGrX379FwaeY1_JiM6muu_oEe23Fp_n9ydkEsqxlKNOEKSrbjiEF0MQCDthp0A1tUsVXKb0fu_Ks8ZiZROD-m6Y9GqY-NH-4UPCsojyCmQdy5cDz6hJnXmzHhl-2BoCkLA3KKxjnMbVR90wTARbuuK9XIn81ZCAENetNDRtGZni2OZ4AVP1R-ep3mxvX6L6ePDbnEfni_', alt: 'JD' }
          ]
        }
      ]
    }
  ]);

  // Drag End handler
  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Moving columns
    if (type === 'column') {
      const newBoardData = Array.from(boardData);
      const [removedColumn] = newBoardData.splice(source.index, 1);
      newBoardData.splice(destination.index, 0, removedColumn);
      setBoardData(newBoardData);
      return;
    }

    // Moving cards
    if (type === 'card') {
      const sourceColIndex = boardData.findIndex(col => col.id === source.droppableId);
      const destColIndex = boardData.findIndex(col => col.id === destination.droppableId);
      
      const sourceCol = boardData[sourceColIndex];
      const destCol = boardData[destColIndex];

      const sourceCards = Array.from(sourceCol.cards);
      const destCards = sourceCol.id === destCol.id ? sourceCards : Array.from(destCol.cards);

      const [movedCard] = sourceCards.splice(source.index, 1);

      destCards.splice(destination.index, 0, movedCard);

      const newBoardData = [...boardData];
      newBoardData[sourceColIndex] = { ...sourceCol, cards: sourceCards };
      newBoardData[destColIndex] = { ...destCol, cards: destCards };

      setBoardData(newBoardData);
    }
  }, [boardData]);

  // CRUD for Lists
  const addList = () => {
    const listId = `col-${Date.now()}`;
    setBoardData([
      ...boardData,
      { id: listId, title: t('newList'), highlightBadge: false, cards: [] }
    ]);
  };

  const updateListTitle = (listId: string, newTitle: string) => {
    setBoardData(boardData.map(col => 
      col.id === listId ? { ...col, title: newTitle } : col
    ));
  };

  const deleteList = (listId: string) => {
    setBoardData(boardData.filter(col => col.id !== listId));
  };

  // CRUD for Cards
  const addCard = (listId: string) => {
    const cardId = `card-${Date.now()}`;
    setBoardData(boardData.map(col => {
      if (col.id === listId) {
        return {
          ...col,
          cards: [...col.cards, { id: cardId, title: t('newTask') }]
        };
      }
      return col;
    }));
  };

  const updateCardTitle = (listId: string, cardId: string, newTitle: string) => {
    setBoardData(boardData.map(col => {
      if (col.id === listId) {
        return {
          ...col,
          cards: col.cards.map((card: any) => 
            card.id === cardId ? { ...card, title: newTitle } : card
          )
        };
      }
      return col;
    }));
  };

  const deleteCard = (listId: string, cardId: string) => {
    setBoardData(boardData.map(col => {
      if (col.id === listId) {
        return {
          ...col,
          cards: col.cards.filter((card: any) => card.id !== cardId)
        };
      }
      return col;
    }));
  };

  return (
    <div className="flex flex-col h-full w-full bg-surface relative overflow-hidden">
      <KanbanHeader />
      
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-primary pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,61,155,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div 
                className="flex-grow overflow-x-auto kanban-scroll p-6 relative z-10 w-full h-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="flex items-start gap-6 min-w-max h-full pb-4">
                  {boardData.map((col, index) => (
                    <KanbanColumn 
                      key={col.id}
                      id={col.id}
                      index={index}
                      title={col.title}
                      count={col.cards.length}
                      highlightBadge={col.highlightBadge}
                      cards={col.cards as any}
                      
                      // Methods passed for CRUD
                      onAddCard={() => addCard(col.id)}
                      onUpdateColTitle={(title) => updateListTitle(col.id, title)}
                      onDeleteCol={() => deleteList(col.id)}
                      onUpdateCardTitle={(cardId, title) => updateCardTitle(col.id, cardId, title)}
                      onDeleteCard={(cardId) => deleteCard(col.id, cardId)}
                    />
                  ))}
                  {provided.placeholder}
                  
                  {/* Add Another List Button */}
                  <div className="w-80 shrink-0">
                    <button 
                      onClick={addList}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all border border-dashed border-outline-variant/30 text-secondary font-semibold font-headline text-sm"
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
      </main>
    </div>
  );
}
