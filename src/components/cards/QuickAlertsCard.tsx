import React from 'react';
import { Bell, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';

export const QuickAlertsCard: React.FC = () => {
  const alerts = [
    {
      id: 1,
      title: 'Competitor Pricing Changed',
      desc: 'Acme Pro plan increased from $49 → $59 (+20%)',
      time: '3m ago',
      type: 'pricing',
      icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
      action: 'Review',
    },
    {
      id: 2,
      title: 'Automation Workflow Completed',
      desc: 'Extracted 14 competitor landing page changes',
      time: '18m ago',
      type: 'automation',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      action: 'Open Brief',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-white">Dynamic Alerts</h4>
            <span className="text-[10px] text-white/40">2 updates waiting</span>
          </div>
        </div>

        <span className="text-[10px] font-medium text-violet-400 hover:underline cursor-pointer">
          Clear all
        </span>
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-2 my-2">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex items-center justify-between"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 mt-0.5 flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h5 className="text-[11px] font-semibold text-white truncate">
                    {item.title}
                  </h5>
                  <span className="text-[9px] text-white/40">{item.time}</span>
                </div>
                <p className="text-[10px] text-white/60 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => window.alert(`Triggered action: ${item.action}`)}
              className="ml-2 px-2 py-1 bg-white/[0.05] hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-[10px] font-medium flex items-center gap-0.5 flex-shrink-0 transition-colors"
            >
              <span>{item.action}</span>
              <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
        <span>Web monitors active: 3</span>
        <span className="text-violet-400 font-medium">Orbidock Hub</span>
      </div>
    </div>
  );
};
