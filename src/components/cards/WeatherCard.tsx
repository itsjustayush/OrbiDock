import React from 'react';
import { CloudSun, Droplets, Wind, Umbrella, MapPin } from 'lucide-react';
import type { WeatherData } from '../../types';

interface WeatherCardProps {
  weather?: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const data: WeatherData = weather || {
    temperature: 28,
    condition: 'Partly Cloudy',
    location: 'Current Location',
    high: 31,
    low: 22,
    humidity: 54,
    windSpeed: 12,
    precipitation: 10,
    hourly: [
      { time: 'Now', temp: 28, icon: 'sun' },
      { time: '18:00', temp: 27, icon: 'cloud' },
      { time: '19:00', temp: 25, icon: 'cloud' },
      { time: '20:00', temp: 23, icon: 'moon' },
    ],
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Background Weather glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Location & Temp */}
      <div className="flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-white/50 mb-0.5">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{data.location}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-white font-sans">
              {data.temperature}°
            </span>
            <span className="text-[12px] font-medium text-white/70">
              {data.condition}
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5 font-mono">
            H: {data.high}° · L: {data.low}°
          </div>
        </div>

        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm">
          <CloudSun className="w-7 h-7" />
        </div>
      </div>

      {/* Atmospheric detail metrics */}
      <div className="grid grid-cols-3 gap-2 my-2.5 z-10">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[9px] text-white/40">
            <Droplets className="w-2.5 h-2.5 text-cyan-400" /> Humidity
          </div>
          <span className="text-[11px] font-mono font-medium text-white mt-0.5">
            {data.humidity}%
          </span>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[9px] text-white/40">
            <Wind className="w-2.5 h-2.5 text-teal-400" /> Wind
          </div>
          <span className="text-[11px] font-mono font-medium text-white mt-0.5">
            {data.windSpeed} km/h
          </span>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[9px] text-white/40">
            <Umbrella className="w-2.5 h-2.5 text-blue-400" /> Rain
          </div>
          <span className="text-[11px] font-mono font-medium text-white mt-0.5">
            {data.precipitation}%
          </span>
        </div>
      </div>

      {/* Hourly mini forecast pills */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between z-10">
        {data.hourly.map((h, i) => (
          <div key={i} className="flex flex-col items-center text-[10px]">
            <span className="text-white/40">{h.time}</span>
            <span className="font-mono font-medium text-white/80 mt-0.5">
              {h.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
