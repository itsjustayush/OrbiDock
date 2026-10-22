import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Battery, BatteryCharging, Bell, Sparkles } from 'lucide-react';
import type { SystemMetrics, DockState } from '../types';

interface TopNotchPillProps {
  dockState: DockState;
  metrics: SystemMetrics;
  onExpand: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  unreadCount?: number;
  currentSong?: string;
}

export const TopNotchPill: React.FC<TopNotchPillProps> = ({
  dockState,
  metrics,
  onExpand,
  onMouseEnter,
  onMouseLeave,
  unreadCount = 2,
  currentSong = 'Midnight City',
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPreview = dockState === 'preview';

  return (
    <motion.div
      layoutId="orbidock-surface"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onExpand}
      initial={{ y: -30, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        width: isPreview ? 280 : 220,
        height: 34,
      }}
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 32,
      }}
      className="glass-pill cursor-pointer rounded-full px-4 flex items-center justify-between shadow-2xl relative select-none hover:border-violet-500/40 transition-colors group"
      title={`Orbidock - ${currentSong} · Click or dwell to expand (Ctrl+Space)`}
    >
      {/* Subtle top reflection */}
      <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Left indicator: live status dot or music indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>

        {isPreview ? (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px] font-medium text-violet-300 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
            Unfold
          </motion.span>
        ) : (
          <span className="text-[12px] font-medium tracking-tight text-white/90 font-mono">
            {time || '12:00'}
          </span>
        )}
      </div>

      {/* Center notch divider / soundwave */}
      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-2.5 bg-violet-400/80 rounded-full animate-pulse" />
        <div className="w-1 h-3.5 bg-cyan-400/80 rounded-full animate-pulse delay-75" />
        <div className="w-1 h-2 bg-indigo-400/80 rounded-full animate-pulse delay-150" />
      </div>

      {/* Right side: Battery or Unread alert */}
      <div className="flex items-center gap-2 text-[11px] text-white/70">
        {unreadCount > 0 && !isPreview && (
          <div className="flex items-center gap-1 text-amber-300/90 font-medium">
            <Bell className="w-3 h-3" />
            <span>{unreadCount}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {metrics.is_charging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Battery className="w-3.5 h-3.5 text-white/70" />
          )}
          <span className="font-mono text-[11px]">
            {metrics.battery_percent ?? 85}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};
