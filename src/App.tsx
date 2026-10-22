import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTauriDock } from './hooks/useTauriDock';
import { TopNotchPill } from './components/TopNotchPill';
import { CommandBar } from './components/CommandBar';
import { NavigationRail } from './components/NavigationRail';
import { DashboardTab } from './components/tabs/DashboardTab';
import { MediaTab } from './components/tabs/MediaTab';
import { ShelfTab, type ShelfItem } from './components/tabs/ShelfTab';
import { PerformanceTab } from './components/tabs/PerformanceTab';
import { WeatherTab } from './components/tabs/WeatherTab';
import { FocusTasksTab } from './components/tabs/FocusTasksTab';
import { ClipboardTab } from './components/tabs/ClipboardTab';
import { EcoInvoiceTab } from './components/tabs/EcoInvoiceTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { DevOverlay } from './components/DevOverlay';
import { X, Sparkles } from 'lucide-react';
import type { TabType } from './types';

export function App() {
  const {
    dockState,
    changeDockState,
    toggleDock,
    setInteracting,
    metrics,
    clipboard,
    processAiCommand,
    settings,
    setSettings,
    toggleAutostart,
    fps,
    isTauri,
  } = useTauriDock();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(true);
  const [shelfFiles, setShelfFiles] = useState<ShelfItem[]>([
    { id: '1', name: 'Q4_Strategy_Brief.pdf', size: '2.4 MB', type: 'application/pdf' },
    { id: '2', name: 'Competitor_Pricing_Matrix.xlsx', size: '840 KB', type: 'application/excel' },
  ]);

  // Global keyboard shortcuts: Esc to close, Ctrl+Space to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        changeDockState('hidden');
      }
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        toggleDock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDockState, toggleDock]);

  const isOpen = dockState === 'open' || dockState === 'opening';
  const isPreview = dockState === 'preview';
  const isHidden = dockState === 'hidden';

  const handleClipboardAction = async (action: string, text: string) => {
    await processAiCommand(`${action}: ${text.slice(0, 80)}`, text);
  };

  const handleAddFiles = (files: FileList) => {
    const newItems: ShelfItem[] = Array.from(files).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.type || 'file',
    }));
    setShelfFiles((prev) => [...prev, ...newItems]);
    setActiveTab('shelf');
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center pt-0 select-none relative"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
    >
      {/* 1. V-Notch Top Center Dynamic Island Pill */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <div className="z-40">
            <TopNotchPill
              dockState={dockState}
              metrics={metrics}
              onExpand={() => changeDockState('open')}
              onMouseEnter={() => {
                if (isHidden) changeDockState('preview');
              }}
              onMouseLeave={() => {
                if (isPreview) changeDockState('hidden');
              }}
              isMediaPlaying={isMediaPlaying}
              onTogglePlay={() => setIsMediaPlaying(!isMediaPlaying)}
              shelfFileCount={shelfFiles.length}
              onFilesDropped={handleAddFiles}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 2. Unfolded V-Notch Drawer with Concave Ears */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50 flex flex-col items-center">
            {/* Left Concave Ear (Seamless bezel connection) */}
            <div
              aria-hidden
              className="absolute top-0 pointer-events-none"
              style={{
                left: -14 + 0.5,
                width: 14,
                height: 14,
                background:
                  'radial-gradient(circle farthest-side at 0% 100%, transparent calc(100% - 0.75px), #000000 100%)',
              }}
            />

            {/* Right Concave Ear */}
            <div
              aria-hidden
              className="absolute top-0 pointer-events-none"
              style={{
                right: -14 + 0.5,
                width: 14,
                height: 14,
                background:
                  'radial-gradient(circle farthest-side at 100% 100%, transparent calc(100% - 0.75px), #000000 100%)',
              }}
            />

            <motion.div
              layoutId="orbidock-surface"
              initial={
                settings.reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scaleY: 0.88, y: -10 }
              }
              animate={{
                opacity: 1,
                scaleY: 1,
                y: 0,
              }}
              exit={
                settings.reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scaleY: 0.9, y: -10 }
              }
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 32,
              }}
              className={`w-[1040px] max-w-[96vw] max-h-[92vh] v-notch-glass rounded-b-[28px] p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden ${
                settings.reducedTransparency ? 'bg-[#000000]' : ''
              }`}
            >
              {/* V-Notch Optical Highlight Line */}
              <div className="absolute top-0 inset-x-8 h-[1px] optical-rim pointer-events-none" />

              {/* Top Bar: Brand, Command Bar, and Close Button */}
              <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 border border-white/20 flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
                      ORBIDOCK
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-normal">
                        V-Notch Core
                      </span>
                    </h2>
                  </div>
                </div>

                {/* Central Command Bar */}
                <div className="flex-1 max-w-xl">
                  <CommandBar
                    onExecute={(cmd) => processAiCommand(cmd, clipboard.content)}
                    onClose={() => changeDockState('hidden')}
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => changeDockState('hidden')}
                  className="p-2 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-colors flex-shrink-0"
                  title="Collapse (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content Area: Left Navigation Rail + Right Content Panes */}
              <div className="flex items-start gap-4 flex-1 overflow-hidden min-h-[480px]">
                <NavigationRail activeTab={activeTab} onSelectTab={setActiveTab} />

                <div className="flex-1 h-full overflow-y-auto pr-1">
                  {activeTab === 'dashboard' && (
                    <DashboardTab
                      metrics={metrics}
                      clipboard={clipboard}
                      onClipboardAction={handleClipboardAction}
                      onOpenEcoInvoice={() => setActiveTab('ecoinvoice')}
                    />
                  )}
                  {activeTab === 'media' && <MediaTab />}
                  {activeTab === 'shelf' && (
                    <ShelfTab
                      items={shelfFiles}
                      onRemoveItem={(id) =>
                        setShelfFiles((prev) => prev.filter((item) => item.id !== id))
                      }
                      onClearAll={() => setShelfFiles([])}
                      onAddFiles={handleAddFiles}
                    />
                  )}
                  {activeTab === 'performance' && (
                    <PerformanceTab metrics={metrics} />
                  )}
                  {activeTab === 'weather' && <WeatherTab />}
                  {activeTab === 'calendar' && (
                    <FocusTasksTab />
                  )}
                  {activeTab === 'clipboard' && (
                    <ClipboardTab
                      currentClipboard={clipboard}
                      onAction={handleClipboardAction}
                    />
                  )}
                  {activeTab === 'ecoinvoice' && (
                    <EcoInvoiceTab metrics={metrics} />
                  )}
                  {activeTab === 'settings' && (
                    <SettingsTab
                      settings={settings}
                      onUpdateSettings={(newVals) =>
                        setSettings((prev) => ({ ...prev, ...newVals }))
                      }
                      onToggleAutostart={toggleAutostart}
                      isTauri={isTauri}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Developer HUD: Frame-rate and state machine debug overlay */}
      {(settings.showDevOverlay || !isTauri) && (
        <DevOverlay
          fps={fps}
          dockState={dockState}
          onSetState={changeDockState}
          isTauri={isTauri}
        />
      )}
    </div>
  );
}

export default App;
