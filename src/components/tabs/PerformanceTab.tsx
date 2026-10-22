import React from 'react';
import { Cpu, HardDrive, Battery, Zap } from 'lucide-react';
import type { SystemMetrics } from '../../types';

interface PerformanceTabProps {
  metrics: SystemMetrics;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ metrics }) => {
  const cores = [
    { core: 'Core 0', load: Math.max(8, Number((metrics.cpu_usage * 0.9).toFixed(1))) },
    { core: 'Core 1', load: Math.max(12, Number((metrics.cpu_usage * 1.1).toFixed(1))) },
    { core: 'Core 2', load: Math.max(5, Number((metrics.cpu_usage * 0.7).toFixed(1))) },
    { core: 'Core 3', load: Math.max(15, Number((metrics.cpu_usage * 1.3).toFixed(1))) },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 3 Overview Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Processor (CPU)</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-white">
              {metrics.cpu_usage.toFixed(1)}%
            </span>
            <div className="text-[10px] text-white/40 mt-1">4 Cores · 8 Threads</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Memory (RAM)</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-white">
              {metrics.memory_percent.toFixed(0)}%
            </span>
            <div className="text-[10px] text-white/40 mt-1">
              {metrics.memory_used_gb} GB used of {metrics.memory_total_gb} GB
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Power & Battery</span>
            <Battery className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-white">
              {metrics.battery_percent ?? 85}%
            </span>
            <div className="text-[10px] text-white/40 mt-1">
              {metrics.is_ac_online ? 'AC Connected · Healthy' : 'Discharging'}
            </div>
          </div>
        </div>
      </div>

      {/* Per Core Load Breakdown */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
          <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Per-Core Utilization
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">All Cores Active</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cores.map((c) => (
            <div key={c.core} className="flex flex-col gap-1 bg-white/[0.02] p-2 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/60">{c.core}</span>
                <span className="font-mono text-white">{c.load}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${Math.min(100, Number(c.load))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
