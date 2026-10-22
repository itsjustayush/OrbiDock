import React from 'react';
import { CloudSun, Sun, Gauge } from 'lucide-react';

export const WeatherTab: React.FC = () => {
  const daily = [
    { day: 'Today', condition: 'Partly Cloudy', high: 31, low: 22 },
    { day: 'Tomorrow', condition: 'Sunny & Clear', high: 33, low: 23 },
    { day: 'Friday', condition: 'Scattered Showers', high: 27, low: 20 },
    { day: 'Saturday', condition: 'Clear Sky', high: 30, low: 21 },
    { day: 'Sunday', condition: 'Sunny', high: 32, low: 22 },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Featured Header */}
      <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/15 border border-amber-500/20 rounded-2xl text-amber-400">
            <CloudSun className="w-12 h-12" />
          </div>
          <div>
            <div className="text-4xl font-bold tracking-tight text-white font-sans">
              28°C
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              Partly Cloudy · High of 31° today
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-right">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2 text-left">
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <Sun className="w-3 h-3 text-amber-400" /> UV Index
            </div>
            <div className="text-xs font-semibold text-white mt-0.5">3 (Moderate)</div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2 text-left">
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <Gauge className="w-3 h-3 text-emerald-400" /> Air Quality
            </div>
            <div className="text-xs font-semibold text-emerald-400 mt-0.5">Good (24 AQI)</div>
          </div>
        </div>
      </div>

      {/* 5-Day Extended Forecast */}
      <div className="glass-card rounded-2xl p-4">
        <div className="text-xs font-semibold text-white/80 pb-2 border-b border-white/5 mb-2">
          5-Day Forecast
        </div>
        <div className="flex flex-col gap-1.5">
          {daily.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-xs font-medium text-white/80 w-24">
                {item.day}
              </span>
              <span className="text-[11px] text-white/50">{item.condition}</span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-white">{item.high}°</span>
                <span className="text-white/40">{item.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
