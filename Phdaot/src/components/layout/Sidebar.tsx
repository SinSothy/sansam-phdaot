"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/', icon: 'dashboard', label: 'Boards' },
    { href: '/daily-activity', icon: 'calendar_month', label: 'Daily Activity' },
    { href: '/noted', icon: 'sticky_note_2', label: 'Noted' },
    { href: '/analytics', icon: 'analytics', label: 'Analytics' },
    { href: '/team', icon: 'group', label: 'Members' },
  ];

  return (
    <aside 
      className={`h-screen fixed left-0 top-0 pt-16 bg-surface-container-lowest dark:bg-slate-950 flex flex-col p-4 gap-2 z-30 border-r border-outline-variant/30 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <nav className="flex flex-col gap-1 flex-1 overflow-hidden mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary-container/20 text-primary font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <span 
                className={`text-sm tracking-wide overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-40 opacity-100 ml-3'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-outline-variant/30 overflow-hidden">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center px-3 py-2.5 w-full rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all duration-200"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 transition-transform duration-300">
            {isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
          <span 
            className={`text-sm tracking-wide overflow-hidden whitespace-nowrap transition-all duration-300 text-left ${
              isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-40 opacity-100 ml-3'
            }`}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}
