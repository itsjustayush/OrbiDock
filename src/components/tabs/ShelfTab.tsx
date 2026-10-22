import React, { useState } from 'react';
import { UploadCloud, File, FileText, Image, Trash2, ExternalLink } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Notch File Shelf</h3>
            <p className="text-[11px] text-white/50">
              Drop temporary files here, then drag them into any application
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-2.5 py-1 bg-white/[0.05] hover:bg-rose-500/20 text-white/70 hover:text-rose-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Drop Zone Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
          isDragOver
            ? 'border-violet-400 bg-violet-500/15'
            : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
      >
        <UploadCloud className={`w-8 h-8 ${isDragOver ? 'text-violet-300 animate-bounce' : 'text-white/40'}`} />
        <span className="text-xs font-medium text-white/80">
          Drop files to stage them in Orbidock
        </span>
        <span className="text-[10px] text-white/40">
          Ready to drag out anywhere across Windows
        </span>
      </div>

      {/* Staged Items List */}
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-white/40">
            No files staged in the shelf. Drag any file into the notch!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              draggable
              className="glass-card rounded-xl p-3 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-violet-500/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                  {formatIcon(item.type)}
                </div>
                <div>
                  <h5 className="text-xs font-medium text-white truncate max-w-xs">
                    {item.name}
                  </h5>
                  <span className="text-[10px] text-white/40 font-mono">
                    {item.size}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert(`Opening ${item.name} in Windows Explorer...`)}
                  className="p-1.5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-colors"
                  title="Open file"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 hover:bg-white/10 text-white/50 hover:text-rose-400 rounded-lg transition-colors"
                  title="Remove from shelf"
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
