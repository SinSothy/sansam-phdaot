"use client";

import React from 'react';
import { LineChart, ChartDataPoint } from '@/components/ui/LineChart';

// Mock data to pass down to the chart component
const trendData: ChartDataPoint[] = [
  { label: '30 Days Ago', completed: 42, inProgress: 88 },
  { label: '24 Days Ago', completed: 51, inProgress: 85 },
  { label: '18 Days Ago', completed: 68, inProgress: 80 },
  { label: '12 Days Ago', completed: 90, inProgress: 76 },
  { label: '6 Days Ago', completed: 104, inProgress: 88 },
  { label: 'Today', completed: 124, inProgress: 82 },
];

export function TaskCompletionTrend() {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 overflow-hidden border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Task Completion Trend</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Last 30 Days Activity
          </p>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full bg-emerald-500"></div>
            <span className="text-slate-500">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full bg-primary"></div>
            <span className="text-slate-500">In Progress</span>
          </div>
        </div>
      </div>
      
      {/* Pass dynamic data into our modern LineChart component */}
      <LineChart 
        data={trendData}
        series={[
          { key: 'inProgress', name: 'In Progress', color: '#0c66e4', fillColor: 'rgba(12, 102, 228, 0.08)' },
          { key: 'completed', name: 'Completed', color: '#10b981', fillColor: 'rgba(16, 185, 129, 0.1)' }
        ]}
        height={256}
      />

      <div className="flex justify-between mt-6 px-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
        <span>30 Days Ago</span>
        <span>20 Days Ago</span>
        <span>10 Days Ago</span>
        <span>Today</span>
      </div>
    </section>
  );
}
