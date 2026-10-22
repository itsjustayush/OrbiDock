import React from 'react';
import {
  Sliders,
  Power,
  Clock,
  Keyboard,
  Eye,
  Shield,
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
    <div className="flex flex-col gap-3 w-full text-white">
      {/* Header */}
      <div className="glass-card rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-400" />
          <div>
            <h3 className="text-xs font-semibold text-white">OrbiDock Preferences</h3>
            <p className="text-[10px] text-white/50">
              {isTauri ? 'Native Windows Core (Win32)' : 'Browser Simulation'} · Visual & Ergonomic tuning
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
          v0.1.0 Stable
        </span>
      </div>

      {/* Settings list */}
      <div className="glass-card rounded-2xl p-3 flex flex-col gap-3">
        {/* Pill Display & Chrome Tab Ergonomics */}
        <div className="flex flex-col gap-1.5 pb-2.5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <h4 className="text-xs font-semibold text-white">Pill Display Behavior</h4>
            </div>
            <span className="text-[10px] text-violet-300 font-mono">Chrome Tabs Unblocked</span>
          </div>
          <p className="text-[10.5px] text-white/50">
            Control when the Dynamic Island pill is visible at the top center:
          </p>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[
              { id: 'desktop_only', label: 'Hide in Apps', desc: 'Frees Chrome tabs; drops down for alerts' },
              { id: 'always_visible', label: 'Always Visible', desc: 'Permanent ambient notch' },
              { id: 'hover_only', label: 'Hover Only', desc: 'Hidden until top edge hovered' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() =>
                  onUpdateSettings({ pillBehavior: mode.id as AppSettings['pillBehavior'] })
                }
                className={`p-2 rounded-xl text-left border transition-all ${
                  settings.pillBehavior === mode.id
                    ? 'bg-violet-600/30 border-violet-500/50 text-white shadow-sm'
                    : 'bg-black/30 border-white/5 text-white/50 hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-[11px] font-semibold">{mode.label}</div>
                <div className="text-[9px] text-white/40 leading-tight mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Windows Autostart */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/20 mt-0.5">
              <Power className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Start With Windows</h4>
              <p className="text-[10px] text-white/50">
                Launch OrbiDock quietly in tray on PC boot
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
            <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>

        {/* Dwell Duration Slider */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Top-Edge Dwell Delay</h4>
              <p className="text-[10px] text-white/50">
                Hover threshold before unfolding ({settings.dwellMs} ms)
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
            className="w-24 accent-violet-500"
          />
        </div>

        {/* Global Shortcut */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Global Shortcut</h4>
              <p className="text-[10px] text-white/50">Hotkey to toggle the notch anytime</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 font-mono text-[10px] text-white">
            Ctrl + Space
          </span>
        </div>

        {/* Native Permissions Note */}
        <div className="p-2.5 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-2 text-[10px] text-violet-200">
          <Shield className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Native Windows Control:</strong> OrbiDock interacts directly with Windows SMTC Audio, Clipboard, and System Telemetry at the OS layer. No external browser extension is mandatory.
          </span>
        </div>
      </div>
    </div>
  );
};
