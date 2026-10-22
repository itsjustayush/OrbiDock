import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, BatteryCharging, Timer, UploadCloud } from 'lucide-react';
import { VNotchShape } from './VNotchShape';
import type { SystemMetrics, DockState } from '../types';

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
  shelfFileCount = 0,
  onFilesDropped,
}) => {
  const [time, setTime] = useState<string>('');
  const [activePillMode, setActivePillMode] = useState<'default' | 'media' | 'timer'>(
    isMediaPlaying ? 'media' : 'default'
  );
  const [isDragOver, setIsDragOver] = useState(false);

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

  // Update pill mode if media starts or timer starts
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

  // Determine geometry based on V-Notch proportions
  let width = 188;
  let height = 30;
  let r = 10;
  let ear = 6;

  if (isDragOver) {
    width = 290;
    height = 36;
    r = 12;
    ear = 7;
  } else if (isPeek) {
    width = activePillMode === 'media' ? 296 : 204;
    height = 34;
    r = 12;
    ear = 7;
  } else if (activePillMode === 'media') {
    width = 284;
    height = 30;
    r = 10;
    ear = 6;
  } else if (activePillMode === 'timer') {
    width = 230;
    height = 30;
    r = 10;
    ear = 6;
  }

  // Scroll wheel on notch cycles pill modes (V-Notch gesture)
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY > 0) {
      setActivePillMode((prev) =>
        prev === 'default' ? 'media' : prev === 'media' ? 'timer' : 'default'
      );
    } else {
      setActivePillMode((prev) =>
        prev === 'timer' ? 'media' : prev === 'media' ? 'default' : 'timer'
      );
    }
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    // Middle click toggles media playback
    if (e.button === 1 && onTogglePlay) {
      e.preventDefault();
      onTogglePlay();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped?.(e.dataTransfer.files);
      onExpand(); // Open drawer to show file shelf
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="cursor-pointer group flex justify-center"
    >
      <VNotchShape
        width={width}
        height={height}
        borderRadius={r}
        earRadius={ear}
        elevated={isPeek || isDragOver}
        onClick={onExpand}
        onWheel={handleWheel}
        onContextMenu={(e) => {
          e.preventDefault();
          onExpand();
        }}
        className="transition-colors hover:border-violet-500/30"
      >
        <div
          onMouseDown={handleAuxClick}
          className="w-full h-full px-3 flex items-center justify-between text-white text-[11px] font-sans relative overflow-hidden"
          title="Click to unfold · Middle-click play/pause · Scroll to switch mode"
        >
          {/* Drag & Drop Overlay */}
          {isDragOver ? (
            <div className="w-full h-full flex items-center justify-center gap-1.5 text-violet-300 font-semibold animate-pulse">
              <UploadCloud className="w-4 h-4 text-violet-400" />
              <span>Drop file into Notch Shelf</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Mode 1: Live Music Island */}
              {activePillMode === 'media' && (
                <motion.div
                  key="media-mode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-between"
                >
                  {/* Left: Album cover thumbnail */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex-shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="truncate text-[11px] font-medium text-white/90 max-w-[155px]">
                      {currentSong}
                    </span>
                  </div>

                  {/* Right: 3-bar animated audio equalizer */}
                  <div className="flex items-end gap-0.5 h-3 ml-2 flex-shrink-0">
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDuration: '0.4s' }} />
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.7s' }} />
                  </div>
                </motion.div>
              )}

              {/* Mode 2: Live Timer Island */}
              {activePillMode === 'timer' && (
                <motion.div
                  key="timer-mode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Timer className="w-3.5 h-3.5 animate-pulse" />
                    <span className="font-semibold text-[10px] uppercase">Focus</span>
                  </div>
                  <span className="font-mono text-[12px] font-bold text-white tracking-wider">
                    {formatTimer(timerSeconds || 25 * 60)}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </motion.div>
              )}

              {/* Mode 3: Default Idle Island */}
              {activePillMode === 'default' && (
                <motion.div
                  key="default-mode"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex items-center justify-between"
                >
                  {/* Left: Status dot + Time */}
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="font-mono text-[12px] font-medium tracking-tight text-white/90">
                      {time || '12:00'}
                    </span>
                  </div>

                  {/* Right: Shelf indicator or Battery */}
                  <div className="flex items-center gap-1.5 text-white/70">
                    {shelfFileCount > 0 && (
                      <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1 rounded font-mono">
                        {shelfFileCount}f
                      </span>
                    )}
                    {metrics.is_charging ? (
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Battery className="w-3.5 h-3.5 text-white/70" />
                    )}
                    <span className="font-mono text-[11px]">
                      {metrics.battery_percent ?? 85}%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </VNotchShape>
    </div>
  );
};
