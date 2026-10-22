import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Music2,
  UploadCloud,
  Activity,
  CloudSun,
  CalendarCheck2,
  ClipboardList,
  Leaf,
  Settings,
} from 'lucide-react';
import type { TabType } from '../types';

interface NavigationRailProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'media', label: 'Music & Lyrics', icon: <Music2 className="w-3.5 h-3.5" /> },
    { id: 'shelf', label: 'File Shelf', icon: <UploadCloud className="w-3.5 h-3.5" /> },
    { id: 'performance', label: 'Hardware', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'weather', label: 'Weather', icon: <CloudSun className="w-3.5 h-3.5" /> },
    { id: 'calendar', label: 'Focus & Tasks', icon: <CalendarCheck2 className="w-3.5 h-3.5" /> },
    { id: 'clipboard', label: 'Clipboard', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'ecoinvoice', label: 'Eco Invoice', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-1 w-11 bg-black/40 border border-white/5 rounded-2xl p-1 flex-shrink-0 select-none items-center">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            title={tab.label}
            className={`group relative flex items-center justify-center w-9 h-8 rounded-xl text-white/50 transition-all ${
              isActive
                ? 'text-white'
                : 'hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-violet-600/30 border border-violet-500/40 rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className={`relative z-10 transition-colors ${isActive ? 'text-violet-300' : ''}`}>
              {tab.icon}
            </span>

            {/* Hover Tooltip */}
            <div className="absolute left-12 px-2 py-1 bg-[#10121a] border border-white/10 rounded-md text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};
