import { useState, useEffect, useRef } from 'react';
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
import type { TabType, CalloutNotification } from './types';

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
  const [currentSong, setCurrentSong] = useState<string>('Midnight City - M83');
  const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(true);
  const [notificationCallout, setNotificationCallout] = useState<CalloutNotification | null>(null);
  const calloutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [shelfFiles, setShelfFiles] = useState<ShelfItem[]>([
    { id: '1', name: 'Q4_Strategy_Brief.pdf', size: '2.4 MB', type: 'application/pdf' },
    { id: '2', name: 'Pricing_Matrix.xlsx', size: '840 KB', type: 'application/excel' },
  ]);

  // Trigger iOS-style Dynamic Island dropdown notification banner
  const triggerCallout = (icon: string, title: string, subtitle: string) => {
    if (calloutTimeoutRef.current) clearTimeout(calloutTimeoutRef.current);
    setNotificationCallout({
      id: `${Date.now()}`,
      icon,
      title,
      subtitle,
      timestamp: Date.now(),
    });

    calloutTimeoutRef.current = setTimeout(() => {
      setNotificationCallout(null);
    }, 3500);
  };

  // Watch for clipboard changes and trigger iOS callout
  const lastClipboardContentRef = useRef<string>(clipboard.content);
  useEffect(() => {
    if (clipboard.content && clipboard.content !== lastClipboardContentRef.current) {
      lastClipboardContentRef.current = clipboard.content;
      triggerCallout('📋', 'Text Captured to Notch', clipboard.content.slice(0, 42));
    }
  }, [clipboard.content]);

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
    triggerCallout('📁', 'Files Stashed on Shelf', `${newItems.length} file(s) ready in notch`);
    setActiveTab('shelf');
  };

  const handleTogglePlay = () => {
    const next = !isMediaPlaying;
    setIsMediaPlaying(next);
    triggerCallout('🎵', next ? 'Now Playing' : 'Playback Paused', currentSong);
  };

  const handleTrackChange = (newSong: string) => {
    setCurrentSong(newSong);
    triggerCallout('🎵', 'Track Changed', newSong);
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center pt-0 select-none relative"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
    >
      {/* 1. Dynamic Island Pill / iOS Callout Notification */}
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
              currentSong={currentSong}
              isMediaPlaying={isMediaPlaying}
              onTogglePlay={handleTogglePlay}
              shelfFileCount={shelfFiles.length}
              onFilesDropped={handleAddFiles}
              notificationCallout={notificationCallout}
              pillBehavior={settings.pillBehavior}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 2. Unfolded Compact V-Notch Drawer (Reduced by 75% for space optimization) */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50 flex flex-col items-center">
            {/* Left Concave Ear (Seamless physical bezel blending) */}
            <div
              aria-hidden
              className="absolute top-0 pointer-events-none"
              style={{
                left: -10 + 0.5,
                width: 10,
                height: 10,
                background:
                  'radial-gradient(circle farthest-side at 0% 100%, transparent calc(100% - 0.75px), #000000 100%)',
              }}
            />

            {/* Right Concave Ear */}
            <div
              aria-hidden
              className="absolute top-0 pointer-events-none"
              style={{
                right: -10 + 0.5,
                width: 10,
                height: 10,
                background:
                  'radial-gradient(circle farthest-side at 100% 100%, transparent calc(100% - 0.75px), #000000 100%)',
              }}
            />

            <motion.div
              layoutId="orbidock-surface"
              initial={
                settings.reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scaleY: 0.9, y: -8 }
              }
              animate={{
                opacity: 1,
                scaleY: 1,
                y: 0,
              }}
              exit={
                settings.reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scaleY: 0.92, y: -8 }
              }
              transition={{
                type: 'spring',
                stiffness: 460,
                damping: 34,
              }}
              className={`w-[620px] max-w-[95vw] h-[390px] v-notch-glass rounded-b-[24px] p-3 shadow-2xl flex flex-col gap-2.5 relative overflow-hidden ${
                settings.reducedTransparency ? 'bg-[#000000]' : ''
              }`}
            >
              {/* V-Notch Optical Highlight Line */}
              <div className="absolute top-0 inset-x-6 h-[1px] optical-rim pointer-events-none" />

              {/* Compact Top Bar: Brand, Command Bar, and Close Button */}
              <div className="flex items-center justify-between gap-2.5 pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 border border-white/20 flex items-center justify-center shadow-md">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white tracking-tight flex items-center gap-1 font-sans">
                      ORBIDOCK
                    </h2>
                  </div>
                </div>

                {/* Central Command Bar */}
                <div className="flex-1 max-w-sm">
                  <CommandBar
                    onExecute={(cmd) => processAiCommand(cmd, clipboard.content)}
                    onClose={() => changeDockState('hidden')}
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => changeDockState('hidden')}
                  className="p-1 hover:bg-white/10 text-white/40 hover:text-white rounded-lg transition-colors flex-shrink-0"
                  title="Collapse (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Content Area: Slim Left Icon Rail + Right Content Panes */}
              <div className="flex items-start gap-2.5 flex-1 overflow-hidden h-[330px]">
                <NavigationRail activeTab={activeTab} onSelectTab={setActiveTab} />

                <div className="flex-1 h-full overflow-y-auto pr-1">
                  {activeTab === 'dashboard' && (
                    <DashboardTab
                      metrics={metrics}
                      clipboard={clipboard}
                      onClipboardAction={handleClipboardAction}
                      onOpenEcoInvoice={() => setActiveTab('ecoinvoice')}
                      currentSong={currentSong}
                      isMediaPlaying={isMediaPlaying}
                      onTogglePlay={handleTogglePlay}
                    />
                  )}
                  {activeTab === 'media' && (
                    <MediaTab
                      currentSong={currentSong}
                      isMediaPlaying={isMediaPlaying}
                      onTogglePlay={handleTogglePlay}
                      onTrackChange={handleTrackChange}
                    />
                  )}
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

      {/* Dev Mode FPS & State Transition Overlay */}
      {settings.showDevOverlay && (
        <DevOverlay
          fps={fps}
          dockState={dockState}
          isTauri={isTauri}
          onSetState={changeDockState}
        />
      )}
    </div>
  );
}

export default App;
