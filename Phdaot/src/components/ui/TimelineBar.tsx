import React from 'react';

export type ProjectStatus = 'In Progress' | 'Testing' | 'Completed' | 'Miss Dateline' | 'Planning';

export interface TimelineBarProps {
  name: string;
  status: ProjectStatus;
  startPercent: number; // 0 to 100
  widthPercent: number; // 0 to 100
  dateLabel: string;
}

const statusConfig: Record<ProjectStatus, { bg: string, border: string, text: string }> = {
  'In Progress': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600' },
  'Testing': { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600' },
  'Completed': { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-600' },
  'Miss Dateline': { bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-600' },
  'Planning': { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-500' },
};

export function TimelineBar({ name, status, startPercent, widthPercent, dateLabel }: TimelineBarProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center mb-3 group">
      <div className="w-32 text-xs font-bold text-slate-700 truncate pr-4 group-hover:text-slate-900 transition-colors">{name}</div>
      <div className="flex-1 h-7 bg-slate-50 rounded-lg relative overflow-hidden border border-slate-100 shadow-inner">
        <div 
          className={`absolute h-full ${config.bg} border-l-4 ${config.border} flex items-center px-3 rounded-r-md transition-all duration-500 hover:brightness-95 hover:shadow-sm cursor-pointer`}
          style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
          title={`${name} - ${status}`}
        >
          <span className={`text-[10px] font-bold ${config.text} whitespace-nowrap truncate`}>{status}</span>
        </div>
      </div>
      <div className="w-16 text-right text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors">{dateLabel}</div>
    </div>
  );
}
