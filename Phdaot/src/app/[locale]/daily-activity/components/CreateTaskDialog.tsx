import React, { useState, useRef, useEffect } from 'react';
import DateTimePicker from './DateTimePicker';
import OwnerSelect, { mockOwners, Owner } from './OwnerSelect';
import { useTranslations } from 'next-intl';

export interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  editTask: any | null;
  onSave: (task: any) => void;
}

export default function CreateTaskDialog({ isOpen, onClose, selectedDate, editTask, onSave }: CreateTaskDialogProps) {
  const t = useTranslations('Calendar');
  const commonT = useTranslations('Common');
  
  const TASK_TYPES = [
    { id: 'dark-blue', color: 'bg-primary', label: t('taskType') },
    { id: 'light-blue', color: 'bg-[#d2e3fc]', label: 'Normal' },
    { id: 'urgent-red', color: 'bg-[#fce8e6]', label: 'Urgent' },
    { id: 'dark-gray', color: 'bg-secondary', label: 'Archived' },
    { id: 'light-gray', color: 'bg-surface-container-highest', label: 'Backlog' }
  ];

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("dark-blue");

  // Use fixed date for initial SSR to avoid hydration mismatch
  const [startDate, setStartDate] = useState<Date>(selectedDate || new Date('2024-10-01T00:00:00'));
  const [endDate, setEndDate] = useState<Date>(new Date(startDate.getTime() + 90 * 60000));
  const [owner, setOwner] = useState<Owner>(mockOwners[0]);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        setTaskName(editTask.title || "");
        setDescription(""); // Add description if added to EventItem later
        setTaskType(editTask.type || "dark-blue");
        if (editTask.startTime) setStartDate(new Date(editTask.startTime));
        else setStartDate(selectedDate || new Date());
        
        if (editTask.endTime) setEndDate(new Date(editTask.endTime));
        else setEndDate(new Date((editTask.startTime ? new Date(editTask.startTime).getTime() : (selectedDate?.getTime() || Date.now())) + 90 * 60000));
        
        const foundOwner = editTask.ownerId ? mockOwners.find(o => o.id === editTask.ownerId) : null;
        setOwner(foundOwner || mockOwners[0]);
        setLocation(editTask.location || "");
        setShowLocationInput(!!editTask.location);
      } else if (selectedDate) {
        setTaskName("");
        setDescription("");
        setTaskType("dark-blue");
        setStartDate(selectedDate);
        setEndDate(new Date(selectedDate.getTime() + 90 * 60000));
        setOwner(mockOwners[0]);
        setLocation("");
        setShowLocationInput(false);
      } else {
        // Fallback for FAB or other generic triggers
        const now = new Date();
        setTaskName("");
        setDescription("");
        setTaskType("dark-blue");
        setStartDate(now);
        setEndDate(new Date(now.getTime() + 90 * 60000));
        setOwner(mockOwners[0]);
        setLocation("");
        setShowLocationInput(false);
      }
    }
  }, [isOpen, selectedDate, editTask]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!taskName.trim()) return;
    const y = startDate.getFullYear();
    const m = String(startDate.getMonth() + 1).padStart(2, '0');
    const d = String(startDate.getDate()).padStart(2, '0');

    onSave({
      id: editTask?.id || Math.random().toString(),
      title: taskName,
      dateStr: `${y}-${m}-${d}`,
      type: taskType,
      span: editTask?.span || 1,
      ownerId: owner.id,
      location: location,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString()
    });
  };

  const formatDisplayDate = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const formatDisplayTime = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-[600px] overflow-visible transform transition-all flex flex-col p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-extrabold text-on-surface">{editTask ? t('editTask') : t('createTask')}</h2>
          <button onClick={onClose} className="text-secondary hover:text-on-surface hover:bg-surface-container p-2 rounded-full transition-colors leading-none inline-flex">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Task Name Input */}
        <div className="mb-8">
          <input
            type="text"
            autoFocus
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            placeholder={t('taskTitle')}
            className="w-full text-2xl font-bold text-on-surface placeholder-outline-variant/60 bg-transparent border-b-2 border-primary/80 focus:border-primary pb-3 outline-none transition-colors"
          />
        </div>

        {/* Date / Time Row */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">{t('startDate')}</label>
            <div
              onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
              className="flex items-center bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/20 hover:border-outline-variant/50 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0b57d0] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              <div className="flex-1 flex flex-col truncate">
                <span className="text-sm font-bold text-on-surface leading-tight truncate">{formatDisplayDate(startDate)}</span>
              </div>
              <div className="text-[13px] text-secondary font-medium ml-2 whitespace-nowrap">{formatDisplayTime(startDate)}</div>
            </div>
            {showStartPicker && <DateTimePicker value={startDate} onChange={setStartDate} onClose={() => setShowStartPicker(false)} />}
          </div>

          <div className="flex items-center justify-center mt-6 text-secondary pb-1">
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </div>

          <div className="flex-1 relative">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">{t('endDate')}</label>
            <div
              onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
              className="flex items-center bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/20 hover:border-outline-variant/50 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0b57d0] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <div className="flex-1 flex flex-col truncate">
                <span className="text-sm font-bold text-on-surface leading-tight truncate">{formatDisplayDate(endDate)}</span>
              </div>
              <div className="text-[13px] text-secondary font-medium ml-2 whitespace-nowrap">{formatDisplayTime(endDate)}</div>
            </div>
            {showEndPicker && <DateTimePicker value={endDate} onChange={setEndDate} onClose={() => setShowEndPicker(false)} />}
          </div>
        </div>

        {/* Owner & Priority Row */}
        <div className="flex items-center gap-6 mb-8 relative z-50">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">{t('team')}</label>
            <OwnerSelect value={owner} onChange={setOwner} />
          </div>
          
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">{t('taskType')}</label>
            <div className="flex items-center gap-2 bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/20 h-[66px]">
              {TASK_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setTaskType(type.id)}
                  title={type.label}
                  className={`relative w-8 h-8 rounded-full border-2 transition-transform ${type.color} ${taskType === type.id ? 'scale-110 border-primary shadow-md' : 'border-transparent hover:scale-105'}`}
                >
                  {taskType === type.id && <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-[16px] text-white">check</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes, links or context..."
            className="w-full h-24 bg-surface-container-low/40 border-none rounded-2xl p-4 text-sm font-medium text-on-surface placeholder-outline-variant focus:outline-none focus:ring-1 focus:ring-outline-variant/50 transition-all resize-none shadow-inner"
          ></textarea>
        </div>

        {/* Dynamic Location Area */}
        {showLocationInput && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Location</label>
            <div className="flex items-center bg-surface-container-low/40 rounded-xl px-4 py-2.5 shadow-inner border border-outline-variant/10 focus-within:border-outline-variant/40 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-secondary mr-3">location_on</span>
              <input
                autoFocus
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter meeting link or physical location..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-on-surface placeholder-outline-variant"
              />
              <button onClick={() => setShowLocationInput(false)} className="text-secondary hover:text-error transition-colors p-1">
                <span className="material-symbols-outlined text-[18px] block">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Extras & Actions */}
        <div className="flex items-center justify-between mt-2 pt-2">
          <div className="flex gap-3">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[#e8f0fe] text-[#0b57d0] px-4 py-2 rounded-full hover:bg-[#d2e3fc] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] leading-none">attach_file</span>
              <span className="text-xs font-bold leading-none mt-0.5">Add Attachment</span>
            </button>
            <button
              onClick={() => setShowLocationInput(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${showLocationInput ? 'bg-surface-container-highest text-secondary opacity-50 cursor-not-allowed' : 'bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc]'}`}
              disabled={showLocationInput}
            >
              <span className="material-symbols-outlined text-[16px] leading-none">location_on</span>
              <span className="text-xs font-bold leading-none mt-0.5">Add Location</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-secondary hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
            >
              {commonT('cancel')}
            </button>
            <button
              onClick={handleSave}
              className="px-7 py-2.5 text-sm font-bold bg-[#0b57d0] text-white rounded-xl hover:shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              {commonT('save')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
