import React from 'react';

interface KPICardProps {
  icon: string;
  iconClass: string;
  trendText: string;
  trendClass: string;
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  iconStyle?: React.CSSProperties;
}

export function KPICard({
  icon,
  iconClass,
  trendText,
  trendClass,
  title,
  value,
  subtitle,
  progress,
  iconStyle,
}: KPICardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent hover:border-outline-variant/20 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg transition-colors ${iconClass}`}>
          <span className="material-symbols-outlined" data-icon={icon} style={iconStyle}>
            {icon}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendClass}`}>
          {trendText}
        </span>
      </div>
      <p className="text-secondary text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
      {subtitle && <p className="text-[10px] text-slate-400 mt-2 font-medium">{subtitle}</p>}
      {progress !== undefined && (
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
