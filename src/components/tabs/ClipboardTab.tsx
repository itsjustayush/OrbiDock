import React, { useState } from 'react';
import {
  Clipboard,
  Copy,
  Check,
  Sparkles,
  Code2,
  Globe,
  FileText,
  Filter,
} from 'lucide-react';
import type { ClipboardData } from '../../types';

interface ClipboardTabProps {
  currentClipboard: ClipboardData;
  onAction: (action: string, text: string) => void;
}

export const ClipboardTab: React.FC<ClipboardTabProps> = ({
  currentClipboard,
  onAction,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const history = [
    {
      id: 1,
      content: currentClipboard.content || 'https://github.com/itsjustayush/OrbiDock',
      type: currentClipboard.content_type || 'url',
      time: 'Just now',
    },
    {
      id: 2,
      content: 'const toggleDock = () => setDockState(prev => prev === "open" ? "hidden" : "open");',
      type: 'code',
      time: '4m ago',
    },
    {
      id: 3,
      content: 'Meeting with growth team rescheduled to Thursday 4:30 PM EST.',
      type: 'text',
      time: '12m ago',
    },
    {
      id: 4,
      content: '{"product": "Orbidock", "version": "0.1.0", "target": "Windows 11"}',
      type: 'json',
      time: '32m ago',
    },
  ];

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clipboard className="w-5 h-5 text-violet-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Clipboard History & AI Tools</h3>
            <p className="text-[11px] text-white/50">Auto-detects code, links, and text formatting</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Filter className="w-3.5 h-3.5" /> Filter
        </div>
      </div>

      {/* History Items */}
      <div className="flex flex-col gap-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-xl p-3 flex flex-col gap-2 hover:border-violet-500/30 transition-all"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] text-white/70 font-mono uppercase text-[9px]">
                {item.type === 'url' ? (
                  <Globe className="w-2.5 h-2.5 text-cyan-400" />
                ) : item.type === 'code' ? (
                  <Code2 className="w-2.5 h-2.5 text-amber-400" />
                ) : (
                  <FileText className="w-2.5 h-2.5 text-violet-400" />
                )}
                <span>{item.type}</span>
              </span>

              <span className="text-white/40 text-[10px]">{item.time}</span>
            </div>

            <div className="p-2 bg-black/40 rounded-lg text-xs font-mono text-white/80 select-text whitespace-pre-wrap break-all">
              {item.content}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAction('summarize', item.content)}
                  className="px-2 py-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 rounded text-[10px] font-medium flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-2.5 h-2.5" /> Summarize
                </button>
                <button
                  onClick={() => onAction('rewrite', item.content)}
                  className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white rounded text-[10px] font-medium transition-colors"
                >
                  Polish
                </button>
              </div>

              <button
                onClick={() => handleCopy(item.id, item.content)}
                className="px-2 py-1 text-white/60 hover:text-white text-[10px] flex items-center gap-1 transition-colors"
              >
                {copiedId === item.id ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
