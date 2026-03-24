"use client";

import React, { useMemo, useState } from 'react';

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface LineSeries {
  key: string;
  color: string;
  fillColor?: string;
  name?: string;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  series: LineSeries[];
  height?: number | string;
}

export function LineChart({ data, series, height = 256 }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate SVG bounds and coordinates
  const { paths, areaPaths, points, labels, maxVal } = useMemo(() => {
    if (!data.length || !series.length) return { paths: [], areaPaths: [], points: [], labels: [], maxVal: 100 };

    // Find the global maximum to scale the Y axis
    const allValues = data.flatMap(d => series.map(s => Number(d[s.key]) || 0));
    const maxVal = Math.max(...allValues, 100) * 1.1; // 10% padding on top

    const xPoints = data.map((_, i) => (i / Math.max(data.length - 1, 1)) * 100);
    const labels = data.map(d => d.label);

    const paths = series.map(s => {
      return xPoints.reduce((path, x, i) => {
        const val = Number(data[i][s.key]) || 0;
        const y = 100 - (val / maxVal) * 100;
        if (i === 0) return `M ${x},${y}`;
        const prevX = xPoints[i - 1];
        const prevY = 100 - ((Number(data[i - 1][s.key]) || 0) / maxVal) * 100;
        const cpX = (prevX + x) / 2;
        // Cubic bezier for smooth spline
        return `${path} C ${cpX},${prevY} ${cpX},${y} ${x},${y}`;
      }, "");
    });

    const areaPaths = paths.map(path => {
      // Close the path around the bottom to form the fill area
      return `${path} L 100,100 L 0,100 Z`;
    });

    const points = series.map(s => {
      return data.map((d, i) => ({
        x: xPoints[i],
        y: 100 - ((Number(d[s.key]) || 0) / maxVal) * 100,
        val: d[s.key]
      }));
    });

    return { paths, areaPaths, points, labels, maxVal };
  }, [data, series]);

  return (
    <div className="relative w-full group" style={{ height }}>
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        
        {/* Background Grid Lines (Y-Axis guides) */}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
        ))}
        
        {/* Fill Areas */}
        {areaPaths.map((d, i) => (
          series[i].fillColor && (
            <path key={`area-${i}`} d={d} fill={series[i].fillColor} className="transition-all duration-500 ease-in-out" />
          )
        ))}

        {/* Stoke Lines */}
        {paths.map((d, i) => (
          <path 
            key={`line-${i}`} 
            d={d} 
            fill="none" 
            stroke={series[i].color} 
            strokeLinecap="round" 
            strokeWidth="1.5" 
            className="transition-all duration-500 ease-in-out" 
          />
        ))}

        {/* Hover Interaction Areas & Points */}
        {points[0]?.map((_, dataIndex) => {
            const isHovered = hoveredIndex === dataIndex;
            return (
              <g 
                key={`point-group-${dataIndex}`} 
                onMouseEnter={() => setHoveredIndex(dataIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Transparent hit area column for easier hovering */}
                <rect 
                  x={points[0][dataIndex].x - 5} 
                  y="0" 
                  width="10" 
                  height="100" 
                  fill="transparent" 
                />
                
                {/* Vertical hover line indicator */}
                <line 
                  x1={points[0][dataIndex].x} 
                  x2={points[0][dataIndex].x} 
                  y1="0" 
                  y2="100" 
                  stroke="#e2e8f0" 
                  strokeWidth="0.5" 
                  strokeDasharray="2,2"
                  opacity={isHovered ? 1 : 0}
                  className="transition-opacity duration-200"
                />

                {/* Data point dots */}
                {points.map((seriesPoints, seriesIndex) => (
                  <circle 
                    key={`dot-${seriesIndex}-${dataIndex}`}
                    cx={seriesPoints[dataIndex].x} 
                    cy={seriesPoints[dataIndex].y} 
                    fill={series[seriesIndex].color} 
                    r={isHovered ? 2.5 : 0}
                    stroke="white"
                    strokeWidth="1"
                    className="transition-all duration-200"
                  />
                ))}
              </g>
            );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div 
          className="absolute z-10 bg-white/95 backdrop-blur shadow-xl rounded-xl p-3 border border-slate-100 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 transition-all duration-100 ease-out"
          style={{ 
            left: `${points[0][hoveredIndex].x}%`, 
            top: `${Math.min(...points.map(p => p[hoveredIndex].y))}%`, // Tooltip slightly above the highest point
          }}
        >
          <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">{labels[hoveredIndex]}</p>
          <div className="space-y-2">
            {series.map((s, seriesIndex) => (
              <div key={s.key} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span className="text-[11px] font-bold text-slate-600">{s.name || s.key}</span>
                </div>
                <span className="text-[11px] font-black" style={{ color: s.color }}>
                  {points[seriesIndex][hoveredIndex].val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
