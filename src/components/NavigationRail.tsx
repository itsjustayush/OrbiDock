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
    { id: 'dashboard', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'media', label: 'Music & Lyrics', icon: <Music2 className="w-4 h-4" /> },
    { id: 'shelf', label: 'File Shelf', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'performance', label: 'Hardware', icon: <Activity className="w-4 h-4" /> },
    { id: 'weather', label: 'Weather', icon: <CloudSun className="w-4 h-4" /> },
    { id: 'calendar', label: 'Focus & Tasks', icon: <CalendarCheck2 className="w-4 h-4" /> },
    { id: 'clipboard', label: 'Clipboard', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'ecoinvoice', label: 'Eco Invoice', icon: <Leaf className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-1 w-44 bg-white/[0.02] border border-white/5 rounded-2xl p-2 flex-shrink-0 select-none">
      <div className="px-3 py-1.5 mb-1 text-[10px] font-semibold tracking-wider uppercase text-white/30">
        Navigation
      </div>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
              isActive
                ? 'text-white'
                : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-indigo-600/20 border border-violet-500/40 rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className={`relative z-10 ${isActive ? 'text-violet-400' : ''}`}>
              {tab.icon}
            </span>
            <span className="relative z-10 truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
