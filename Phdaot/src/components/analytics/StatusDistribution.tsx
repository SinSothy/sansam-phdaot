"use client";

import React from 'react';
import { DonutChart, DonutData } from '@/components/ui/DonutChart';

const mockDistributionData: DonutData[] = [
  { label: 'Completed', value: 14, colorClass: 'stroke-emerald-500', bgClass: 'bg-emerald-500' },
  { label: 'In Progress', value: 6, colorClass: 'stroke-primary', bgClass: 'bg-primary' },
  { label: 'To Do', value: 4, colorClass: 'stroke-amber-400', bgClass: 'bg-amber-400' },
];

export function StatusDistribution() {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 text-center border border-outline-variant/10">
      <h3 className="text-sm font-bold text-on-surface text-left mb-6">Status Distribution</h3>
      <DonutChart data={mockDistributionData} totalLabel="Boards" />
    </section>
  );
}
