import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, BatteryCharging, Timer, UploadCloud, Bell, Sparkles } from 'lucide-react';
import { VNotchShape } from './VNotchShape';
import type { SystemMetrics, DockState, CalloutNotification } from '../types';

interface TopNotchPillProps {
  dockState: DockState;
  metrics: SystemMetrics;
  onExpand: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  currentSong?: string;
  isMediaPlaying?: boolean;
  onTogglePlay?: () => void;
  timerSeconds?: number;
  isTimerRunning?: boolean;
  shelfFileCount?: number;
  onFilesDropped?: (files: FileList) => void;
  notificationCallout?: CalloutNotification | null;
  pillBehavior?: 'desktop_only' | 'always_visible' | 'hover_only';
}

export const TopNotchPill: React.FC<TopNotchPillProps> = ({
  dockState,
  metrics,
  onExpand,
  onMouseEnter,
  onMouseLeave,
  currentSong = 'Midnight City - M83',
  isMediaPlaying = true,
  onTogglePlay,
  timerSeconds = 0,
  isTimerRunning = false,
  shelfFileCount: _shelfFileCount = 0,
  onFilesDropped,
  notificationCallout = null,
  pillBehavior = 'desktop_only',
}) => {
  const [time, setTime] = useState<string>('');
  const [activePillMode, setActivePillMode] = useState<'default' | 'media' | 'timer'>(
    isMediaPlaying ? 'media' : 'default'
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Update pill mode based on active state
  useEffect(() => {
    if (isTimerRunning) {
      setActivePillMode('timer');
    } else if (isMediaPlaying) {
      setActivePillMode('media');
    } else {
      setActivePillMode('default');
    }
  }, [isTimerRunning, isMediaPlaying]);

  const isPeek = dockState === 'preview';

  // Compact space-optimized geometry (75% reduction from bloated baseline)
  let width = 160;
  let height = 26;
  let r = 8;
  let ear = 5;

  if (notificationCallout) {
    width = 280;
    height = 32;
    r = 10;
    ear = 6;
  } else if (isDragOver) {
    width = 240;
    height = 30;
    r = 10;
    ear = 6;
  } else if (isPeek) {
    width = activePillMode === 'media' ? 240 : 180;
    height = 28;
    r = 9;
    ear = 6;
  } else if (activePillMode === 'media') {
    width = 220;
    height = 26;
    r = 8;
    ear = 5;
  } else if (activePillMode === 'timer') {
    width = 180;
    height = 26;
    r = 8;
    ear = 5;
  }

  // Scroll wheel on notch cycles pill modes (V-Notch gesture)
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY > 0) {
      if (activePillMode === 'default') setActivePillMode('media');
      else if (activePillMode === 'media') setActivePillMode('timer');
      else setActivePillMode('default');
    } else {
      if (activePillMode === 'timer') setActivePillMode('media');
      else if (activePillMode === 'media') setActivePillMode('default');
      else setActivePillMode('timer');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onFilesDropped) {
        onFilesDropped(e.dataTransfer.files);
      }
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Check if pill should be tucked away into bezel to free Chrome tabs
  const shouldTuckIntoBezel =
    pillBehavior === 'hover_only' ||
    (pillBehavior === 'desktop_only' && !notificationCallout && !isHovered && !isPeek && dockState !== 'open');

  return (
    <div
      className="relative flex flex-col items-center select-none"
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave();
      }}
    >
      {/* Invisible Top Edge Hit-Zone (Top 4px) to free Chrome tabs */}
      <div
        className="w-48 h-1.5 cursor-pointer absolute top-0 z-50 group flex items-center justify-center"
        onClick={onExpand}
      >
        {shouldTuckIntoBezel && (
          <div className="w-12 h-[2px] bg-white/20 group-hover:bg-violet-400 group-hover:w-20 transition-all rounded-full" />
        )}
      </div>

      {/* Dynamic Island Pill / iOS Callout Banner */}
      <motion.div
        layout
        initial={false}
        animate={{
          width,
          height: shouldTuckIntoBezel ? 0 : height,
          opacity: shouldTuckIntoBezel ? 0 : 1,
          y: notificationCallout ? 6 : shouldTuckIntoBezel ? -30 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 480,
          damping: 34,
        }}
        onClick={onExpand}
        onWheel={handleWheel}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative z-40 flex items-center justify-center cursor-pointer pointer-events-auto ${
          shouldTuckIntoBezel ? 'pointer-events-none' : ''
        }`}
      >
        {/* Concave Ears & Pure #000000 Optical Mask */}
        <VNotchShape width={width} height={height} borderRadius={r} earRadius={ear}>
          {/* Subtle Specular Top Highlight */}
          <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* iOS-Style Callout Notification State */}
          <AnimatePresence mode="wait">
            {notificationCallout ? (
              <motion.div
                key="notification-callout"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full px-3 flex items-center justify-between text-white"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-2.5 h-2.5 text-violet-300" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] font-bold tracking-tight text-white truncate leading-tight">
                      {notificationCallout.title}
                    </span>
                    <span className="text-[8.5px] text-white/50 truncate leading-tight">
                      {notificationCallout.subtitle}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-violet-400 flex items-center gap-0.5 ml-2 flex-shrink-0">
                  <Sparkles className="w-2.5 h-2.5" /> Now
                </span>
              </motion.div>
            ) : isDragOver ? (
              /* Drag-Over File Drop Stash State */
              <motion.div
                key="drag-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex items-center justify-center gap-2 text-violet-300 px-3"
              >
                <UploadCloud className="w-3.5 h-3.5 animate-bounce" />
                <span className="text-[10px] font-semibold tracking-wide uppercase">
                  Drop to Stash in Shelf
                </span>
              </motion.div>
            ) : activePillMode === 'media' ? (
              /* Live Media Mode */
              <motion.div
                key="media-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-between px-3 text-white"
                onMouseDown={(e) => {
                  if (e.button === 1 && onTogglePlay) {
                    e.preventDefault();
                    onTogglePlay();
                  }
                }}
              >
                {/* Album Cover / Playback Orb */}
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex-shrink-0 flex items-center justify-center shadow-sm"
                    title="Middle click: Play/Pause"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
                  </div>

                  <span className="text-[10px] font-medium tracking-tight text-white/90 truncate font-sans">
                    {currentSong}
                  </span>
                </div>

                {/* Animated Equalizer Bars */}
                <div className="flex items-end gap-[2px] h-3 ml-2 flex-shrink-0">
                  <span
                    className={`w-[2px] bg-emerald-400 rounded-full ${
                      isMediaPlaying ? 'animate-pulse' : 'h-1.5 opacity-40'
                    }`}
                    style={{ height: isMediaPlaying ? '10px' : '4px' }}
                  />
                  <span
                    className={`w-[2px] bg-emerald-400 rounded-full ${
                      isMediaPlaying ? 'animate-pulse' : 'h-2 opacity-40'
                    }`}
                    style={{ height: isMediaPlaying ? '13px' : '6px', animationDelay: '150ms' }}
                  />
                  <span
                    className={`w-[2px] bg-emerald-400 rounded-full ${
                      isMediaPlaying ? 'animate-pulse' : 'h-1 opacity-40'
                    }`}
                    style={{ height: isMediaPlaying ? '8px' : '3px', animationDelay: '300ms' }}
                  />
                </div>
              </motion.div>
            ) : activePillMode === 'timer' ? (
              /* Live Focus Timer Mode */
              <motion.div
                key="timer-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-between px-3 text-white"
              >
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Timer className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Focus</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-white">
                  {formatTimer(timerSeconds)}
                </span>
              </motion.div>
            ) : (
              /* Default Idle Mode: Clock, Status Indicator, Battery */
              <motion.div
                key="default-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-between px-3 text-white/80"
              >
                {/* Status Dot */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
                  </span>
                  <span className="text-[10.5px] font-mono font-semibold text-white">
                    {time || '12:00'}
                  </span>
                </div>

                {/* Battery Meter */}
                <div className="flex items-center gap-1 text-[9.5px] font-mono text-white/60">
                  <span>{metrics.battery_percent ?? 88}%</span>
                  {metrics.is_charging ? (
                    <BatteryCharging className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Battery className="w-3 h-3 text-white/70" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </VNotchShape>
      </motion.div>
    </div>
  );
};
