import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Video, Clock } from 'lucide-react';

export const CalendarTimerCard: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Background focus glow */}
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header: Pomodoro Focus Timer */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-white">Focus Session</h4>
            <span className="text-[10px] text-white/40">Pomodoro Timer</span>
          </div>
        </div>

        {/* Timer display & controls */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono font-bold tracking-tight text-white">
            {formatTimer(timeLeft)}
          </span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-2.5 z-10">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Upcoming Calendar Meeting Card */}
      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 z-10 flex items-center justify-between">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
            <Video className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-semibold text-white truncate">
              Orbidock Engineering Sync
            </h5>
            <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-indigo-400" /> in 14 min
              </span>
              <span>· 4 participants</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Launching Google Meet link...')}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-medium rounded-lg whitespace-nowrap transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
};
