import React, { useState, useEffect, useRef } from 'react';

interface DateTimePickerProps {
  value: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
}

export default function DateTimePicker({ value, onChange, onClose }: DateTimePickerProps) {
  const [viewDate, setViewDate] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const [timeStr, setTimeStr] = useState(
    `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleDaySelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const [h, m] = timeStr.split(':').map(Number);
    newDate.setHours(h || 0, m || 0, 0, 0);
    onChange(newDate);
    onClose();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeStr(e.target.value);
    const [h, m] = e.target.value.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(h || 0, m || 0, 0, 0);
    onChange(newDate);
  };

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const startDay = viewDate.getDay();

  return (
    <div ref={ref} className="absolute z-[200] mt-1 p-4 bg-surface rounded-2xl shadow-xl border border-outline-variant/30 w-64 origin-top transition-all">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-on-surface">
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1 text-secondary">
          <button onClick={handlePrevMonth} className="material-symbols-outlined text-sm hover:text-primary transition-colors cursor-pointer bg-surface-container-low rounded p-1">chevron_left</button>
          <button onClick={handleNextMonth} className="material-symbols-outlined text-sm hover:text-primary transition-colors cursor-pointer bg-surface-container-low rounded p-1">chevron_right</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
        {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[10px] font-bold text-secondary">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center mb-4">
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = value.getDate() === day && value.getMonth() === viewDate.getMonth() && value.getFullYear() === viewDate.getFullYear();
          const className = `text-xs cursor-pointer rounded-full w-7 h-7 flex items-center justify-center mx-auto transition-colors ${isSelected ? 'bg-primary text-white font-bold' : 'font-medium text-on-surface hover:bg-surface-container-highest'}`;
          return (
            <span key={day} onClick={() => handleDaySelect(day)} className={className}>
              {day}
            </span>
          );
        })}
      </div>
      
      <div className="border-t border-outline-variant/30 pt-4 flex items-center justify-between">
        <span className="text-xs font-bold text-secondary tracking-widest uppercase">Time</span>
        <input 
          type="time" 
          value={timeStr}
          onChange={handleTimeChange}
          className="text-sm font-bold text-on-surface bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 outline-none focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
