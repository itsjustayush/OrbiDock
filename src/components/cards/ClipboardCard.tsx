import React, { useState } from 'react';
import {
  Clipboard,
  Sparkles,
  Copy,
  Check,
  Code2,
  Globe,
  FileText,
  Braces,
} from 'lucide-react';
import type { ClipboardData } from '../../types';

interface ClipboardCardProps {
  clipboard: ClipboardData;
  onAction: (action: string, text: string) => void;
}

export const ClipboardCard: React.FC<ClipboardCardProps> = ({
  clipboard,
  onAction,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(clipboard.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (clipboard.content_type) {
      case 'url':
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'code':
        return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'json':
        return <Braces className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-violet-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Clipboard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-white">Clipboard Assistant</h4>
            <span className="text-[10px] text-white/40">
              {clipboard.length} characters captured
            </span>
          </div>
        </div>

        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono uppercase text-white/70">
          {getIcon()}
          <span>{clipboard.content_type}</span>
        </span>
      </div>

      {/* Snippet preview */}
      <div className="my-2.5 p-2 bg-black/40 border border-white/5 rounded-xl text-[11px] font-mono text-white/80 max-h-16 overflow-hidden text-ellipsis whitespace-pre-wrap select-text">
        {clipboard.content || 'Clipboard is empty. Copy any text to trigger actions.'}
      </div>

      {/* 1-Click Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAction('summarize', clipboard.content)}
            className="px-2 py-1 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-200 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all"
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            Summarize
          </button>
          <button
            onClick={() => onAction('rewrite', clipboard.content)}
            className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white rounded-lg text-[10px] font-medium transition-colors"
          >
            Polish Tone
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px]"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
