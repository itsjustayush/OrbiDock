import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Play,
  Square,
  Droplets,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Terminal,
  Bot
} from 'lucide-react';

interface FocusTasksTabProps {
  onSyncExtension?: (payload: unknown) => void;
}

export const FocusTasksTab: React.FC<FocusTasksTabProps> = () => {
  // --- FOCUS SESSION STATE ---
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [agenda, setAgenda] = useState('OrbiDock Core Engineering & Architecture');
  const [focusDurationMin, setFocusDurationMin] = useState(45);
  const [focusTimeRemainingSec, setFocusTimeRemainingSec] = useState(45 * 60);

  // --- ALLOWED & DISALLOWED URLS ---
  const [allowedUrls, setAllowedUrls] = useState<string[]>([
    'github.com',
    'stackoverflow.com',
    'google.com',
    'docs.rs',
    'localhost:*'
  ]);
  const [disallowedUrls, setDisallowedUrls] = useState<string[]>([
    '*://*.twitter.com/*',
    '*://*.x.com/*',
    '*://*.instagram.com/*',
    '*://*.reddit.com/*',
    '*://*.youtube.com/shorts*',
    '*://*.tiktok.com/*'
  ]);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [urlTypeToAdd, setUrlTypeToAdd] = useState<'allowed' | 'disallowed'>('disallowed');

  // --- DYNAMIC HYDRATION REMINDER STATE ---
  const [smartDynamicMode, setSmartDynamicMode] = useState(true);
  const [baseWaterIntervalMin, setBaseWaterIntervalMin] = useState(30);
  const [stressScore, setStressScore] = useState(0.42); // 42% workload
  const [waterTimeLeftSec, setWaterTimeLeftSec] = useState(18 * 60);

  // --- REALTIME NOTIFICATIONS (WhatsApp, Discord, AI, Antigravity) ---
  const [antigravityRequest, setAntigravityRequest] = useState<{
    id: string;
    command: string;
    status: 'pending' | 'approved' | 'rejected';
  } | null>({
    id: 'req-891',
    command: 'npx tauri build --release (Requires Code Signing & Admin)',
    status: 'pending'
  });

  const [whatsAppSnippet, setWhatsAppSnippet] = useState<{
    sender: string;
    text: string;
    reply: string;
  }>({
    sender: 'Dev Team Lead (WhatsApp)',
    text: 'Is the new Dynamic Island notch build ready for staging?',
    reply: ''
  });

  const [aiStreamingCard] = useState({
    model: 'Gemini 2.5 Flash',
    status: 'Finished Generating',
    preview: 'Calculated 30-day carbon footprint offset: 4.82 kg CO2e saved via dark-mode OLED optimization.'
  });

  // Countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      if (isFocusActive) {
        setFocusTimeRemainingSec((prev) => (prev > 0 ? prev - 1 : 0));
      }
      setWaterTimeLeftSec((prev) => (prev > 0 ? prev - 1 : baseWaterIntervalMin * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFocusActive, baseWaterIntervalMin]);

  // Dynamic interval calculation: Effective = Base * (1 - 0.5 * Stress)
  const effectiveHydrationMin = Math.round(baseWaterIntervalMin * (1.0 - 0.5 * stressScore));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleFocus = () => {
    if (!isFocusActive) {
      setIsFocusActive(true);
      setFocusTimeRemainingSec(focusDurationMin * 60);
    } else {
      setIsFocusActive(false);
    }
  };

  const handleAddUrl = () => {
    if (!newUrlInput.trim()) return;
    if (urlTypeToAdd === 'allowed') {
      setAllowedUrls([...allowedUrls, newUrlInput.trim()]);
    } else {
      setDisallowedUrls([...disallowedUrls, newUrlInput.trim()]);
    }
    setNewUrlInput('');
  };

  const handleRemoveUrl = (type: 'allowed' | 'disallowed', index: number) => {
    if (type === 'allowed') {
      setAllowedUrls(allowedUrls.filter((_, i) => i !== index));
    } else {
      setDisallowedUrls(disallowedUrls.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex flex-col gap-4 text-white">
      {/* Top Banner: Active Focus & Dynamic Hydration Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1: Focus Lock Session */}
        <div className="bg-[#10121a]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Focus Block Engine
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isFocusActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {isFocusActive ? 'LOCKED IN BROWSER' : 'IDLE'}
              </span>
            </div>

            <input
              type="text"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Task Agenda..."
              disabled={isFocusActive}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:border-violet-500 outline-none mb-3"
            />

            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>Duration:</span>
              <div className="flex gap-1">
                {[25, 45, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setFocusDurationMin(d);
                      if (!isFocusActive) setFocusTimeRemainingSec(d * 60);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      focusDurationMin === d
                        ? 'bg-violet-600 text-white font-bold'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>Time Remaining:</span>
              <span className="font-mono text-lg font-bold text-white">
                {formatTime(focusTimeRemainingSec)}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleFocus}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isFocusActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30'
                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/30'
            }`}
          >
            {isFocusActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" /> Stop Focus Session
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Start Lock & Enforce Agenda
              </>
            )}
          </button>
        </div>

        {/* Card 2: Smart Dynamic Water & Stress Reminders */}
        <div className="bg-[#10121a]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" /> Dynamic Hydration
              </span>
              <button
                onClick={() => setSmartDynamicMode(!smartDynamicMode)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                  smartDynamicMode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                {smartDynamicMode ? '⚡ Smart Dynamic ON' : 'Fixed Timer'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 mb-1">
              <span>Workload Stress Factor:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-cyan-300 font-bold">
                  {Math.round(stressScore * 100)}%
                </span>
                <button
                  onClick={() => setStressScore((prev) => (prev >= 0.8 ? 0.2 : prev + 0.2))}
                  className="px-1 text-[9px] bg-white/5 hover:bg-white/10 rounded text-white/60"
                  title="Simulate workload change"
                >
                  ▲
                </button>
              </div>
            </div>

            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(stressScore * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-white/50 mb-3 bg-black/40 p-2 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span>Base:</span>
                <div className="flex gap-1">
                  {[20, 30, 45].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBaseWaterIntervalMin(b)}
                      className={`px-1 rounded text-[10px] font-mono ${
                        baseWaterIntervalMin === b ? 'text-white font-bold underline' : 'text-white/40'
                      }`}
                    >
                      {b}m
                    </button>
                  ))}
                </div>
              </div>
              <div>
                Effective:{' '}
                <span className="text-cyan-300 font-mono font-bold">
                  {effectiveHydrationMin}m
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
            <span className="text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Next Sip In:
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {formatTime(waterTimeLeftSec)}
            </span>
          </div>
        </div>
      </div>

      {/* URL Rules & Agenda Whitelist/Blacklist Editor */}
      <div className="bg-[#10121a]/80 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Browser URL Enforcement (Manifest V3)
            </h3>
          </div>
          <span className="text-[10px] text-white/40 font-mono">
            {disallowedUrls.length} Blocked Rules Active
          </span>
        </div>

        {/* Add URL Form */}
        <div className="flex items-center gap-2 mb-3">
          <select
            value={urlTypeToAdd}
            onChange={(e) => setUrlTypeToAdd(e.target.value as 'allowed' | 'disallowed')}
            className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80 outline-none"
          >
            <option value="disallowed">Block (Disallowed)</option>
            <option value="allowed">Allow (Whitelisted)</option>
          </select>
          <input
            type="text"
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            placeholder="e.g. *://*.twitter.com/* or docs.rs"
            className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-violet-500 outline-none font-mono"
          />
          <button
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Current Rules Pills */}
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {disallowedUrls.map((url, i) => (
            <span
              key={`dis-${i}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/25 rounded-lg text-[11px] font-mono text-rose-300"
            >
              <span>⛔ {url}</span>
              <button
                onClick={() => handleRemoveUrl('disallowed', i)}
                className="hover:text-rose-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
          {allowedUrls.map((url, i) => (
            <span
              key={`allow-${i}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-[11px] font-mono text-emerald-300"
            >
              <span>✅ {url}</span>
              <button
                onClick={() => handleRemoveUrl('allowed', i)}
                className="hover:text-emerald-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Realtime Hub: Antigravity IDE Approval, WhatsApp, and AI Notifications */}
      <div className="grid grid-cols-3 gap-3">
        {/* Antigravity IDE MCP Bridge */}
        <div className="bg-[#10121a]/80 border border-violet-500/30 rounded-2xl p-3 flex flex-col justify-between shadow-lg shadow-violet-950/20">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Antigravity IDE
              </span>
              <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded font-mono">
                MCP Port 49821
              </span>
            </div>
            <p className="text-[11px] font-mono text-white/80 line-clamp-2 mb-2 bg-black/40 p-1.5 rounded border border-white/5">
              {antigravityRequest?.command || 'Standing by for agent requests...'}
            </p>
          </div>

          {antigravityRequest && antigravityRequest.status === 'pending' ? (
            <div className="flex gap-1.5">
              <button
                onClick={() =>
                  setAntigravityRequest({ ...antigravityRequest, status: 'approved' })
                }
                className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-[11px] font-semibold text-white flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Approve
              </button>
              <button
                onClick={() =>
                  setAntigravityRequest({ ...antigravityRequest, status: 'rejected' })
                }
                className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] text-white/50"
              >
                Reject
              </button>
            </div>
          ) : (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Request Approved
            </span>
          )}
        </div>

        {/* WhatsApp & Discord Live Stream */}
        <div className="bg-[#10121a]/80 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> WhatsApp Live
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-white/50 mb-0.5">{whatsAppSnippet.sender}</div>
            <p className="text-[11px] text-white/90 line-clamp-2 mb-2 italic">
              "{whatsAppSnippet.text}"
            </p>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              value={whatsAppSnippet.reply}
              onChange={(e) =>
                setWhatsAppSnippet({ ...whatsAppSnippet, reply: e.target.value })
              }
              placeholder="Quick reply..."
              className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white outline-none"
            />
            <button
              onClick={() => {
                alert(`Quick Reply dispatched to WhatsApp: "${whatsAppSnippet.reply}"`);
                setWhatsAppSnippet({ ...whatsAppSnippet, reply: '' });
              }}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-[10px] font-semibold text-white"
            >
              Send
            </button>
          </div>
        </div>

        {/* AI Platforms Sync (ChatGPT / Gemini / Claude) */}
        <div className="bg-[#10121a]/80 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-3 h-3" /> {aiStreamingCard.model}
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                {aiStreamingCard.status}
              </span>
            </div>
            <p className="text-[11px] text-white/70 line-clamp-3 bg-black/40 p-1.5 rounded border border-white/5 mb-2">
              {aiStreamingCard.preview}
            </p>
          </div>

          <button
            onClick={() => alert('Inserted AI snippet directly into active clipboard!')}
            className="w-full py-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 rounded-lg text-[11px] font-semibold text-amber-200 flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Copy Output to Notch
          </button>
        </div>
      </div>
    </div>
  );
};
