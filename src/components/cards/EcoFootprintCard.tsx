import React from 'react';
import { Leaf, Zap, Globe, FileSpreadsheet } from 'lucide-react';
import type { SystemMetrics } from '../../types';

interface EcoFootprintCardProps {
  metrics: SystemMetrics;
  onOpenInvoice?: () => void;
}

export const EcoFootprintCard: React.FC<EcoFootprintCardProps> = ({
  metrics,
  onOpenInvoice,
}) => {
  // Estimated PC power consumption based on CPU load and baseline idle (TDP estimation)
  // Baseline idle: ~25W, Max load: ~95W
  const estimatedWatts = Math.round(25 + (metrics.cpu_usage / 100) * 70);
  const uptimeHours = metrics.uptime_secs / 3600;
  const kwhToday = ((estimatedWatts * uptimeHours) / 1000).toFixed(2);
  // Grid carbon intensity average: ~430g CO2e per kWh
  const co2Grams = Math.round(Number(kwhToday) * 430);
  // Est electricity cost ($0.16/kWh) + Carbon offset cost ($15/ton CO2)
  const powerCost = (Number(kwhToday) * 0.16).toFixed(2);

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Background eco leaf glow */}
      <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-white">Eco & Carbon Footprint</h4>
            <span className="text-[10px] text-white/40">Work Energy & Emission Telemetry</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
          {estimatedWatts} W Live
        </span>
      </div>

      {/* Grid: kWh and CO2 */}
      <div className="grid grid-cols-2 gap-2 my-2.5 z-10">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2 flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <Zap className="w-3 h-3 text-amber-400" /> Power Today
          </div>
          <span className="text-base font-bold font-mono text-white mt-1">
            {kwhToday} <span className="text-xs font-normal text-white/50">kWh</span>
          </span>
          <span className="text-[9px] text-white/40 font-mono mt-0.5">
            Est: ${powerCost}
          </span>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2 flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <Globe className="w-3 h-3 text-emerald-400" /> Carbon Emitted
          </div>
          <span className="text-base font-bold font-mono text-emerald-400 mt-1">
            {co2Grams} <span className="text-xs font-normal text-emerald-400/60">g CO₂e</span>
          </span>
          <span className="text-[9px] text-white/40 font-mono mt-0.5">
            Offset: $0.02
          </span>
        </div>
      </div>

      {/* Footer: View monthly invoice */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between z-10 text-[10px]">
        <span className="text-white/40">30-Day Wrapup Invoice Ready</span>
        <button
          onClick={onOpenInvoice}
          className="text-violet-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
        >
          <FileSpreadsheet className="w-3 h-3" />
          <span>View Report</span>
        </button>
      </div>
    </div>
  );
};
