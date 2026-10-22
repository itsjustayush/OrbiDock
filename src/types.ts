export type DockState = 'hidden' | 'preview' | 'opening' | 'open' | 'closing';

export type TabType = 
  | 'dashboard' 
  | 'media' 
  | 'performance' 
  | 'weather' 
  | 'calendar' 
  | 'clipboard' 
  | 'settings';

export interface SystemMetrics {
  cpu_usage: number;
  memory_used_gb: number;
  memory_total_gb: number;
  memory_percent: number;
  battery_percent: number | null;
  is_charging: boolean;
  is_ac_online: boolean;
  uptime_secs: number;
}

export interface ClipboardData {
  content: string;
  content_type: 'text' | 'code' | 'url' | 'json';
  length: number;
  timestamp: number;
}

export interface MediaTrack {
  title: string;
  artist: string;
  album: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  hourly: Array<{
    time: string;
    temp: number;
    icon: string;
  }>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  timeUntil: string;
  location?: string;
  attendees?: number;
  type: 'meeting' | 'focus' | 'reminder';
}

export interface AppSettings {
  dwellMs: number;
  closeDelayMs: number;
  autostart: boolean;
  reducedMotion: boolean;
  reducedTransparency: boolean;
  showDevOverlay: boolean;
}
