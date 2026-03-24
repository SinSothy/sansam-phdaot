import React from 'react';

export function ContextSidebar() {
  return (
    <aside className="w-80 bg-surface-container-low border-l border-surface-container flex flex-col shrink-0">
      <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
        {/* Linked Tasks Block */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-secondary">Linked Tasks</h3>
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">4 Active</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] px-2 py-0.5 bg-error-container text-on-error-container rounded-md font-bold uppercase">High Priority</span>
                <span className="material-symbols-outlined text-sm text-outline">drag_indicator</span>
              </div>
              <p className="text-sm font-semibold mb-2">Approve Travertine Sample #TR-04</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-secondary">calendar_today</span>
                <span className="text-[10px] font-medium text-secondary">Due: Oct 14</span>
              </div>
            </div>
            
            <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-80">
              <p className="text-sm font-semibold mb-2">Draft Lighting Layout v2</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-secondary">calendar_today</span>
                <span className="text-[10px] font-medium text-secondary">Due: Oct 16</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border-2 border-dashed border-outline-variant rounded-xl text-xs font-bold text-secondary hover:bg-white transition-colors">
            + Add Linked Task
          </button>
        </div>
        
        {/* Referenced In Note Block */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-4">Referenced in Note</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded bg-[#d2e3fc] flex items-center justify-center text-[#0b57d0]">
                <span className="material-symbols-outlined">architecture</span>
              </div>
              <div>
                <p className="text-xs font-bold">North Wing Schematics</p>
                <p className="text-[10px] text-secondary">PDF Document • 4.2MB</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
              </div>
              <div>
                <p className="text-xs font-bold">Material Moodboard</p>
                <p className="text-[10px] text-secondary">Board • 12 Elements</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined">contact_page</span>
              </div>
              <div>
                <p className="text-xs font-bold">Sarah Jenkins</p>
                <p className="text-[10px] text-secondary">Senior Architect</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Backlink Section */}
        <div className="pt-6 border-t border-surface-container">
          <h3 className="text-sm font-black uppercase tracking-widest text-secondary mb-2">Mentions</h3>
          <p className="text-[10px] leading-relaxed text-secondary-fixed-dim bg-on-secondary-fixed p-3 rounded-lg font-medium">
            <span className="text-white">@VillaHorizon</span> was mentioned in <span className="text-white">Monthly Review</span> by <span className="text-white">Director Mark</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
