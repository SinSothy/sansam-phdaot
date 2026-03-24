"use client";

import React from 'react';

export function SprintOversight() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
           <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
             <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
             Automated Insight
           </h3>
           <div className="bg-white/10 px-2 py-1 rounded text-[9px] font-bold tracking-wider text-slate-300">
             GENERATED 2H AGO
           </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-200">
            Sprint velocity is <span className="text-white font-bold inline-flex items-center bg-white/10 px-1 rounded mx-1">up 12%<span className="material-symbols-outlined text-[#10b981] text-[14px]">arrow_upward</span></span> 
            compared to the last period. 
            However, the <strong className="text-white">API Gateway</strong> module requires attention due to a high backlog of critical tickets.
          </p>
          
          <div className="bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-sm shadow-inner group cursor-pointer hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-400 text-[18px]">warning</span>
                <span className="text-xs font-bold text-white">Risk Identified</span>
              </div>
              <span className="material-symbols-outlined text-white/50 text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </div>
            <p className="text-[11px] text-slate-300">3 blocking tasks in "Mobile App v2" threaten the Sep 28 deadline.</p>
          </div>
          
          <button className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(12,102,228,0.5)] py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 mt-2">
            Generate Full Report
          </button>
        </div>
      </div>
      
      {/* Decorative background blurs for a modern glassmorphism effect */}
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -top-12 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
    </section>
  );
}
