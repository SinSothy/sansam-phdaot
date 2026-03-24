"use client";

import React from "react";

export function PageHeader() {
  return (
    <header className="mb-10 flex items-end justify-between">
      <div>
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Kanban Clarity</h1>
        <div className="flex items-center gap-2 text-secondary text-sm font-medium">
          <span className="material-symbols-outlined text-lg">star_border</span>
          <span>Design System Team</span>
          <span className="mx-1 text-outline">/</span>
          <span className="text-primary">Boards</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-high rounded-xl transition-all text-sm font-semibold">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-high rounded-xl transition-all text-sm font-semibold">
          <span className="material-symbols-outlined text-lg">visibility</span>
          View
        </button>
      </div>
    </header>
  );
}
