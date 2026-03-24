"use client";

import React, { useState } from 'react';
import { TimelineBar, TimelineBarProps } from '@/components/ui/TimelineBar';

const mockProjects: TimelineBarProps[] = [
  { name: 'API Gateway', status: 'In Progress', startPercent: 10, widthPercent: 60, dateLabel: 'Sep 12' },
  { name: 'Mobile App v2', status: 'Testing', startPercent: 30, widthPercent: 55, dateLabel: 'Sep 28' },
  { name: 'Auth Service', status: 'Completed', startPercent: 5, widthPercent: 90, dateLabel: 'Oct 05' },
];

const expandedMockProjects: TimelineBarProps[] = [
  ...mockProjects,
  { name: 'Payment Gateway', status: 'Miss Dateline', startPercent: 0, widthPercent: 40, dateLabel: 'Oct 12' },
  { name: 'Analytics Dashboard', status: 'Planning', startPercent: 70, widthPercent: 30, dateLabel: 'Oct 20' },
  { name: 'User Profiles', status: 'In Progress', startPercent: 20, widthPercent: 50, dateLabel: 'Oct 25' },
  { name: 'Email Service', status: 'Testing', startPercent: 40, widthPercent: 40, dateLabel: 'Nov 01' },
];

export function ProjectTimeline() {
  const [isFullView, setIsFullView] = useState(false);

  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-900">Project Timeline</h3>
          <button 
            onClick={() => setIsFullView(true)}
            className="text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Full View <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="space-y-2">
          <div className="relative pt-1">
            {mockProjects.map((p, i) => (
              <TimelineBar key={i} {...p} />
            ))}
            
            <div className="flex justify-between mt-6 pl-32 pr-12 text-[9px] font-bold text-slate-300 uppercase tracking-widest relative before:absolute before:left-32 before:right-12 before:top-0 before:h-px before:bg-slate-100 pt-3">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Full View Modal */}
      {isFullView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Comprehensive Project Timeline</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Detailed overview of all active sprint initiatives</p>
              </div>
              <button 
                onClick={() => setIsFullView(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-4 mb-6">
                 {/* Legend */}
                 <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"></div><span className="text-slate-500">Planning</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-slate-500">In Progress</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-slate-500">Testing</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-500">Completed</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div><span className="text-slate-500">Miss Dateline</span></div>
                 </div>
              </div>
              
              <div className="space-y-1 relative pt-2">
                {expandedMockProjects.map((p, i) => (
                  <TimelineBar key={`full-${i}`} {...p} />
                ))}
              </div>
              
              <div className="flex justify-between mt-8 pl-32 pr-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative before:absolute before:left-32 before:right-12 before:top-0 before:h-px before:bg-slate-200 pt-4">
                <span>Month 1</span>
                <span>Month 2</span>
                <span>Month 3</span>
                <span>Month 4</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
