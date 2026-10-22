import React from 'react';
import type { DockState } from '../types';

interface DevOverlayProps {
  fps: number;
  dockState: DockState;
  onSetState: (state: DockState) => void;
  isTauri: boolean;
}

export const DevOverlay: React.FC<DevOverlayProps> = ({
  fps,
  dockState,
  onSetState,
  isTauri,
}) => {
  return (
    <div className="fixed bottom-3 right-3 z-50 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white/80 shadow-2xl flex items-center gap-3 select-none">
      <div className="flex items-center gap-1.5 font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">{fps} FPS</span>
      </div>

      <div className="h-3 w-[1px] bg-white/20" />

      <div className="font-mono text-violet-300 uppercase">
        State: <span className="font-bold text-white">{dockState}</span>
      </div>

      <div className="h-3 w-[1px] bg-white/20" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => onSetState('hidden')}
          className={`px-1.5 py-0.5 rounded border transition-colors ${
            dockState === 'hidden'
              ? 'bg-violet-600 border-violet-400 text-white'
              : 'border-white/10 hover:bg-white/10'
          }`}
        >
          Hide
        </button>
        <button
          onClick={() => onSetState('preview')}
          className={`px-1.5 py-0.5 rounded border transition-colors ${
            dockState === 'preview'
              ? 'bg-violet-600 border-violet-400 text-white'
              : 'border-white/10 hover:bg-white/10'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => onSetState('open')}
          className={`px-1.5 py-0.5 rounded border transition-colors ${
            dockState === 'open'
              ? 'bg-violet-600 border-violet-400 text-white'
              : 'border-white/10 hover:bg-white/10'
          }`}
        >
          Open
        </button>
      </div>

      <span className="text-[9px] text-white/40">
        {isTauri ? 'Native Windows Core' : 'Vite Dev Mock'}
      </span>
    </div>
  );
};
