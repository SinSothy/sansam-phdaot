"use client";

import React, { useState, useMemo } from 'react';

type MemberWorkload = {
  id: string;
  name: string;
  totalTasks: number;
  todoPercent: number;
  inProgressPercent: number;
  completedPercent: number;
};

type Task = {
  id: string;
  title: string;
  project: string;
  status: 'To Do' | 'In Progress' | 'Testing' | 'Completed';
  dueDate: string;
};

const mockWorkload: MemberWorkload[] = [
  { id: '1', name: 'Jordan Smith', totalTasks: 42, todoPercent: 15, inProgressPercent: 35, completedPercent: 50 },
  { id: '2', name: 'Sarah Chen', totalTasks: 38, todoPercent: 20, inProgressPercent: 40, completedPercent: 40 },
  { id: '3', name: 'Marco Vales', totalTasks: 32, todoPercent: 25, inProgressPercent: 25, completedPercent: 50 },
  { id: '4', name: 'Emily Davis', totalTasks: 28, todoPercent: 10, inProgressPercent: 20, completedPercent: 70 },
];

const allWorkloadMock: MemberWorkload[] = [
  ...mockWorkload,
  { id: '5', name: 'Alena Batis', totalTasks: 45, todoPercent: 20, inProgressPercent: 50, completedPercent: 30 },
  { id: '6', name: 'Chris Evans', totalTasks: 12, todoPercent: 50, inProgressPercent: 10, completedPercent: 40 },
  { id: '7', name: 'Diana Prince', totalTasks: 60, todoPercent: 5, inProgressPercent: 15, completedPercent: 80 },
  { id: '8', name: 'James Wilson', totalTasks: 18, todoPercent: 60, inProgressPercent: 30, completedPercent: 10 },
  { id: '9', name: 'Anna Lee', totalTasks: 55, todoPercent: 5, inProgressPercent: 40, completedPercent: 55 },
];

// Helper to generate mock tasks based on member stats
const generateMockTasks = (member: MemberWorkload): Task[] => {
  const projects = ['API Gateway', 'Mobile App v2', 'Auth Service', 'Payment Gateway'];
  const tasks: Task[] = [];
  const todoCount = Math.floor((member.todoPercent / 100) * member.totalTasks);
  const progCount = Math.floor((member.inProgressPercent / 100) * member.totalTasks);
  const compCount = Math.floor((member.completedPercent / 100) * member.totalTasks);
  
  // Create To Do
  for(let i = 0; i < todoCount; i++) {
    tasks.push({ id: `t-td-${i}`, title: `Implement feature module ${i+1}`, project: projects[i % projects.length], status: 'To Do', dueDate: 'Oct 15' });
  }
  // Create In Progress / Testing
  for(let i = 0; i < progCount; i++) {
    const isTesting = i % 3 === 0;
    tasks.push({ id: `t-ip-${i}`, title: `Refactor API endpoint ${i+1}`, project: projects[i % projects.length], status: isTesting ? 'Testing' : 'In Progress', dueDate: 'Oct 08' });
  }
  // Create Completed
  for(let i = 0; i < compCount; i++) {
    tasks.push({ id: `t-cp-${i}`, title: `Initial setup for component ${i+1}`, project: projects[i % projects.length], status: 'Completed', dueDate: 'Sep 25' });
  }
  
  // Sort randomly so it looks like a real board
  return tasks.sort(() => Math.random() - 0.5).slice(0, 15); // limit to 15 for demo
};

const getStatusBadge = (status: Task['status']) => {
  switch(status) {
    case 'To Do': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-container-highest text-secondary border border-outline-variant/30">To Do</span>;
    case 'In Progress': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-container/20 text-primary border border-primary/20">In Prog</span>;
    case 'Testing': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">Testing</span>;
    case 'Completed': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Done</span>;
  }
};

export function TeamWorkload() {
  const [isDetailedOpen, setIsDetailedOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberWorkload | null>(null);

  const handleClose = () => {
    setIsDetailedOpen(false);
    setSelectedMember(null);
  };

  // Generate mock tasks solely when a member is selected
  const activeTasks = useMemo(() => {
    if (!selectedMember) return [];
    return generateMockTasks(selectedMember);
  }, [selectedMember]);

  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-lg font-bold text-on-surface">Workload Distribution</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider pr-4 border-r border-outline-variant/30 hidden sm:flex">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400"></div><span className="text-secondary">To Do</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-secondary">In Prog.</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-secondary">Done</span></div>
            </div>
            <button 
              onClick={() => setIsDetailedOpen(true)}
              className="text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary-container/20 px-2 py-1 rounded-lg transition-colors border border-transparent hover:border-primary/20"
            >
              Detailed View <span className="material-symbols-outlined text-sm">open_in_full</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockWorkload.map((member) => (
            <div key={member.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-on-surface">{member.name}</span>
                <span className="text-[10px] font-bold text-secondary">{member.totalTasks} tasks</span>
              </div>
              <div className="flex flex-col gap-2">
                 <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-surface-container-highest">
                   <div className="bg-slate-400 border-r border-surface-container-lowest" style={{ width: `${member.todoPercent}%` }}></div>
                   <div className="bg-primary border-r border-surface-container-lowest" style={{ width: `${member.inProgressPercent}%` }}></div>
                   <div className="bg-emerald-500" style={{ width: `${member.completedPercent}%` }}></div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed View Modal */}
      {isDetailedOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
             
             {/* Header */}
             <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                {selectedMember && (
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors shadow-sm mr-2"
                    title="Back to All Members"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-on-surface tracking-tight">
                    {selectedMember ? `${selectedMember.name}'s Tasks` : 'Detailed Workload Distribution'}
                  </h2>
                  <p className="text-xs font-medium text-secondary mt-1">
                    {selectedMember ? `Viewing active sprint items for ${selectedMember.name}` : 'Comprehensive breakdown of team capacity'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="w-9 h-9 shrink-0 outline-none rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-on-surface transition-colors focus:ring-2 focus:ring-primary/20"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
             </div>
             
             {/* Body Routing base on Selected State */}
             {!selectedMember ? (
               // ----- STATE 1: ALL MEMBERS LIST -----
               <div className="flex-1 overflow-y-auto bg-surface-container-lowest p-6">
                 <div className="space-y-4">
                    {allWorkloadMock.map((member) => (
                      <div 
                        key={member.id} 
                        onClick={() => setSelectedMember(member)}
                        className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 hover:border-primary/40 hover:bg-surface-container-low transition-all cursor-pointer shadow-sm hover:shadow-md"
                        title={`View ${member.name}'s tasks`}
                      >
                         <div className="w-full sm:w-48 shrink-0 flex items-center justify-between sm:block">
                           <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{member.name}</p>
                           <p className="text-[10px] text-secondary mt-1">{member.totalTasks} Total Tasks</p>
                         </div>
                         <div className="flex-1 w-full flex items-center gap-4">
                           <div className="w-8 text-right hidden lg:block text-[10px] font-bold text-secondary">{member.todoPercent}%</div>
                           <div className="flex-1 h-4 flex rounded-full overflow-hidden bg-surface-container-highest ring-1 ring-outline-variant/10">
                             <div className="bg-slate-400 border-r border-surface-container-lowest transition-all hover:brightness-95" style={{ width: `${member.todoPercent}%` }}></div>
                             <div className="bg-primary border-r border-surface-container-lowest transition-all hover:brightness-110" style={{ width: `${member.inProgressPercent}%` }}></div>
                             <div className="bg-emerald-500 transition-all hover:brightness-110" style={{ width: `${member.completedPercent}%` }}></div>
                           </div>
                           <div className="w-8 text-left hidden lg:block text-[10px] font-bold text-emerald-500">{member.completedPercent}%</div>
                           <div className="shrink-0 w-6 flex items-center justify-end">
                              <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity text-[18px]">chevron_right</span>
                           </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
             ) : (
               // ----- STATE 2: SPECIFIC MEMBER TASK LIST -----
               <div className="flex-1 overflow-y-auto bg-surface-container-lowest">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-container-low/95 backdrop-blur z-10">
                      <tr className="border-b border-outline-variant/20 text-secondary">
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider">Task Title</th>
                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider hidden sm:table-cell">Project</th>
                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider">Status</th>
                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-right">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTasks.length === 0 ? (
                         <tr>
                           <td colSpan={4} className="py-12 text-center text-sm font-bold text-secondary">No active sprint tasks found.</td>
                         </tr>
                      ) : activeTasks.map(task => (
                        <tr key={task.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-[16px]">{task.status === 'Completed' ? 'check_circle' : 'task'}</span>
                              </div>
                              <span className={`text-sm font-bold ${task.status === 'Completed' ? 'text-secondary line-through' : 'text-on-surface'}`}>
                                {task.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell">
                            <span className="text-xs font-semibold text-secondary">{task.project}</span>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(task.status)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`text-xs font-bold ${task.status === 'Completed' ? 'text-secondary' : 'text-on-surface'}`}>
                              {task.dueDate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}
