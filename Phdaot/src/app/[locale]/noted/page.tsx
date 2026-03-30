"use client";

import React, { useState } from 'react';
import { CalendarSidebar } from './components/CalendarSidebar';
import { NoteEditor } from './components/NoteEditor';
import { ContextSidebar } from './components/ContextSidebar';

export default function NotedPage() {
  const [selectedDate, setSelectedDate] = useState(new Date("2024-10-12")); // Default mock date

  return (
    <div className="-m-8 h-[calc(100vh-64px)] w-[calc(100%+4rem)] flex overflow-hidden bg-surface">
      <CalendarSidebar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <NoteEditor dateKey={selectedDate.toDateString()} />
      <ContextSidebar />
    </div>
  );
}
