"use client";

import React from "react";

import { BoardCard } from "@/components/ui/BoardCard";

export function RecentlyViewed() {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary">schedule</span>
        <h3 className="text-lg font-bold font-headline">Recently viewed</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BoardCard 
          title="Q4 Marketing Campaign"
          gradientFrom="from-blue-600"
          gradientTo="to-indigo-800"
        />
        <BoardCard 
          title="UX Research Repo"
          gradientFrom=""
          gradientTo=""
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAZM4N8JGujOzLoVAcnmZmHSKRHSiyXMkyejtzrILx88TCKh1yL7haXd-nQGrxWSXqNFknjDjKtYA_My0Wro49ccQ1ZUkBVayccyG0j1ITQCTw_PWDiI6PZuZFRN9U0EHrEpCohIdhCRl6VgY20MJyENC7sXhXVgxvU2KZedNsA9lhbtOVm4-EELpKELmGfZLtncIrT3lOadN8zuwHFipYZbAeeNqsdDLs5MDa7zWs5txf1efDc0Fz59_w3FduumMu47-mVQty7"
        />
        <BoardCard 
          title="2024 Product Roadmap"
          gradientFrom="from-emerald-500"
          gradientTo="to-teal-700"
        />
        {/* Create New Card */}
        <div className="h-32 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col items-center justify-center cursor-pointer group">
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-3xl">add_circle</span>
          <span className="text-sm font-semibold text-secondary mt-2">Create new board</span>
        </div>
      </div>
    </section>
  );
}
