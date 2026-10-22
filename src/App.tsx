import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTauriDock } from './hooks/useTauriDock';
import { TopNotchPill } from './components/TopNotchPill';
import { CommandBar } from './components/CommandBar';
import { NavigationRail } from './components/NavigationRail';
import { DashboardTab } from './components/tabs/DashboardTab';
import { MediaTab } from './components/tabs/MediaTab';
import { PerformanceTab } from './components/tabs/PerformanceTab';
import { WeatherTab } from './components/tabs/WeatherTab';
import { CalendarTimerCard } from './components/cards/CalendarTimerCard';
import { ClipboardTab } from './components/tabs/ClipboardTab';
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

  // Global keyboard shortcuts: Esc to close, Ctrl+Space in browser preview
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

  return (
    <div
      className="w-full h-full flex flex-col items-center pt-2 select-none relative"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
    >
      {/* 1. Idle Pill State (Shown when hidden or preview) */}
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
            />
          </div>
        )}
      </AnimatePresence>

      {/* 2. Unfolded Control Center Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="orbidock-surface"
            initial={
              settings.reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scaleY: 0.85, y: -20 }
            }
            animate={{
              opacity: 1,
              scaleY: 1,
              y: 0,
            }}
            exit={
              settings.reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scaleY: 0.9, y: -20 }
            }
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 32,
            }}
            className={`w-[1020px] max-w-[96vw] max-h-[90vh] glass-panel rounded-3xl p-5 shadow-2xl z-50 flex flex-col gap-4 border border-white/10 ${
              settings.reducedTransparency ? 'bg-[#0e1016]' : ''
            }`}
          >
            {/* Top Bar: Brand, Command Bar, and Close Button */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 border border-white/20 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    ORBIDOCK
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-normal">
                      Windows Island
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
            <div className="flex items-start gap-4 flex-1 overflow-hidden min-h-[460px]">
              <NavigationRail activeTab={activeTab} onSelectTab={setActiveTab} />

              <div className="flex-1 h-full overflow-y-auto pr-1">
                {activeTab === 'dashboard' && (
                  <DashboardTab
                    metrics={metrics}
                    clipboard={clipboard}
                    onClipboardAction={handleClipboardAction}
                  />
                )}
                {activeTab === 'media' && <MediaTab />}
                {activeTab === 'performance' && (
                  <PerformanceTab metrics={metrics} />
                )}
                {activeTab === 'weather' && <WeatherTab />}
                {activeTab === 'calendar' && (
                  <div className="flex flex-col gap-4">
                    <CalendarTimerCard />
                  </div>
                )}
                {activeTab === 'clipboard' && (
                  <ClipboardTab
                    currentClipboard={clipboard}
                    onAction={handleClipboardAction}
                  />
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
        )}
      </AnimatePresence>

      {/* Developer HUD: Always shown if enabled or in browser simulation */}
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
