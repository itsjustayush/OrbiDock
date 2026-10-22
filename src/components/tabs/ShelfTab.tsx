import React, { useState, useRef } from 'react';
import { UploadCloud, File, FileText, Image, Trash2, Plus, Copy, Check } from 'lucide-react';

export interface ShelfItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface ShelfTabProps {
  items: ShelfItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onAddFiles?: (files: FileList) => void;
}

export const ShelfTab: React.FC<ShelfTabProps> = ({
  items,
  onRemoveItem,
  onClearAll,
  onAddFiles,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-4 h-4 text-cyan-400" />;
    if (type.includes('pdf') || type.includes('text'))
      return <FileText className="w-4 h-4 text-amber-400" />;
    return <File className="w-4 h-4 text-violet-400" />;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles?.(e.dataTransfer.files);
    }
  };

  const handleCopyName = (item: ShelfItem) => {
    navigator.clipboard.writeText(item.name);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-3 w-full text-white">
      {/* Hidden file input for file picker button */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAddFiles?.(e.target.files);
          }
        }}
      />

      {/* Header */}
      <div className="glass-card rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Notch File Shelf</h3>
            <p className="text-[10px] text-white/50">
              Drag files here or onto the Top Notch to stage them temporarily
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" /> Add Files
          </button>
          {items.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-2 py-1 bg-white/[0.05] hover:bg-rose-500/20 text-white/60 hover:text-rose-300 rounded-lg text-[10px] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Drop Target Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
          isDragOver
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-white/10 hover:border-white/20 bg-black/30'
        }`}
      >
        <UploadCloud className={`w-6 h-6 ${isDragOver ? 'text-violet-400 animate-bounce' : 'text-white/30'}`} />
        <span className="text-xs font-medium text-white/70">
          {isDragOver ? 'Release to stash in Shelf' : 'Drag & drop files or click to browse'}
        </span>
      </div>

      {/* Stashed Items List */}
      <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="text-center py-4 text-xs text-white/30 italic">
            No files staged on shelf yet.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-xl px-3 py-2 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {formatIcon(item.type)}
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-white truncate max-w-[280px]">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-mono text-white/40">{item.size}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyName(item)}
                  title="Copy file name"
                  className="p-1 hover:bg-white/10 text-white/40 hover:text-white rounded-lg transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove from shelf"
                  className="p-1 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
