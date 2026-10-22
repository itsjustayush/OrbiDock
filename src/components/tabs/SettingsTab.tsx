import React from 'react';
import {
  Sliders,
  Power,
  Clock,
  Eye,
  Keyboard,
  Sparkles,
} from 'lucide-react';
import type { AppSettings } from '../../types';

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onToggleAutostart: (enable: boolean) => void;
  isTauri: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onToggleAutostart,
  isTauri,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-violet-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Orbidock Preferences</h3>
            <p className="text-[11px] text-white/50">
              {isTauri ? 'Native Windows Core Active' : 'Browser Simulation Mode'} · Configure notch behavior
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
          v0.1.0 Stable
        </span>
      </div>

      {/* Settings list */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
        {/* Windows Autostart */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 mt-0.5">
              <Power className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Start With Windows</h4>
              <p className="text-[11px] text-white/50">
                Launch Orbidock quietly in the background on PC boot (tauri-plugin-autostart)
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autostart}
              onChange={(e) => onToggleAutostart(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>

        {/* Dwell Duration Slider */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Top-Edge Dwell Delay</h4>
              <p className="text-[11px] text-white/50">
                Time cursor must rest at top edge before opening ({settings.dwellMs} ms)
              </p>
            </div>
          </div>

          <input
            type="range"
            min="60"
            max="300"
            step="20"
            value={settings.dwellMs}
            onChange={(e) => onUpdateSettings({ dwellMs: Number(e.target.value) })}
            className="w-28 accent-violet-500"
          />
        </div>

        {/* Close Delay Slider */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Auto-Collapse Delay</h4>
              <p className="text-[11px] text-white/50">
                Wait duration after cursor leaves dock before closing ({settings.closeDelayMs} ms)
              </p>
            </div>
          </div>

          <input
            type="range"
            min="200"
            max="800"
            step="50"
            value={settings.closeDelayMs}
            onChange={(e) => onUpdateSettings({ closeDelayMs: Number(e.target.value) })}
            className="w-28 accent-violet-500"
          />
        </div>

        {/* Global Shortcut */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Global Shortcut</h4>
              <p className="text-[11px] text-white/50">Hotkey to toggle the notch anytime</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 font-mono text-[11px] text-white">
            Ctrl + Space
          </span>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Reduced Motion</h4>
              <p className="text-[11px] text-white/50">
                Disable spring animations for low-latency instant snaps
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => onUpdateSettings({ reducedMotion: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>

        {/* Dev Performance Overlay */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-pink-600/10 text-pink-400 border border-pink-500/20 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Developer Performance HUD</h4>
              <p className="text-[11px] text-white/50">
                Show live frame rate (FPS) and state machine monitor
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showDevOverlay}
              onChange={(e) => onUpdateSettings({ showDevOverlay: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
