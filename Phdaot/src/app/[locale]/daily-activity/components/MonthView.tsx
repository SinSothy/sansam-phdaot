import React from "react";
import { useTranslations } from "next-intl";

export interface EventItem {
  id: string;
  title: string;
  dateStr: string;
  type: string;
  span?: number;
  startTime?: string;
  endTime?: string;
  ownerId?: string;
  location?: string;
}

interface MonthViewProps {
  currentDate: Date;
  today: Date;
  events: EventItem[];
  handleDayClick: (date: Date) => void;
  getEventStyle: (type: string) => string;
  onTaskClick?: (task: EventItem) => void;
  onEventUpdate?: (task: EventItem) => void;
}

export default function MonthView({
  currentDate,
  today,
  events,
  handleDayClick,
  getEventStyle,
  onTaskClick,
  onEventUpdate,
}: MonthViewProps) {
  const t = useTranslations('Calendar');
  const dayNames = [
    t('days.sun'),
    t('days.mon'),
    t('days.tue'),
    t('days.wed'),
    t('days.thu'),
    t('days.fri'),
    t('days.sat')
  ];

  const currentEventsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dateString = `${y}-${m}-${d}`;
    return events.filter((e) => e.dateStr === dateString);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  const days = [];
  for (let i = 0; i < 35; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    days.push({
      date: current,
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === today.toDateString(),
      isCurrentMonth7th:
        current.getDate() === 7 && current.getMonth() === 9 && year === 2024,
    });
  }

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const event = events.find(ev => ev.id === taskId);
    if (event && onEventUpdate) {
      const y = targetDate.getFullYear();
      const m = String(targetDate.getMonth() + 1).padStart(2, "0");
      const d = String(targetDate.getDate()).padStart(2, "0");
      const newDateStr = `${y}-${m}-${d}`;
      
      const updated = { ...event, dateStr: newDateStr };
      if (updated.startTime) {
         const st = new Date(updated.startTime);
         st.setFullYear(y, targetDate.getMonth(), targetDate.getDate());
         updated.startTime = st.toISOString();
      }
      if (updated.endTime) {
         const et = new Date(updated.endTime);
         et.setFullYear(y, targetDate.getMonth(), targetDate.getDate());
         updated.endTime = et.toISOString();
      }
      onEventUpdate(updated);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface-container">
      <div className="calendar-grid border-l border-t border-outline-variant/10 grid grid-cols-7 auto-rows-[minmax(120px,1fr)]">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="bg-surface sticky top-0 z-10 p-3 text-center border-b border-r border-outline-variant/20 text-xs font-bold tracking-widest uppercase text-secondary"
          >
            {day}
          </div>
        ))}

        {/* Grid Container */}
        {days.map((day, idx) => {
          const dayEvents = currentEventsForDate(day.date);

          // Following template styling
          const bgClass = day.isCurrentMonth
            ? day.isCurrentMonth7th
              ? "bg-surface-bright group"
              : "bg-white"
            : "bg-surface-container-low";

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(day.date)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, day.date)}
              className={`${bgClass} border-b border-r border-outline-variant/20 p-2 min-h-[140px] relative hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col gap-1 overflow-hidden`}
            >
              <span
                className={`text-sm mb-1 z-10 w-7 h-7 flex items-center justify-center rounded-full ${
                  day.isCurrentMonth7th
                    ? "font-extrabold text-primary bg-primary-container/20"
                    : day.isToday
                    ? "bg-primary text-white font-bold"
                    : day.isCurrentMonth
                    ? "font-bold text-on-surface"
                    : "font-medium text-outline-variant"
                }`}
              >
                {day.date.getDate()}
              </span>

              <div className="flex-1 overflow-y-auto w-full space-y-1 pr-1 custom-scrollbar">
                {dayEvents.map(event => (
                   <div
                     key={event.id}
                     draggable
                     onDragStart={(e) => {
                       e.stopPropagation();
                       e.dataTransfer.setData("taskId", event.id);
                     }}
                     onClick={(e) => {
                       e.stopPropagation();
                       onTaskClick?.(event);
                     }}
                     className={`text-[10px] sm:text-xs p-1 px-1.5 rounded truncate shadow-sm cursor-grab active:cursor-grabbing hover:brightness-95 transition-all ${getEventStyle(event.type)}`}
                   >
                     {event.startTime ? <span className="opacity-75 mr-1">{new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> : null}
                     <span className="font-semibold">{event.title}</span>
                   </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
