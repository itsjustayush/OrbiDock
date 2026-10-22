import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, X, ArrowRight } from 'lucide-react';

interface CommandBarProps {
  onExecute: (command: string) => Promise<{
    action: string;
    title: string;
    text: string;
    suggestion?: string;
  }>;
  onClose: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onExecute,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    action: string;
    title: string;
    text: string;
    suggestion?: string;
  } | null>(null);

  const handleRun = async (textToRun?: string) => {
    const cmd = textToRun || query;
    if (!cmd.trim()) return;
    setIsProcessing(true);
    try {
      const res = await onExecute(cmd);
      setResult(res);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chips = [
    { label: 'Summarize Clipboard', cmd: 'Summarize clipboard' },
    { label: 'Polish Tone', cmd: 'Rewrite this professionally' },
    { label: 'Start 25m Focus', cmd: 'Start 25-minute focus timer' },
    { label: 'Inspect Code', cmd: 'Explain and debug copied code' },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Search / Command input box */}
      <div className="relative flex items-center bg-white/[0.04] border border-white/10 rounded-2xl px-3.5 py-2.5 shadow-inner focus-within:border-violet-500/50 focus-within:bg-white/[0.06] transition-all">
        <Sparkles className="w-4 h-4 text-violet-400 mr-2.5 flex-shrink-0 animate-pulse" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRun();
            if (e.key === 'Escape') onClose();
          }}
          placeholder="Ask AI, search system, or type a command... (e.g. Summarize, Timer)"
          className="w-full bg-transparent text-[13px] text-white placeholder-white/40 focus:outline-none"
        />

        <div className="flex items-center gap-1.5 ml-2">
          {query.trim() && (
            <button
              onClick={() => handleRun()}
              disabled={isProcessing}
              className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all"
            >
              {isProcessing ? 'Thinking...' : <Send className="w-3 h-3" />}
            </button>
          )}
          <span className="text-[10px] text-white/30 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/5">
            ESC
          </span>
        </div>
      </div>

      {/* Quick Action Chips */}
      {!result && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setQuery(chip.cmd);
                handleRun(chip.cmd);
              }}
              className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 rounded-lg text-[11px] text-white/70 hover:text-white whitespace-nowrap transition-all flex items-center gap-1"
            >
              <span>{chip.label}</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-50" />
            </button>
          ))}
        </div>
      )}

      {/* AI Result Card */}
      {result && (
        <div className="bg-gradient-to-br from-violet-950/40 via-purple-900/20 to-black/40 border border-violet-500/30 rounded-xl p-3 shadow-lg relative animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[12px] font-semibold text-white/90">
                {result.title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyResult}
                className="px-2 py-0.5 text-[11px] bg-white/[0.08] hover:bg-white/15 text-white/80 hover:text-white rounded flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => setResult(null)}
                className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-[12px] text-white/80 leading-relaxed font-sans whitespace-pre-line">
            {result.text}
          </p>
        </div>
      )}
    </div>
  );
};
