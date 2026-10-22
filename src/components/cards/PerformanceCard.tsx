import React from 'react';
import { Cpu, HardDrive, Battery, BatteryCharging, Zap } from 'lucide-react';
import type { SystemMetrics } from '../../types';

interface PerformanceCardProps {
  metrics: SystemMetrics;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ metrics }) => {
  const formatUptime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const getCpuColor = (usage: number) => {
    if (usage < 40) return 'from-emerald-500 to-teal-400';
    if (usage < 75) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-white">System Status</h4>
            <span className="text-[10px] text-white/40 font-mono">
              Uptime: {formatUptime(metrics.uptime_secs)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-white/70 font-mono">
          {metrics.is_charging ? (
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
          ) : (
            <Battery className="w-3 h-3 text-white/70" />
          )}
          <span>{metrics.battery_percent ?? 85}%</span>
        </div>
      </div>

      {/* Metrics bars */}
      <div className="flex flex-col gap-3 my-2">
        {/* CPU Usage */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> CPU Load
            </span>
            <span className="font-mono font-medium text-white">
              {metrics.cpu_usage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getCpuColor(
                metrics.cpu_usage
              )} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(5, metrics.cpu_usage))}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-cyan-400" /> Memory (RAM)
            </span>
            <span className="font-mono font-medium text-white">
              {metrics.memory_used_gb} / {metrics.memory_total_gb} GB ({metrics.memory_percent.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.memory_percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer stats pill */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <span>Hardware Arch: x86_64</span>
        <span className="text-emerald-400 font-medium">Optimal 60 FPS</span>
      </div>
    </div>
  );
};
