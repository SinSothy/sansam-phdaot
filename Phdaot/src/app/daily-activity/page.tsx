"use client";

import React, { useState, useEffect, useRef } from "react";

type ViewMode = "Day" | "Week" | "Month";

import WeekView from "./components/WeekView";
import DayView from "./components/DayView";
import CreateTaskDialog from "./components/CreateTaskDialog";
import MonthView, { EventItem } from "./components/MonthView";

const TIME_LABELS = Array.from({ length: 23 }, (_, i) => {
  const hour = i + 1;
  return hour < 12 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`;
});

// A predefined list of mock events to match the screenshot exactly for Oct 2024
const MOCK_EVENTS: EventItem[] = [
  { id: "1", title: "Website Redesign Kickoff", dateStr: "2024-10-01", type: "light-blue", span: 1 },
  { id: "2", title: "Q3 Asset Review", dateStr: "2024-10-03", type: "light-gray", span: 1 },
  { id: "3", title: "Frontend Sprint #4: Component...", dateStr: "2024-10-07", type: "dark-blue", span: 2 },
  { id: "4", title: "Urgent: Server Migration", dateStr: "2024-10-10", type: "urgent-red", span: 1 },
  { id: "5", title: "Design Review with Stakeholders", dateStr: "2024-10-15", type: "dark-gray", span: 2 },
  { id: "6", title: "Backlog Grooming", dateStr: "2024-10-17", type: "light-gray", span: 1 },
];

export default function DailyActivityPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("Month");
  const [currentDate, setCurrentDate] = useState(new Date("2024-10-01T00:00:00"));
  
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingTask, setEditingTask] = useState<EventItem | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] = useState("dark-blue");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    if (scrollRef.current && (viewMode === 'Week' || viewMode === 'Day')) {
        scrollRef.current.scrollTop = 7 * 56;
    }
  }, [viewMode]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "Month") newDate.setMonth(newDate.getMonth() - 1);
    if (viewMode === "Week") newDate.setDate(newDate.getDate() - 7);
    if (viewMode === "Day") newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "Month") newDate.setMonth(newDate.getMonth() + 1);
    if (viewMode === "Week") newDate.setDate(newDate.getDate() + 7);
    if (viewMode === "Day") newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date) => {
      setSelectedDate(date);
      setEditingTask(null);
      setNewTaskTitle("");
      setIsDialogOpen(true);
  };

  const handleTaskClick = (task: EventItem) => {
      setEditingTask(task);
      setIsDialogOpen(true);
  };

  const handleEventUpdate = (updatedTask: EventItem) => {
      setEvents(events.map(e => e.id === updatedTask.id ? updatedTask : e));
  };

  const handleSaveTask = () => {
      // Logic for save task is now handled by the CreateTaskDialog which passes the entire custom object.
      // This old handler is not connected to the dialog's onSave, we use the inline onSave handler instead.
  };

  const monthYearLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const getEventStyle = (type: string) => {
      switch (type) {
          case 'light-blue':
              return "bg-primary-container/10 border-l-4 border-primary text-primary";
          case 'dark-blue':
              return "bg-primary text-on-primary";
          case 'urgent-red':
              return "bg-error-container text-on-error-container border-l-4 border-error";
          case 'dark-gray':
              return "bg-secondary text-on-secondary hover:bg-on-surface-variant";
          case 'light-gray':
              return "bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant";
          default:
              return "bg-primary text-on-primary";
      }
  };

  // VIEWS
  const renderMonthView = () => {
    return (
      <MonthView
        currentDate={currentDate}
        today={today}
        events={events}
        handleDayClick={handleDayClick}
        getEventStyle={getEventStyle}
        onTaskClick={handleTaskClick}
        onEventUpdate={handleEventUpdate}
      />
    );
  };

  const renderWeekView = () => { return <WeekView currentDate={currentDate} events={events} onDayClick={handleDayClick} onTaskClick={handleTaskClick} onEventUpdate={handleEventUpdate} />; };

  // ============================
  // SIDEBAR WIDGETS
  // ============================

  const renderJumpToDate = () => {
    const calendarDays = ['S','M','T','W','T','F','S'];
    const jumpDate = new Date(currentDate);
    const monthYear = jumpDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const startOfMonth = new Date(jumpDate.getFullYear(), jumpDate.getMonth(), 1);
    const endOfMonth = new Date(jumpDate.getFullYear(), jumpDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    
    const prevMonthDays = Array.from({ length: startDay }, (_, i) => {
        const d = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), -startDay + i + 1);
        return { date: d, isCurrentMonth: false };
    });
    
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i + 1);
        return { date: d, isCurrentMonth: true };
    });
    
    const totalDays = [...prevMonthDays, ...currentMonthDays];
    
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold">{monthYear}</span>
                <div className="flex gap-1">
                    <button onClick={handlePrev} className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors">chevron_left</button>
                    <button onClick={handleNext} className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors">chevron_right</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center mb-1">
                {calendarDays.map((d, i) => <span key={i} className="text-[10px] font-bold text-secondary">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center gap-y-2">
                {totalDays.map((item, i) => {
                    const isToday = item.date.toDateString() === new Date().toDateString();
                    const isSelected = item.date.toDateString() === currentDate.toDateString();
                    let className = "text-xs cursor-pointer rounded-full w-6 h-6 flex items-center justify-center mx-auto transition-colors ";
                    if (isSelected) className += "bg-primary text-white font-medium";
                    else if (isToday) className += "text-primary font-bold hover:bg-primary/10";
                    else if (!item.isCurrentMonth) className += "text-outline-variant hover:bg-surface-container";
                    else className += "font-medium hover:bg-surface-container text-on-surface";
                    
                    return (
                        <span key={i} onClick={() => { setCurrentDate(item.date); handleDayClick(item.date); }} className={className}>
                            {item.date.getDate()}
                        </span>
                    );
                })}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-surface text-on-surface font-body overflow-hidden">
      
      {/* Calendar Header matching template */}
      <div className="p-6 flex items-center justify-between bg-surface border-b border-surface-container shrink-0">
        <div className="flex items-center gap-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Calendar View</h1>
            <div className="flex items-center bg-surface-container-low rounded-xl p-1 shadow-inner">
                <button 
                  onClick={handleToday}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg hover:bg-surface-container-highest transition-colors"
                >
                  Today
                </button>
                <div className="flex items-center ml-2 border-l border-outline-variant pl-2">
                    <button onClick={handlePrev} className="material-symbols-outlined p-1 hover:text-primary transition-colors">chevron_left</button>
                    <button onClick={handleNext} className="material-symbols-outlined p-1 hover:text-primary transition-colors">chevron_right</button>
                </div>
            </div>
            <span className="text-xl font-bold font-headline">
                {monthYearLabel}
            </span>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-low p-1 rounded-xl">
                {(["Day", "Week", "Month"] as ViewMode[]).map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-4 py-1.5 text-sm font-medium transition-colors ${viewMode === mode ? 'bg-white shadow-sm rounded-lg text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}
                    >
                        {mode}
                    </button>
                ))}
            </div>
            
            <button 
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Task
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar (Filters/Mini Cal) from Template */}
          <div className="w-72 bg-surface-container-low p-6 overflow-y-auto hidden lg:block shrink-0">
              
              <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Jump to Date</h3>
                  {renderJumpToDate()}
              </div>

              <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">My Calendars</h3>
                  <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" defaultChecked className="rounded border-secondary text-primary focus:ring-primary w-4 h-4" /> 
                          <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Core Development</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" defaultChecked className="rounded border-secondary text-secondary-container focus:ring-secondary w-4 h-4" style={{ accentColor: '#D2E2F0' }} />
                          <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Client Reviews</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="rounded border-secondary text-error focus:ring-error w-4 h-4" /> 
                          <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Urgent Fixes</span>
                      </label>
                  </div>
              </div>

              <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Team</h3>
                  <div className="flex -space-x-2">
                      <img className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Team member 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHgiyBis4eKdUPuCOCzyZQu75qSAT4s6oBWnPjfhWniRBEEv0x79Jn4DOjQFa8UogI0aCkH1qe2xvpOMKk-8kO6oLuJ3JaSzIkZrKfjqQ2kmFi5ZygN6m5GDV_KtYWhqCiZ-5TGxjP4XMTkh4QXySy7Zr4Hdq7zdGWjzBRhz8VTRpZMVU1h3AcPI1rhJg2ubB69uNNJaI--jaSmAFJbGyQ7rk10nANrsWS30gZG6ZZQVflCJycEWfYTNHRwgoOWbayN4v5GjCu" />
                      <img className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Team member 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBArfKeSg0Jk5cp9DvJE6GlFjkznXG-lgeJfLrGnsCh5r0zDd57W42h6HCLjjqvrE6EuWF0TAi7sV5G3u84XyERELaswIs8pHc4ehONsKwxpvu658h5rqaVB51o7Khjk5WCtbqzLImoowiYDkw8ShKOoQvH8YZOCvpErqanPGD5O1fYzu94z0HdjCxhD0-HSl0Vtg7ySK5ZpKg5wthenBBK23YtXUoRHRfCta6_eHqv6TdhsXZfcHScEtIqiLp-CT30rI5XvsxD" />
                      <img className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Team member 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOoSrxltiVoCno_Oc_djh3W9-mvxiVDbaNYD58WmPK5K_Xt3YAgxbUgUUw9fi_ZFLLcJ-kwC6afc4Q0FT_3mcgfNfJqQHVVRoBu4n--3yEgV4yNKgnJ9lRuAedV8RMHEMtzQE86D39Z_Li8_p-JXuARIR5c9bzyBcb12UmCPACsNQIbBhG0jI6S0RgE336pnWw1K_5CoxlLrOblWmgEH4abH2cFprJ_L6qcyhThs_se5FIoXXWjsf6e1vkhjf3qiPMJ_aNPE8G" />
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-white flex items-center justify-center text-[10px] font-bold text-on-surface">+4</div>
                  </div>
              </div>
          </div>

          {/* Right Calendar Content */}
          {viewMode === "Month" && renderMonthView()}
          {viewMode === "Week" && renderWeekView()}
          {viewMode === "Day" && (
            <DayView 
              currentDate={currentDate} 
              events={events} 
              onPrev={handlePrev} 
              onNext={handleNext} 
              onToday={handleToday} 
              onDayClick={handleDayClick}
              onTaskClick={handleTaskClick}
              onEventUpdate={handleEventUpdate}
            />
          )}

      </div>

      {/* Floating Action Button from Template */}
      <button 
         onClick={() => setIsDialogOpen(true)}
         className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full text-on-primary shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50 focus:outline-none focus:ring-4 focus:ring-primary-container"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>

      {/* Dialog Overlay */}
      <CreateTaskDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDate={selectedDate}
        editTask={editingTask}
        onSave={(task) => {
          if (events.find(e => e.id === task.id)) {
             setEvents(events.map(e => e.id === task.id ? task : e));
          } else {
             setEvents([...events, task]);
          }
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
