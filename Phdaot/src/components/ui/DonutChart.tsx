import React from 'react';

export interface DonutData {
  label: string;
  value: number;
  colorClass: string; // Tailwind stroke class, e.g. 'stroke-emerald-500'
  bgClass: string; // Tailwind background class for the legend, e.g., 'bg-emerald-500'
}

export interface DonutChartProps {
  data: DonutData[];
  totalLabel?: string;
}

export function DonutChart({ data, totalLabel = 'Total' }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let currentOffset = 0;
  
  return (
    <div className="flex flex-col">
      <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
        {/* SVG Circle utilizing r=15.9155 to ensure circumference is exactly 100 for percentage dashes */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="15.9155" strokeWidth="3"></circle>
          
          {data.map((item, index) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0;
            const dashArray = `${percent}, 100`;
            const dashOffset = -currentOffset;
            currentOffset += percent;
            
            return (
              <circle 
                key={index}
                className={`${item.colorClass} transition-all duration-1000 ease-out`} 
                cx="18" cy="18" fill="none" r="15.9155" 
                strokeDasharray={dashArray} 
                strokeDashoffset={dashOffset} 
                strokeWidth="3"
                strokeLinecap="round"
              ></circle>
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-on-surface">{total}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none mt-1">{totalLabel}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs group cursor-default">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.bgClass} group-hover:scale-125 transition-transform`}></div>
              <span className="font-medium text-secondary group-hover:text-on-surface transition-colors">{item.label}</span>
            </div>
            <span className="font-bold text-on-surface">{total > 0 ? Math.round((item.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
