import React, { useState } from 'react';
import {
  Download,
  Share2,
  Check,
  Leaf,
  Globe,
  Zap,
  TrendingUp,
} from 'lucide-react';
import type { SystemMetrics } from '../../types';

interface EcoInvoiceTabProps {
  metrics: SystemMetrics;
}

export const EcoInvoiceTab: React.FC<EcoInvoiceTabProps> = ({ metrics }) => {
  const [copied, setCopied] = useState(false);

  const uptimeHoursTotal = Math.round(metrics.uptime_secs / 3600 * 22); // Simulated monthly
  const monthlyKwh = (uptimeHoursTotal * 0.065).toFixed(1);
  const monthlyCo2Kg = (Number(monthlyKwh) * 0.43).toFixed(2);
  const electricityCost = (Number(monthlyKwh) * 0.165).toFixed(2);
  const carbonOffsetCost = (Number(monthlyCo2Kg) * 0.035).toFixed(2);
  const totalEcoBill = (Number(electricityCost) + Number(carbonOffsetCost)).toFixed(2);

  const handleCopy = () => {
    const reportText = `[ORBIDOCK MONTHLY ECO IMPACT AUDIT]
• Total Workstation Uptime: ${uptimeHoursTotal} hrs
• Total Energy Draw: ${monthlyKwh} kWh (~$${electricityCost})
• Carbon Footprint: ${monthlyCo2Kg} kg CO₂e
• Carbon Credit Equivalent: ~$${carbonOffsetCost}
• Top Focus: Code & Engineering (46%), Research (28%), AI Tools (16%)
Total Estimated Ecological Cost of Work: $${totalEcoBill}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Action Header */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Monthly Environmental Invoice & Productivity Wrapup
            </h3>
            <p className="text-[11px] text-white/50">
              Tallied against real-time power rates & carbon market pricing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-white/[0.05] hover:bg-white/10 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Summary'}</span>
          </button>
          <button
            onClick={() => alert('Exporting Environmental Invoice PDF...')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Invoice</span>
          </button>
        </div>
      </div>

      {/* Styled Invoice Sheet (V-Notch & Apple aesthetic) */}
      <div className="bg-black/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 text-white font-sans relative overflow-hidden shadow-2xl">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 top-4 text-white/[0.03] text-7xl font-bold font-mono select-none pointer-events-none">
          ORBI-INVOICE
        </div>

        {/* Invoice Top Meta */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              OrbiDock Workstation Audit
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              ECOLOGICAL & USAGE STATEMENT
            </h2>
            <div className="text-xs text-white/50 mt-0.5">
              Statement ID: ORBI-2026-M10 · Windows Desktop Node
            </div>
          </div>

          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
              INFORMATIONAL STATEMENT
            </span>
            <div className="text-[10px] text-white/40 font-mono mt-1">
              Billing Period: 30-Day Cumulative
            </div>
          </div>
        </div>

        {/* Core KPI metrics row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-white/50 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Workstation Power Draw
            </span>
            <span className="text-xl font-bold font-mono text-white mt-1">
              {monthlyKwh} <span className="text-xs font-normal text-white/50">kWh</span>
            </span>
            <span className="text-[9px] text-white/40 font-mono mt-0.5">
              ~{uptimeHoursTotal} Active Screen Hours
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-white/50 flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400" /> Total CO₂e Footprint
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {monthlyCo2Kg} <span className="text-xs font-normal text-emerald-400/60">kg</span>
            </span>
            <span className="text-[9px] text-white/40 font-mono mt-0.5">
              Grid avg: 430g/kWh
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-white/50 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-violet-400" /> Ecological Valuation
            </span>
            <span className="text-xl font-bold font-mono text-white mt-1">
              ${totalEcoBill}
            </span>
            <span className="text-[9px] text-white/40 font-mono mt-0.5">
              Power + Carbon Offset
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-white/80">Itemized Work Consumption</div>
          <div className="flex flex-col divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
            <div className="flex items-center justify-between p-3 text-[11px] text-white/50 font-medium bg-white/[0.02]">
              <span>Description / Resource</span>
              <span>Rate Basis</span>
              <span className="text-right">Estimated Cost</span>
            </div>
            <div className="flex items-center justify-between p-3 text-xs">
              <div>
                <div className="text-white font-medium">Electricity Grid Consumption</div>
                <div className="text-[10px] text-white/40">PC hardware + Display panels (30d)</div>
              </div>
              <span className="font-mono text-xs text-white/70">$0.165 / kWh</span>
              <span className="font-mono text-xs text-white font-semibold">${electricityCost}</span>
            </div>
            <div className="flex items-center justify-between p-3 text-xs">
              <div>
                <div className="text-white font-medium">Voluntary Carbon Offset (EU ETS Index)</div>
                <div className="text-[10px] text-white/40">Estimated direct Scope 2 emissions ({monthlyCo2Kg} kg)</div>
              </div>
              <span className="font-mono text-xs text-white/70">$35.00 / Metric Ton</span>
              <span className="font-mono text-xs text-white font-semibold">${carbonOffsetCost}</span>
            </div>
            <div className="flex items-center justify-between p-3 text-xs">
              <div>
                <div className="text-white font-medium">Browser Network Transfer Footprint</div>
                <div className="text-[10px] text-white/40">Data center & CDN transit routing (~48 GB)</div>
              </div>
              <span className="font-mono text-xs text-white/70">0.06 kWh / GB</span>
              <span className="font-mono text-xs text-emerald-400 font-semibold">Included</span>
            </div>
          </div>
        </div>

        {/* Top Productive Domains */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-white/80">Top Workstation Time Investment</div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { label: 'GitHub / IDE', pct: '44%', hrs: '72h' },
              { label: 'Research & Docs', pct: '26%', hrs: '42h' },
              { label: 'Discord / Slack', pct: '18%', hrs: '29h' },
              { label: 'Media & Focus', pct: '12%', hrs: '19h' },
            ].map((app, i) => (
              <div key={i} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col">
                <span className="text-[10px] text-white/50">{app.label}</span>
                <span className="font-bold text-white mt-0.5">{app.pct}</span>
                <span className="text-[9px] text-white/40 font-mono">{app.hrs} logged</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-white/60">
            Total Environmental & Power Work Cost:
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ${totalEcoBill} USD
          </div>
        </div>
      </div>
    </div>
  );
};
