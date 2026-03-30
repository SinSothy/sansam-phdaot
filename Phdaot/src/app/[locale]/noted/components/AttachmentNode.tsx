"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export type AttachmentType = 'image' | 'file';

export interface AttachmentData {
  url: string;
  name: string;
  size?: string;
  type: AttachmentType;
  addedAt?: string;
}

interface AttachmentNodeProps {
  id: string;
  data: AttachmentData;
  isActive: boolean;
}

export function AttachmentNode({ data, isActive }: AttachmentNodeProps) {
  const t = useTranslations('Calendar'); // Using Calendar for 'Today' or adding to Noted
  const notedT = useTranslations('Noted');

  if (data.type === 'image') {
    return (
      <div className={`group relative w-full h-full rounded-xl bg-surface-container overflow-hidden shadow-sm transition-all ${isActive ? 'ring-2 ring-primary/40' : ''}`}>
        <img alt={data.name} className="w-full h-full object-cover select-none pointer-events-none" src={data.url} draggable={false} onDragStart={(e) => e.preventDefault()} />
      </div>
    );
  }

  // File type
  return (
    <div className={`relative flex items-center gap-3 p-3 w-full h-full bg-white border rounded-lg shadow-sm transition-colors group select-none ${isActive ? 'border-primary/40 ring-1 ring-primary/20' : 'border-surface-container hover:border-primary/30'}`}>
      <div className="bg-red-50 text-error p-2 rounded pointer-events-none shrink-0">
        <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
      </div>
      <div className="pr-4 pointer-events-none overflow-hidden text-ellipsis w-full">
        <p className="text-sm font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis">{data.name}</p>
        <p className="text-[10px] text-secondary">{data.size} • {data.addedAt || notedT('lastEdited', {time: t('today')})}</p>
      </div>
      <span className="material-symbols-outlined text-outline hover:text-secondary text-sm cursor-pointer z-10 shrink-0 ml-auto">download</span>
    </div>
  );
}
