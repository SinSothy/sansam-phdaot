import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export interface EventItem {
  id: string;
  title: string;
  dateStr: string;
  type: string;
  span?: number;
  startTime?: string;
  endTime?: string;
}

interface WeekViewProps {
  currentDate?: Date;
  events?: EventItem[];
  onDayClick?: (date: Date) => void;
  onTaskClick?: (task: EventItem) => void;
  onEventUpdate?: (task: EventItem) => void;
}

export default function WeekView({ currentDate = new Date(), events = [], onDayClick, onTaskClick, onEventUpdate }: WeekViewProps) {
  const t = useTranslations('Calendar');
  
  // Generate days based on currentDate
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  const daysLabels = [
    t('days.sun'),
    t('days.mon'),
    t('days.tue'),
    t('days.wed'),
    t('days.thu'),
    t('days.fri'),
    t('days.sat')
  ];

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return {
      name: daysLabels[i].toUpperCase(),
      date: String(d.getDate()).padStart(2, '0'),
      fullDate: d,
      active: d.toDateString() === currentDate.toDateString()
    };
  });

  // Generate 24 hours format "00:00" to "23:00"
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${String(i).padStart(2, "0")}:00`;
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
            // snap to 24px (15 mins)
            return { ...prev, currentTop: Math.max(24, Math.round((prev.initialHeight + deltaY) / 24) * 24) }; 
         } else {
            // snap top to 24px increments
            return { ...prev, currentTop: Math.max(16, Math.round((prev.initialTop + deltaY - 16) / 24) * 24 + 16) }; 
         }
      });
    };
    
    const handleMouseUp = () => {
       const event = events.find(e => e.id === dragState.id);
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
             const endTime = new Date(event.startTime || event.dateStr);
             endTime.setHours(Math.floor(endHour));
             endTime.setMinutes(Math.round((endHour % 1) * 60));
             updated.endTime = endTime.toISOString();
          } else {
             const newTop = dragState.currentTop - 16;
             const newStartHour = newTop / 96;
             const duration = (dragState.initialHeight / 96);
             const endHour = newStartHour + duration;
             
             const st = new Date(event.startTime || event.dateStr);
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
  }, [dragState, events, onEventUpdate]);

  return (
    <div className="flex flex-col h-full bg-surface w-full overflow-y-auto">
      {/* Header */}
      <div className="flex border-b border-outline-variant/20 bg-surface z-30 sticky top-0 shrink-0 shadow-sm">
        <div className="w-20 pt-4 pb-2 text-center text-[10px] font-bold text-secondary flex justify-center items-end border-r border-outline-variant/20">
          GMT-4
        </div>
        <div className="flex-1 grid grid-cols-7">
          {days.map((d) => (
            <div
              key={d.name}
              onClick={() => onDayClick?.(d.fullDate)}
              className={`pt-3 pb-2 flex flex-col items-center border-r border-outline-variant/20 relative cursor-pointer hover:bg-surface-container/50 transition-colors ${d.active ? "bg-primary/5" : ""
                }`}
            >
              <span
                className={`text-[10px] font-bold tracking-widest ${d.active ? "text-[#0b57d0]" : "text-secondary"
                  }`}
              >
                {d.name}
              </span>
              <span
                className={`text-2xl font-bold mt-0.5 ${d.active ? "text-[#0b57d0]" : "text-on-surface"
                  }`}
              >
                {d.date}
              </span>
              {d.active && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#0b57d0] mt-1 absolute bottom-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>



      {/* Time Grid */}
      <div className="flex-1 relative bg-[#f8f9fa]">
        {/* We use min-height of 24 hours * 6rem (96px) each = 2304px roughly */}
        <div className="flex min-h-[2304px]">
          {/* Time Column */}
          <div className="w-20 shrink-0 border-r border-outline-variant/20 bg-surface relative">
            <div className="h-4"></div>
            {hours.map((h) => (
              <div
                key={h}
                className="h-[6rem] pr-2 text-right relative"
              >
                <span className="text-[10px] font-bold text-secondary absolute -top-2.5 right-2 bg-surface pl-1">
                  {h}
                </span>
                <div className="absolute bottom-0 w-full border-b border-outline-variant/10"></div>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Horizontal Lines (Background view) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
              <div className="h-4 w-full shrink-0"></div>
              {hours.map((_, i) => (
                <div key={i} className="h-[6rem] shrink-0 w-full border-b border-outline-variant/10"></div>
              ))}
            </div>

            {/* Clickable Time Slots (7 days x 24 hours) */}
            <div className="absolute inset-0 z-10 pt-4 flex">
              {days.map((d, dayIdx) => (
                <div key={dayIdx} className="flex-1 flex flex-col border-r border-outline-variant/20 relative">
                  {hours.map((_, hourIdx) => (
                    <div 
                      key={hourIdx} 
                      className="h-[6rem] w-full cursor-pointer hover:bg-black/5 transition-colors group relative"
                      onClick={(e) => {
                         e.stopPropagation();
                         const newDate = new Date(d.fullDate);
                         newDate.setHours(hourIdx, 0, 0, 0);
                         onDayClick?.(newDate);
                      }}
                    >
                       {/* Hover indicator */}
                       <div className="absolute left-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary text-[10px] font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm z-50">
                          <span className="material-symbols-outlined text-[12px]">add</span>
                          {t('createTask')}
                       </div>
                    </div>
                  ))}
                  {/* Active day background hint */}
                  {d.active && <div className="absolute inset-0 pointer-events-none bg-primary/[0.02]"></div>}
                </div>
              ))}
            </div>

            {/* Current Time Line ~11:15 AM -> 11.25 hours from 00:00 = 11.25 * 6rem = 67.5rem 
                Only show this if we want to retain the mocked "current time" display. */}
            <div className="absolute top-[67.5rem] -left-[5px] right-0 z-30 pointer-events-none flex items-center pt-4">
              <div className="w-[11px] h-[11px] rounded-full bg-[#0b57d0]"></div>
              <div className="h-[2px] bg-[#0b57d0] w-full"></div>
            </div>

            {/* Rendering Events */}
            <div className="absolute inset-0 z-20 pointer-events-none pt-4 flex">
              {days.map((d, dayIdx) => {
                 const dateStr = `${d.fullDate.getFullYear()}-${String(d.fullDate.getMonth() + 1).padStart(2, '0')}-${String(d.fullDate.getDate()).padStart(2, '0')}`;
                 const dayEvents = events.filter(e => e.dateStr === dateStr);
                 
                 return (
                   <div key={dayIdx} className="flex-1 relative border-r border-transparent">
                     {dayEvents.map(event => {
                        let startHour = 9;
                        let endHour = 10;
                        if (event.startTime) {
                           const sd = new Date(event.startTime);
                           startHour = sd.getHours() + sd.getMinutes() / 60;
                        }
                        if (event.endTime) {
                           const ed = new Date(event.endTime);
                           endHour = ed.getHours() + ed.getMinutes() / 60;
                        }
                        if (endHour <= startHour) endHour = startHour + 1;
                        
                        // Adding 16px to offset for the h-4 padding at the top of the grid lines
                        const top = 16 + (startHour * 96);
                        const height = (endHour - startHour) * 96;
                        
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
                            className={`absolute left-1 right-1 rounded-lg shadow-sm p-2 pointer-events-auto cursor-pointer border border-[#ffffff20] transition-colors overflow-hidden ${bgClass} ${dragState?.id === event.id ? 'z-50 opacity-90 shadow-lg' : 'hover:brightness-95'}`} 
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
                            <h4 className="text-[11px] font-bold leading-tight select-none pointer-events-none">{event.title}</h4>
                            <p className="text-[10px] opacity-90 truncate mt-0.5 select-none pointer-events-none">
                              {event.startTime ? new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </p>
                            
                            {/* Resize Handle */}
                            <div 
                              className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10"
                              onMouseDown={(e) => {
                               if (e.button !== 0) return;
                               e.stopPropagation();
                               setDragState({ id: event.id, initialTop: top, currentTop: height, isResizing: true, initialHeight: height, startY: e.clientY });
                              }}
                            >
                               <div className="w-6 h-1 bg-white/50 rounded-full"></div>
                            </div>
                          </div>
                        );
                     })}
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
