"use client";

import React from 'react';

// Generates an array of generic activity values [0-4] to simulate github-style heatmaps
const generateHeatmapData = (days: number) => {
  return Array.from({ length: days }, () => Math.floor(Math.random() * 5));
};

const heatmapData = generateHeatmapData(28); // 4 weeks

const getHeatmapColor = (intensity: number) => {
  switch (intensity) {
    case 0: return 'bg-surface-container-highest opacity-50';
    case 1: return 'bg-primary-container opacity-60';
    case 2: return 'bg-primary opacity-60';
    case 3: return 'bg-primary opacity-80';
    case 4: return 'bg-primary';
    default: return 'bg-surface-container-highest';
  }
};

const recentEvents = [
  { id: 1, text: "Sarah C. pushed 4 updates", context: "2 hours ago in Mobile App", color: "bg-primary" },
  { id: 2, text: "Marco V. completed 'Auth-72'", context: "5 hours ago", color: "bg-emerald-500" },
  { id: 3, text: "Alex R. assigned 3 tasks", context: "Yesterday in UX Redesign", color: "bg-amber-400" },
];

export function ActivityLog() {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-on-surface">Activity Log</h3>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Week 34</span>
      </div>
      
      {/* Dynamic Heatmap */}
      <div className="grid grid-cols-7 gap-1.5 group cursor-help" title="4-week contribution density">
        {heatmapData.map((val, i) => (
          <div 
            key={i} 
            className={`aspect-square rounded-sm transition-all hover:scale-110 hover:shadow-sm ${getHeatmapColor(val)}`}
          ></div>
        ))}
      </div>
      
      {/* Dynamic Event Feed */}
      <div className="mt-6 space-y-4">
        {recentEvents.map((evt) => (
          <div key={evt.id} className="flex gap-3 items-start group">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${evt.color} group-hover:scale-125 transition-transform`}></div>
            <div>
              <p className="text-[11px] font-bold text-on-surface group-hover:text-primary transition-colors">{evt.text}</p>
              <p className="text-[10px] font-medium text-secondary mt-0.5">{evt.context}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
