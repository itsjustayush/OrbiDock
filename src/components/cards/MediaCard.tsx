import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
} from 'lucide-react';
import type { MediaTrack } from '../../types';

interface MediaCardProps {
  track?: MediaTrack;
}

export const MediaCard: React.FC<MediaCardProps> = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38);

  const title = track?.title || 'Starboy';
  const artist = track?.artist || 'The Weeknd, Daft Punk';

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Background ambient album glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Track Info & Artwork */}
      <div className="flex items-center gap-3.5 z-10">
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-900 to-indigo-600 border border-white/10 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
          <Music2 className="w-5 h-5 text-white/90" />
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 bg-black/80 px-1 py-0.5 rounded-full border border-white/10">
              <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce delay-75" />
              <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-[13px] font-semibold text-white truncate tracking-tight">
            {title}
          </h4>
          <p className="text-[11px] text-white/50 truncate font-medium">
            {artist}
          </p>
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="mt-3.5 z-10 flex flex-col gap-1">
        <div
          className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(Math.round(pos));
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full relative"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
          <span>1:18</span>
          <span>3:50</span>
        </div>
      </div>

      {/* Playback Controls & Volume */}
      <div className="mt-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setProgress(0)}
            className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            title="Previous"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white text-black hover:bg-white/90 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={() => setProgress(0)}
            className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            title="Next"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 text-white/50 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-violet-400"
          />
        </div>
      </div>
    </div>
  );
};
