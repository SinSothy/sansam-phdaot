"use client";

import React, { useState } from 'react';

type Contributor = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  efficiency: number; // 0-100
  completedTasks: number;
  trend: 'up' | 'down' | 'steady';
};

const mockContributors: Contributor[] = [
  { id: '1', name: 'Jordan Smith', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?u=1', efficiency: 98.4, completedTasks: 124, trend: 'up' },
  { id: '2', name: 'Sarah Chen', role: 'UI Engineer', avatar: 'https://i.pravatar.cc/150?u=2', efficiency: 94.2, completedTasks: 112, trend: 'up' },
  { id: '3', name: 'Marco Vales', role: 'Backend Lead', avatar: 'https://i.pravatar.cc/150?u=3', efficiency: 88.5, completedTasks: 94, trend: 'steady' },
];

const allMembersMock: Contributor[] = [
  ...mockContributors,
  { id: '4', name: 'Alena Batis', role: 'Frontend Dev', avatar: 'https://i.pravatar.cc/150?u=4', efficiency: 85.0, completedTasks: 82, trend: 'up' },
  { id: '5', name: 'Chris Evans', role: 'UX Designer', avatar: 'https://i.pravatar.cc/150?u=5', efficiency: 91.2, completedTasks: 90, trend: 'down' },
  { id: '6', name: 'Diana Prince', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?u=6', efficiency: 95.5, completedTasks: 134, trend: 'steady' },
  { id: '7', name: 'James Wilson', role: 'QA Tester', avatar: 'https://i.pravatar.cc/150?u=7', efficiency: 78.4, completedTasks: 65, trend: 'down' },
  { id: '8', name: 'Anna Lee', role: 'Data Engineer', avatar: 'https://i.pravatar.cc/150?u=8', efficiency: 89.9, completedTasks: 104, trend: 'up' },
];

export function TopContributors() {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = allMembersMock.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-on-surface">Top Contributors</h3>
          <button 
            onClick={() => setIsViewAllOpen(true)}
            className="text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary-container/20 px-2 py-1 rounded-lg transition-colors"
          >
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-secondary">
                <th className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider">Member</th>
                <th className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-right">Progress</th>
              </tr>
            </thead>
            <tbody>
              {mockContributors.map((c, i) => (
                <tr key={c.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img alt={c.name} className="w-8 h-8 rounded-full object-cover" src={c.avatar}/>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{c.name}</p>
                      <p className="text-[10px] text-secondary font-medium">{c.role}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                     <div className="flex items-center justify-end gap-3">
                        <span className="text-xs font-bold text-on-surface">{c.efficiency}%</span>
                        <div className="w-20 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${c.efficiency}%` }}></div>
                        </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* View All Members Modal */}
      {isViewAllOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low">
              <div>
                <h2 className="text-xl font-bold text-on-surface tracking-tight">Project Members</h2>
                <p className="text-xs font-medium text-secondary mt-1">Complete directory of all team contributors</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Search members..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-64"
                  />
                </div>
                <button 
                  onClick={() => setIsViewAllOpen(false)}
                  className="w-9 h-9 shrink-0 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-surface-container-lowest">
              {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-secondary">
                   <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                   <p className="text-sm font-bold">No members found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMembers.map((c, i) => (
                    <div key={c.id} className="bg-surface-container-lowest flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <img alt={c.name} className="w-10 h-10 rounded-full object-cover" src={c.avatar}/>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{c.name}</p>
                          <p className="text-[10px] text-secondary font-medium">{c.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-sm font-bold text-on-surface">{c.efficiency}% Score</span>
                        <span className="text-[10px] font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded-md">
                          {c.completedTasks} Tasks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
