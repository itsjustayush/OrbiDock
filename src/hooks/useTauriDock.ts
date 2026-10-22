import { useState, useEffect, useCallback } from 'react';
import type { DockState, SystemMetrics, ClipboardData, AppSettings } from '../types';

// Check if running inside Tauri
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const defaultMetrics: SystemMetrics = {
  cpu_usage: 14.2,
  memory_used_gb: 8.4,
  memory_total_gb: 16.0,
  memory_percent: 52.5,
  battery_percent: 88,
  is_charging: false,
  is_ac_online: true,
  uptime_secs: 18450,
};

const defaultClipboard: ClipboardData = {
  content: 'https://github.com/itsjustayush/OrbiDock - Next-gen Dynamic Notch for Windows',
  content_type: 'url',
  length: 74,
  timestamp: Date.now(),
};

export function useTauriDock() {
  const [dockState, setDockStateInternal] = useState<DockState>('open'); // default open in browser for easy preview
  const [metrics, setMetrics] = useState<SystemMetrics>(defaultMetrics);
  const [clipboard, setClipboard] = useState<ClipboardData>(defaultClipboard);
  const [settings, setSettings] = useState<AppSettings>({
    dwellMs: 120,
    closeDelayMs: 400,
    autostart: true,
    reducedMotion: false,
    reducedTransparency: false,
    showDevOverlay: false,
  });
  const [fps, setFps] = useState(60);

  // FPS calculation for dev overlay
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Listen to Tauri events if in Tauri environment
  useEffect(() => {
    if (!isTauri) {
      // In browser simulation, simulate periodic metric updates
      const timer = setInterval(() => {
        setMetrics((prev) => ({
          ...prev,
          cpu_usage: Number((12 + Math.random() * 8).toFixed(1)),
          memory_percent: Number((50 + Math.random() * 4).toFixed(1)),
        }));
      }, 3000);
      return () => clearInterval(timer);
    }

    let unlistenState: (() => void) | undefined;
    let unlistenMetrics: (() => void) | undefined;

    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<DockState>('dock:state-changed', (event) => {
        setDockStateInternal(event.payload);
      }).then((unlisten) => {
        unlistenState = unlisten;
      });

      listen<SystemMetrics>('dock:metrics-updated', (event) => {
        setMetrics(event.payload);
      }).then((unlisten) => {
        unlistenMetrics = unlisten;
      });
    });

    return () => {
      if (unlistenState) unlistenState();
      if (unlistenMetrics) unlistenMetrics();
    };
  }, []);

  const changeDockState = useCallback(async (newState: DockState) => {
    setDockStateInternal(newState);
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('set_dock_state', { newState });
      } catch (err) {
        console.error('Failed to set dock state via Tauri:', err);
      }
    }
  }, []);

  const toggleDock = useCallback(async () => {
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const next = await invoke<DockState>('toggle_dock');
        setDockStateInternal(next);
      } catch (err) {
        console.error('Failed to toggle dock:', err);
      }
    } else {
      setDockStateInternal((prev) => (prev === 'open' ? 'hidden' : 'open'));
    }
  }, []);

  const setInteracting = useCallback(async (interacting: boolean) => {
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('set_user_interacting', { interacting });
      } catch (err) {
        console.error('Failed to set interacting flag:', err);
      }
    }
  }, []);

  const fetchClipboard = useCallback(async () => {
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const data = await invoke<ClipboardData>('get_clipboard_data');
        setClipboard(data);
        return data;
      } catch (err) {
        console.error('Failed to get clipboard from Tauri:', err);
      }
    }
    return defaultClipboard;
  }, []);

  const processAiCommand = useCallback(async (command: string, context?: string) => {
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        return await invoke<{ action: string; title: string; text: string; suggestion?: string }>('process_ai_command', {
          command,
          context,
        });
      } catch (err) {
        console.error('Failed to process AI command:', err);
      }
    }
    // Browser mock response
    return {
      action: 'smart_result',
      title: `Processed: ${command}`,
      text: context ? `Analyzed context (${context.length} chars): Successfully transformed and formatted.` : `Command "${command}" completed with status: Optimal.`,
      suggestion: 'Copy output to clipboard',
    };
  }, []);

  const toggleAutostart = useCallback(async (enable: boolean) => {
    setSettings((prev) => ({ ...prev, autostart: enable }));
    if (isTauri) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const result = await invoke<boolean>('set_autostart_enabled', { enable });
        setSettings((prev) => ({ ...prev, autostart: result }));
      } catch (err) {
        console.error('Failed to toggle autostart in Tauri:', err);
      }
    }
  }, []);

  return {
    dockState,
    changeDockState,
    toggleDock,
    setInteracting,
    metrics,
    clipboard,
    fetchClipboard,
    processAiCommand,
    settings,
    setSettings,
    toggleAutostart,
    fps,
    isTauri,
  };
}
