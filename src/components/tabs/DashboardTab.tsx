import React from 'react';
import { MediaCard } from '../cards/MediaCard';
import { PerformanceCard } from '../cards/PerformanceCard';
import { WeatherCard } from '../cards/WeatherCard';
import { CalendarTimerCard } from '../cards/CalendarTimerCard';
import { ClipboardCard } from '../cards/ClipboardCard';
import { QuickAlertsCard } from '../cards/QuickAlertsCard';
import type { SystemMetrics, ClipboardData } from '../../types';

interface DashboardTabProps {
  metrics: SystemMetrics;
  clipboard: ClipboardData;
  onClipboardAction: (action: string, text: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  clipboard,
  onClipboardAction,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3.5 w-full">
      {/* Row 1: Media Player & Hardware Performance */}
      <MediaCard />
      <PerformanceCard metrics={metrics} />

      {/* Row 2: Weather & Focus Pomodoro Timer */}
      <WeatherCard />
      <CalendarTimerCard />

      {/* Row 3: Clipboard Assistant & Dynamic Alerts */}
      <ClipboardCard clipboard={clipboard} onAction={onClipboardAction} />
      <QuickAlertsCard />
    </div>
  );
};
