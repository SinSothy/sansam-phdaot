"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface CalendarSidebarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarSidebar({ selectedDate, onSelectDate }: CalendarSidebarProps) {
  const t = useTranslations('Noted');
  const calT = useTranslations('Calendar');
  
  const MONTHS = [
    t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
    t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
    t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
  ];
  
  const DAYS = [
    calT('days.sun'), calT('days.mon'), calT('days.tue'), calT('days.wed'),
    calT('days.thu'), calT('days.fri'), calT('days.sat')
  ];

  const [currentViewDate, setCurrentViewDate] = useState(selectedDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
     const d = new Date(year, month, i + 1);
     return {
        num: i + 1,
        dayStr: DAYS[d.getDay()],
        fullDate: d
     };
  });

  // Auto-scroll to selected date on load or month change
  useEffect(() => {
     if (selectedRef.current) {
         selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
  }, [currentViewDate, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentViewDate(new Date(year, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentViewDate(new Date(parseInt(e.target.value), month, 1));
  };

  const todayStr = new Date().toDateString();

  return (
    <aside className="w-24 bg-surface-container-low border-r border-transparent flex flex-col h-full shrink-0">
      <div className="p-3 text-center border-b border-surface-container">
         <div className="flex items-center justify-between mb-2">
           <button onClick={handlePrevMonth} className="material-symbols-outlined text-[16px] text-secondary hover:text-primary transition-colors">chevron_left</button>
           <button onClick={handleNextMonth} className="material-symbols-outlined text-[16px] text-secondary hover:text-primary transition-colors">chevron_right</button>
         </div>
         <div className="flex flex-col gap-1 items-center justify-center">
            <select value={month} onChange={handleMonthChange} className="bg-transparent text-[11px] font-bold text-secondary uppercase tracking-widest outline-none cursor-pointer appearance-none text-center border-b border-transparent hover:border-outline-variant/30 transition-colors w-full">
               {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={handleYearChange} className="bg-transparent text-[10px] font-bold text-secondary outline-none cursor-pointer appearance-none text-center pb-0.5 w-full">
               {Array.from({length: 10}, (_, i) => year - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto scroll-smooth py-4 custom-scrollbar" ref={scrollRef}>
        <div className="flex flex-col items-center gap-3 pb-8">
          {daysArray.map((d) => {
             const isSelected = d.fullDate.toDateString() === selectedDate.toDateString();
             const isToday = d.fullDate.toDateString() === todayStr;
             
             if (isSelected) {
                return (
                  <button key={d.num} ref={selectedRef} className={`w-16 py-4 flex flex-col items-center rounded-xl bg-primary text-white shadow-xl shadow-primary/20 scale-105 transform transition-all ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                    <span className="text-[10px] font-bold uppercase opacity-80">{String(d.num).padStart(2, '0')}</span>
                    <span className="text-xs font-black uppercase text-center">{d.dayStr}</span>
                  </button>
                );
             }
             return (
                <button
                   key={d.num} 
                   onClick={() => onSelectDate(d.fullDate)}
                   className={`w-16 py-3 flex flex-col items-center rounded-xl transition-colors ${isToday ? 'bg-primary/5 text-primary font-bold ring-1 ring-primary/20' : 'hover:bg-surface-container-high text-secondary hover:text-on-surface'}`}
                >
                  <span className={`text-[10px] uppercase text-center ${isToday ? 'font-black' : 'font-bold'}`}>{String(d.num).padStart(2, '0')} {d.dayStr}</span>
                </button>
             );
          })}
        </div>
      </div>
    </aside>
  );
}
