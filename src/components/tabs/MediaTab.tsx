import React, { useState } from 'react';
import {
  Music2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  ListMusic,
  Heart,
} from 'lucide-react';

export const MediaTab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const playlist = [
    { id: 1, title: 'Starboy', artist: 'The Weeknd, Daft Punk', duration: '3:50', active: true },
    { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', active: false },
    { id: 3, title: 'Midnight City', artist: 'M83', duration: '4:03', active: false },
    { id: 4, title: 'Resonance', artist: 'HOME', duration: '3:32', active: false },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Featured Big Player Banner */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-4 z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 border border-white/20 flex items-center justify-center shadow-xl relative group">
            <Music2 className="w-10 h-10 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-semibold tracking-wide uppercase">
                Now Playing
              </span>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="text-white/40 hover:text-rose-400 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              Starboy
            </h3>
            <p className="text-xs text-white/60">The Weeknd, Daft Punk · Starboy (Deluxe)</p>
          </div>
        </div>

        {/* Big Playback controls */}
        <div className="flex items-center gap-3 z-10">
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-white text-black hover:bg-white/90 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Playlist Queue */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
          <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
            <ListMusic className="w-4 h-4 text-violet-400" /> Up Next in Queue
          </span>
          <span className="text-[10px] text-white/40">4 tracks</span>
        </div>

        <div className="flex flex-col gap-1">
          {playlist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                item.active
                  ? 'bg-violet-600/20 border border-violet-500/30 text-white font-medium'
                  : 'hover:bg-white/[0.04] text-white/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-4 text-center text-[10px] text-white/40">
                  {item.id}
                </span>
                <div>
                  <div className="text-[12px]">{item.title}</div>
                  <div className="text-[10px] text-white/40">{item.artist}</div>
                </div>
              </div>
              <span className="text-[10px] text-white/40 font-mono">
                {item.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
