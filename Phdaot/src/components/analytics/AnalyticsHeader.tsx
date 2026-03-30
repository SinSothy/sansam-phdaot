import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function AnalyticsHeader() {
  const t = useTranslations('Analytics');
  const [activeTab, setActiveTab] = useState<'30days' | 'quarterly' | 'custom'>('30days');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [workspace, setWorkspace] = useState('Engineering Team');
  const [project, setProject] = useState('Project Alpha');

  // Close dropdowns when clicking outside
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsWorkspaceOpen(false);
        setIsProjectOpen(false);
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const workspaces = ['Engineering Team', 'Design Team', 'Product'];
  const projects = ['Project Alpha', 'Mobile App v2', 'Auth Service'];

  return (
    <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 relative z-20">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">{t('projectAnalytics')}</h2>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">{t('realTimeMetrics', {name: project})}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Context Selectors - Custom Dropdowns */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm relative z-30">
          
          {/* Workspace Dropdown */}
          <div className="flex items-center pl-2 group relative">
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-0.5">{t('workspace')}</span>
              <button 
                onClick={() => { setIsWorkspaceOpen(!isWorkspaceOpen); setIsProjectOpen(false); setIsCalendarOpen(false); }}
                className="flex items-center justify-between w-40 bg-transparent hover:bg-slate-50 pl-2 pr-2 py-1.5 text-sm font-bold text-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent hover:border-slate-200"
              >
                <span className="truncate">{workspace}</span>
                <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200 ${isWorkspaceOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
            </div>
            {isWorkspaceOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top duration-200">
                <div className="p-1">
                  {workspaces.map(w => (
                    <button 
                      key={w}
                      onClick={() => { setWorkspace(w); setIsWorkspaceOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${workspace === w ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-px h-8 bg-slate-100"></div>
          
          {/* Project Dropdown */}
          <div className="flex items-center pr-1 group relative">
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-0.5">{t('project')}</span>
              <button 
                onClick={() => { setIsProjectOpen(!isProjectOpen); setIsWorkspaceOpen(false); setIsCalendarOpen(false); }}
                className="flex items-center justify-between w-40 bg-transparent hover:bg-slate-50 pl-2 pr-2 py-1.5 text-sm font-bold text-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent hover:border-slate-200"
              >
                <span className="truncate">{project}</span>
                <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200 ${isProjectOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
            </div>
            {isProjectOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top duration-200">
                <div className="p-1">
                  {projects.map(p => (
                    <button 
                      key={p}
                      onClick={() => { setProject(p); setIsProjectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${project === p ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date Range Segmented Control with Shared Background Animation */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner relative">
          
          <button 
            onClick={() => setActiveTab('30days')}
            className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 z-10 ${activeTab === '30days' ? 'text-slate-800 shadow-sm bg-white border border-slate-200/60' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent'}`}
          >
            {t('last30days')}
          </button>
          <button 
            onClick={() => setActiveTab('quarterly')}
            className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 z-10 ${activeTab === 'quarterly' ? 'text-slate-800 shadow-sm bg-white border border-slate-200/60' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent'}`}
          >
            {t('quarterly')}
          </button>
          <button 
            onClick={() => setActiveTab('custom')}
            className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 z-10 ${activeTab === 'custom' ? 'text-slate-800 shadow-sm bg-white border border-slate-200/60' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent'}`}
          >
            {t('customRange')}
          </button>
          
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          
          {/* Calendar Trigger */}
          <div className="relative">
            <button 
              onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsWorkspaceOpen(false); setIsProjectOpen(false); setActiveTab('custom'); }}
              className={`p-2 rounded-xl transition-all shadow-sm group flex items-center justify-center mr-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isCalendarOpen ? 'bg-primary/10 text-primary border-primary/30' : 'bg-white border-slate-200/60 text-slate-500 hover:text-primary hover:border-primary/30'} border`}
              title="Select custom date range"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">calendar_today</span>
            </button>

            {/* Calendar Popover */}
            {isCalendarOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 origin-top-right duration-300 z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h4 className="text-sm font-bold text-slate-800">{t('customRange')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Select a start and end date</p>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t('startDate')}</label>
                      <input type="date" className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary" defaultValue="2023-09-01" />
                    </div>
                    <div className="w-4 h-px bg-slate-300 mt-5"></div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t('endDate')}</label>
                      <input type="date" className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary" defaultValue="2023-09-30" />
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-center h-48">
                    {/* Mock Calendar Grid for UI purposes */}
                    <div className="text-center text-slate-400">
                       <span className="material-symbols-outlined text-4xl opacity-20 mb-2">date_range</span>
                       <p className="text-xs font-medium">Interactive calendar grid</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                  <button onClick={() => setIsCalendarOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors">{t('Common.cancel')}</button>
                  <button onClick={() => setIsCalendarOpen(false)} className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm">{t('applyRange')}</button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
