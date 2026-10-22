import React, { useState, useEffect } from 'react';
import {
  Music2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  ListMusic,
  Heart,
  Sliders,
  Mic2,
} from 'lucide-react';

export const MediaTab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(78);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'player' | 'lyrics' | 'mixer'>('player');
  const [currentLineIndex, setCurrentLineIndex] = useState(1);

  const playlist = [
    { id: 1, title: 'Starboy', artist: 'The Weeknd, Daft Punk', duration: '3:50', active: true },
    { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', active: false },
    { id: 3, title: 'Midnight City', artist: 'M83', duration: '4:03', active: false },
    { id: 4, title: 'Resonance', artist: 'HOME', duration: '3:32', active: false },
  ];

  const lyrics = [
    { time: '0:12', text: "I'm tryna put you in the worst mood, ah" },
    { time: '0:16', text: 'P1 cleaner than your church shoes, ah' },
    { time: '0:20', text: 'Milli point two just to hurt you, ah' },
    { time: '0:24', text: 'All red Lamb’ just to tease you, ah' },
    { time: '0:28', text: "None of these toys on lease too, aah" },
    { time: '0:32', text: 'Look what you’ve done, I’m a starboy' },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % lyrics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, lyrics.length]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Subtab toggle: Player, Synced Lyrics, Audio Mixer */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('player')}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'player'
              ? 'bg-violet-600 text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Music2 className="w-3.5 h-3.5" /> Player
        </button>
        <button
          onClick={() => setActiveSubTab('lyrics')}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'lyrics'
              ? 'bg-violet-600 text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Mic2 className="w-3.5 h-3.5" /> Synced Lyrics
        </button>
        <button
          onClick={() => setActiveSubTab('mixer')}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'mixer'
              ? 'bg-violet-600 text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Audio Mixer
        </button>
      </div>

      {/* 1. Main Player View */}
      {activeSubTab === 'player' && (
        <>
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

          {/* Queue List */}
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
        </>
      )}

      {/* 2. Synced Lyrics View (from V-Notch) */}
      {activeSubTab === 'lyrics' && (
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-3 min-h-[340px] justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-black to-black pointer-events-none" />
          <div className="text-[10px] uppercase font-mono tracking-widest text-violet-400 mb-2 z-10">
            Synced Lyrics · Starboy
          </div>
          {lyrics.map((line, idx) => {
            const isCurrent = idx === currentLineIndex;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 font-sans z-10 ${
                  isCurrent
                    ? 'text-lg md:text-xl font-bold text-white scale-105'
                    : 'text-sm text-white/30 font-medium'
                }`}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Audio Mixer View (from V-Notch) */}
      {activeSubTab === 'mixer' && (
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
          <div className="text-xs font-semibold text-white/80 pb-2 border-b border-white/5">
            Per-Application Audio Mixer & Master Output
          </div>

          {/* Master volume */}
          <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-white/70 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
              </button>
              <div>
                <div className="text-xs font-semibold text-white">Master Volume</div>
                <div className="text-[10px] text-white/40">Realtek High Definition Audio</div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-48">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setIsMuted(false);
                }}
                className="w-full accent-violet-500"
              />
              <span className="font-mono text-xs text-white/70 w-8 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>

          {/* Individual App Sliders */}
          <div className="flex flex-col gap-2">
            {[
              { name: 'Spotify / Media Session', vol: 85, icon: '🎵' },
              { name: 'Google Chrome / OrbiDock Ext', vol: 70, icon: '🌐' },
              { name: 'Discord Voice & Video', vol: 90, icon: '💬' },
            ].map((app, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{app.icon}</span>
                  <span className="text-xs text-white/80">{app.name}</span>
                </div>
                <div className="flex items-center gap-2 w-48">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={app.vol}
                    className="w-full accent-violet-400"
                  />
                  <span className="font-mono text-xs text-white/50 w-8 text-right">
                    {app.vol}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
