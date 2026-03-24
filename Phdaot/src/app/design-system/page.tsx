import React from "react";
import { Typography } from "@/components/ui/Typography";
import { IconButton } from "@/components/ui/IconButton";
import { BoardCard } from "@/components/ui/BoardCard";

export default function DesignSystemPage() {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-12">
      <Typography variant="h1">Phdaot Design System</Typography>
      
      <section className="space-y-4">
        <Typography variant="h3">1. Typography Tokens</Typography>
        <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <Typography variant="h1">Headline h1 - Kanban Clarity</Typography>
          <Typography variant="h2">Headline h2 - Workspace Teams</Typography>
          <Typography variant="h3">Headline h3 - RECENTLY VIEWED</Typography>
          <Typography variant="h4">Headline h4 - Mobile App Development</Typography>
          <Typography variant="h5">Headline h5 - App Launch Master</Typography>
          <Typography variant="body">Body - Central hub for all launch deliverables and cross-functional syncing.</Typography>
          <Typography variant="label">Label - New Board in Mobile App</Typography>
          <Typography variant="caption">Caption - ACTIVE</Typography>
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="h3">2. Core Color Palette</Typography>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["bg-primary", "bg-primary-container", "bg-secondary", "bg-secondary-container", "bg-tertiary", "bg-surface", "bg-surface-container-highest", "bg-outline"].map((colorClass) => (
             <div key={colorClass} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant">
               <div className={`w-12 h-12 rounded-full ${colorClass}`} />
               <Typography variant="caption">{colorClass}</Typography>
             </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Typography variant="h3">3. UI Components</Typography>
        <div className="flex gap-4 p-6 bg-surface-container-lowest rounded-2xl items-center shadow-sm">
           <IconButton icon="notifications" variant="ghost" />
           <IconButton icon="filter_list" variant="surface" />
           <IconButton icon="add" variant="primary" />
           <Typography variant="label">Icon Buttons</Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
           <BoardCard title="Q4 Marketing" gradientFrom="from-blue-600" gradientTo="to-indigo-800" />
           <BoardCard title="Component Library" gradientFrom="from-blue-400" gradientTo="to-indigo-400" statusColor="bg-emerald-500" statusText="ACTIVE" />
        </div>
      </section>
    </main>
  );
}
