import React, { useState, useEffect } from 'react';
import {
  Music2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Sliders,
  Mic2,
} from 'lucide-react';

interface MediaTabProps {
  currentSong: string;
  isMediaPlaying: boolean;
  onTogglePlay: () => void;
  onTrackChange?: (song: string) => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({
  currentSong,
  isMediaPlaying,
  onTogglePlay,
  onTrackChange,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(78);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'player' | 'lyrics' | 'mixer'>('player');
  const [progressSecs, setProgressSecs] = useState(48);

  const playlist = [
    { id: 1, title: 'Midnight City', artist: 'M83 · Hurry Up, We’re Dreaming', durationSecs: 243 },
    { id: 2, title: 'Starboy', artist: 'The Weeknd, Daft Punk · Starboy', durationSecs: 230 },
    { id: 3, title: 'After Dark', artist: 'Mr.Kitty · Time', durationSecs: 259 },
    { id: 4, title: 'Resonance', artist: 'HOME · Odyssey', durationSecs: 212 },
  ];

  const currentTrackIndex = playlist.findIndex((t) => currentSong.includes(t.title));
  const activeTrack = playlist[currentTrackIndex >= 0 ? currentTrackIndex : 0];

  const lyrics = [
    { timeSec: 12, text: "Waiting in a car, waiting for a ride in the dark" },
    { timeSec: 24, text: "The night city grows, look and see her eyes, they glow" },
    { timeSec: 38, text: "Waiting in a car, waiting for a ride in the dark" },
    { timeSec: 52, text: "The night city grows, look and see her eyes, they glow" },
    { timeSec: 72, text: "The city is my church, it wraps me in the blinding twilight" },
    { timeSec: 94, text: "Waiting in a car, waiting for the right moment" },
  ];

  // Active lyric line calculation based on real seconds
  const currentLineIndex = lyrics.reduce((acc, line, idx) => {
    return progressSecs >= line.timeSec ? idx : acc;
  }, 0);

  // Advance seconds if playing
  useEffect(() => {
    if (!isMediaPlaying) return;
    const timer = setInterval(() => {
      setProgressSecs((prev) => (prev >= activeTrack.durationSecs ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isMediaPlaying, activeTrack.durationSecs]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    onTrackChange?.(`${playlist[nextIdx].title} - ${playlist[nextIdx].artist.split('·')[0].trim()}`);
    setProgressSecs(0);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    onTrackChange?.(`${playlist[prevIdx].title} - ${playlist[prevIdx].artist.split('·')[0].trim()}`);
    setProgressSecs(0);
  };

  return (
    <div className="flex flex-col gap-3 w-full text-white">
      {/* Subtab toggle: Player, Synced Lyrics, Audio Mixer */}
      <div className="flex items-center gap-1 p-0.5 bg-black/40 border border-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('player')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'player'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Music2 className="w-3 h-3" /> Player
        </button>
        <button
          onClick={() => setActiveSubTab('lyrics')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'lyrics'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Mic2 className="w-3 h-3" /> Synced Lyrics
        </button>
        <button
          onClick={() => setActiveSubTab('mixer')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'mixer'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Sliders className="w-3 h-3" /> Audio Mixer
        </button>
      </div>

      {/* 1. Main Player View */}
      {activeSubTab === 'player' && (
        <div className="glass-card rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 border border-white/10 flex items-center justify-center shadow-lg relative flex-shrink-0">
                <Music2 className="w-7 h-7 text-white" />
                {isMediaPlaying && (
                  <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 bg-black/90 px-1 py-0.5 rounded-full border border-white/10">
                    <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce delay-75" />
                    <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 text-[9px] font-semibold tracking-wide uppercase">
                    Now Playing
                  </span>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-white/30 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight truncate">
                  {activeTrack.title}
                </h3>
                <p className="text-[11px] text-white/50 truncate font-medium">
                  {activeTrack.artist}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 text-white/60 hover:text-white transition-colors"
                title="Previous track"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={onTogglePlay}
                className="p-2 bg-white text-black hover:bg-white/90 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95"
                title={isMediaPlaying ? 'Pause' : 'Play'}
              >
                {isMediaPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
              <button
                onClick={handleNextTrack}
                className="p-1.5 text-white/60 hover:text-white transition-colors"
                title="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrub Bar */}
          <div className="flex flex-col gap-1">
            <div
              className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgressSecs(Math.round(pos * activeTrack.durationSecs));
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
                style={{ width: `${(progressSecs / activeTrack.durationSecs) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
              <span>{formatTime(progressSecs)}</span>
              <span>{formatTime(activeTrack.durationSecs)}</span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/50">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
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
                className="w-20 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-violet-400"
              />
            </div>
            <span className="text-[10px] text-white/30 font-mono">Windows SMTC Direct</span>
          </div>
        </div>
      )}

      {/* 2. Synced Lyrics View */}
      {activeSubTab === 'lyrics' && (
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-2.5 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1">
              <Mic2 className="w-3 h-3" /> Live Synced Lyrics
            </span>
            <span className="text-[10px] text-white/40 font-mono">{formatTime(progressSecs)}</span>
          </div>
          {lyrics.map((line, idx) => {
            const isCurrent = idx === currentLineIndex;
            return (
              <div
                key={idx}
                className={`py-1 px-2 rounded-lg transition-all text-xs ${
                  isCurrent
                    ? 'text-white font-bold bg-violet-600/30 border border-violet-500/30 scale-[1.01]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span className="text-[9px] font-mono text-white/20 mr-2">{formatTime(line.timeSec)}</span>
                <span>{line.text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Audio Mixer View */}
      {activeSubTab === 'mixer' && (
        <div className="glass-card rounded-2xl p-4 flex flex-col gap-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-1">
            Per-Application Audio Mixer
          </span>
          {[
            { name: 'Google Chrome', icon: '🌐', vol: 80 },
            { name: 'Spotify / Media', icon: '🎵', vol: 95 },
            { name: 'Discord', icon: '💬', vol: 65 },
            { name: 'System Sounds', icon: '🔔', vol: 40 },
          ].map((app) => (
            <div key={app.name} className="flex items-center justify-between py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span>{app.icon}</span>
                <span className="text-white font-medium">{app.name}</span>
              </div>
              <input
                type="range"
                defaultValue={app.vol}
                className="w-24 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-violet-400"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
