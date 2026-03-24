import React, { useState, useEffect } from 'react';

export interface EventItem {
  id: string;
  title: string;
  dateStr: string;
  type: string;
  span?: number;
  startTime?: string;
  endTime?: string;
}

interface DayViewProps {
  currentDate: Date;
  events: EventItem[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onDayClick?: (date: Date) => void;
  onTaskClick?: (task: EventItem) => void;
  onEventUpdate?: (task: EventItem) => void;
}

export default function DayView({ currentDate, events, onPrev, onNext, onToday, onDayClick, onTaskClick, onEventUpdate }: DayViewProps) {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayName = daysOfWeek[currentDate.getDay()];
  const dateNum = String(currentDate.getDate()).padStart(2, '0');
  
  const monthYearStr = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  
  const y = currentDate.getFullYear();
  const m = String(currentDate.getMonth() + 1).padStart(2, '0');
  const d = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;
  
  const todaysEvents = events.filter(e => e.dateStr === dateStr);
  const eventsCount = todaysEvents.length;

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return hour === 0 ? `12 AM` : hour < 12 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`;
  });

  const [dragState, setDragState] = useState<{ id: string, initialTop: number, currentTop: number, isResizing: boolean, initialHeight: number, startY: number } | null>(null);

  useEffect(() => {
    if (!dragState) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = e.clientY - dragState.startY;
      
      setDragState(prev => {
         if (!prev) return prev;
         if (prev.isResizing) {
            // snap to 24px (15 mins) for height minimum
            return { ...prev, currentTop: Math.max(24, Math.round((prev.initialHeight + deltaY) / 24) * 24) }; 
         } else {
            // snap top to 24px increments
            return { ...prev, currentTop: Math.max(16, Math.round((prev.initialTop + deltaY - 16) / 24) * 24 + 16) }; 
         }
      });
    };
    
    const handleMouseUp = () => {
       const event = todaysEvents.find(e => e.id === dragState.id);
       if (event) {
          const updated = { ...event };
          if (dragState.isResizing) {
             const newHeight = dragState.currentTop;
             const newDurationHours = newHeight / 96;
             let startHour = 9;
             if (event.startTime) {
                const d = new Date(event.startTime);
                startHour = d.getHours() + d.getMinutes() / 60;
             }
             const endHour = startHour + newDurationHours;
             const endTime = new Date(event.startTime || currentDate);
             if (!event.startTime) updated.startTime = new Date(currentDate.setHours(9)).toISOString();
             endTime.setHours(Math.floor(endHour));
             endTime.setMinutes(Math.round((endHour % 1) * 60));
             updated.endTime = endTime.toISOString();
          } else {
             const newTop = dragState.currentTop - 16;
             const newStartHour = newTop / 96;
             const duration = (dragState.initialHeight / 96);
             const endHour = newStartHour + duration;
             
             const st = new Date(event.startTime || currentDate);
             st.setHours(Math.floor(newStartHour));
             st.setMinutes(Math.round((newStartHour % 1) * 60));
             updated.startTime = st.toISOString();
             
             const et = new Date(st);
             et.setHours(Math.floor(endHour));
             et.setMinutes(Math.round((endHour % 1) * 60));
             updated.endTime = et.toISOString();
          }
          onEventUpdate?.(updated);
       }
       setDragState(null);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, todaysEvents, onEventUpdate, currentDate]);

  return (
    <div className="flex flex-col h-full bg-surface w-full overflow-hidden">
      {/* Day View Header */}
      <div className="flex border-b border-outline-variant/20 bg-surface z-30 shrink-0 h-24 shadow-sm">
        {/* Left Block - Date */}
        <div 
          onClick={() => onDayClick?.(currentDate)}
          className="w-28 border-r border-outline-variant/20 flex flex-col items-center justify-center shrink-0 cursor-pointer hover:bg-surface-container-low transition-colors"
        >
          <span className="text-[12px] font-bold text-[#0b57d0] tracking-widest uppercase mb-0.5">{dayName}</span>
          <span className="text-4xl font-extrabold text-on-surface leading-none tracking-tight">{dateNum}</span>
        </div>
        
        {/* Middle Block - Info */}
        <div className="flex-1 flex flex-col justify-center px-6">
          <h2 className="text-[20px] font-extrabold text-on-surface">{monthYearStr}</h2>
          <span className="text-[13px] text-secondary font-medium mt-1">
            {eventsCount} {eventsCount === 1 ? 'event' : 'events'} scheduled for today
          </span>
        </div>

        {/* Right Block - Actions */}
        <div className="flex items-center px-6 gap-3">
          <button 
            onClick={onToday}
            className="px-4 py-2 text-[13px] font-bold bg-surface-container-low text-on-surface hover:bg-surface-container-highest rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-surface-container-low rounded-lg p-[3px]">
            <button onClick={onPrev} className="material-symbols-outlined p-1 hover:text-primary transition-colors text-secondary rounded shadow-sm hover:shadow-md text-[18px]">chevron_left</button>
            <button onClick={onNext} className="material-symbols-outlined p-1 hover:text-primary transition-colors text-secondary rounded shadow-sm hover:shadow-md text-[18px]">chevron_right</button>
          </div>
        </div>
      </div>

      {/* Day Time Grid */}
      <div className="flex-1 overflow-y-auto bg-surface relative">
        <div className="flex min-h-[2304px]">
          {/* Time Column */}
          <div className="w-28 shrink-0 border-r border-outline-variant/20 bg-surface relative">
            <div className="h-4"></div>
            {hours.map((h, i) => (
              <div key={i} className="h-[6rem] relative pr-3">
                <span className="text-[11px] font-medium text-secondary absolute -top-2.5 right-4 pl-1">
                  {h}
                </span>
                <div className="absolute bottom-0 w-full border-b border-outline-variant/10"></div>
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div className="flex-1 relative bg-[#f8f9fa] z-10">
            {/* Horizontal lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
              <div className="h-4 w-full shrink-0"></div>
              {hours.map((_, i) => (
                <div key={i} className="h-[6rem] shrink-0 w-full border-b border-outline-variant/10"></div>
              ))}
            </div>
            
            {/* Clickable Time Slots */}
            <div className="absolute inset-0 flex flex-col z-10 pt-4">
              {hours.map((_, i) => (
                <div 
                  key={i} 
                  className="h-[6rem] shrink-0 w-full cursor-pointer hover:bg-black/5 transition-colors group relative"
                  onClick={(e) => {
                     e.stopPropagation(); 
                     const newDate = new Date(currentDate);
                     newDate.setHours(i, 0, 0, 0);
                     onDayClick?.(newDate); 
                  }}
                >
                   {/* Hover New Task Indicator */}
                   <div className="absolute left-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary text-xs font-bold bg-white/90 px-2 py-1 rounded shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      New Task
                   </div>
                </div>
              ))}
            </div>
            
            {/* Events Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none pt-4">
               {todaysEvents.map(event => {
                  let startHour = 9; // Default if no time
                  let endHour = 10;
                  
                  if (event.startTime) {
                     const d = new Date(event.startTime);
                     startHour = d.getHours() + d.getMinutes() / 60;
                  }
                  if (event.endTime) {
                     const d = new Date(event.endTime);
                     endHour = d.getHours() + d.getMinutes() / 60;
                  }
                  if (endHour <= startHour) endHour = startHour + 1;
                  
                  // Adding 16px for the top padding offset of the grid lines (h-4)
                  const top = 16 + (startHour * 96); // 6rem = 96px
                  const height = (endHour - startHour) * 96;
                  
                  // Same styling logic as page.tsx (simplified for demo)
                  let bgClass = "bg-[#0b57d0] text-white";
                  if (event.type === "light-blue") bgClass = "bg-[#d2e3fc] text-[#0b57d0] border-l-4 border-[#0b57d0]";
                  if (event.type === "urgent-red") bgClass = "bg-[#fce8e6] text-[#c5221f] border-l-4 border-[#c5221f]";
                  if (event.type === "light-gray") bgClass = "bg-surface-container-highest border border-outline-variant/30 text-surface-variant";
                  if (event.type === "dark-gray") bgClass = "bg-secondary text-white";

                  const isDragging = dragState?.id === event.id && !dragState.isResizing;
                  const isResizing = dragState?.id === event.id && dragState.isResizing;
                  
                  const displayTop = isDragging ? dragState.currentTop : top;
                  const displayHeight = isResizing ? dragState.currentTop : height;

                  return (
                    <div 
                      key={event.id} 
                      className={`absolute left-4 right-4 rounded-xl shadow-sm p-3 pointer-events-auto cursor-pointer border border-[#ffffff20] transition-colors ${dragState?.id === event.id ? 'z-50 opacity-90' : 'hover:brightness-95'} overflow-hidden ${bgClass}`} 
                      style={{ top: `${displayTop}px`, height: `${displayHeight}px` }}
                      onMouseDown={(e) => {
                         if (e.button !== 0) return;
                         e.stopPropagation();
                         setDragState({ id: event.id, initialTop: top, currentTop: top, isResizing: false, initialHeight: height, startY: e.clientY });
                      }}
                      onClick={(e) => {
                         e.stopPropagation();
                         onTaskClick?.(event);
                      }}
                    >
                      <h4 className="text-sm font-bold truncate select-none">{event.title}</h4>
                      <p className="text-xs opacity-90 truncate mt-0.5 select-none">
                        {event.startTime ? new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        {event.endTime ? ` - ${new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                      </p>
                      
                      {/* Resize Handle */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10"
                        onMouseDown={(e) => {
                           if (e.button !== 0) return;
                           e.stopPropagation();
                           setDragState({ id: event.id, initialTop: top, currentTop: height, isResizing: true, initialHeight: height, startY: e.clientY });
                        }}
                      >
                         <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
