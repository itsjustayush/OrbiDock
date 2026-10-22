import React from 'react';
import { MediaCard } from '../cards/MediaCard';
import { PerformanceCard } from '../cards/PerformanceCard';
import { ClipboardCard } from '../cards/ClipboardCard';
import { CalendarTimerCard } from '../cards/CalendarTimerCard';
import { QuickAlertsCard } from '../cards/QuickAlertsCard';
import type { SystemMetrics, ClipboardData } from '../../types';

interface DashboardTabProps {
  metrics: SystemMetrics;
  clipboard: ClipboardData;
  onClipboardAction: (action: string, text: string) => void;
  onOpenEcoInvoice?: () => void;
  currentSong?: string;
  isMediaPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  clipboard,
  onClipboardAction,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 w-full text-white">
      {/* Row 1: Compact Media Player & System Hardware */}
      <MediaCard />
      <PerformanceCard metrics={metrics} />

      {/* Row 2: Live Clipboard & Focus Timer */}
      <ClipboardCard clipboard={clipboard} onAction={onClipboardAction} />
      <CalendarTimerCard />

      {/* Row 3: Ambient Notification Alert */}
      <div className="col-span-2">
        <QuickAlertsCard />
      </div>
    </div>
  );
};
