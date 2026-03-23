import { PieChart, BarChart2, TrendingUp } from 'lucide-react';

const BARS = [
  { h: 40, label: 'M' }, { h: 65, label: 'T' }, { h: 30, label: 'W' },
  { h: 85, label: 'T' }, { h: 50, label: 'F' }, { h: 45, label: 'S' }, { h: 90, label: 'S' },
];
const METRICS = [
  { label: 'Critical', pct: 45, color: '#ef4444' },
  { label: 'Warning',  pct: 30, color: '#eab308' },
  { label: 'Resolved', pct: 25, color: '#3b82f6' },
];
const barColor = (h) => h > 70 ? '#ef4444' : h > 40 ? '#eab308' : '#3b82f6';

export default function AnalyticsPanel() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <h2 className="font-bebas tracking-widest text-lg text-slate-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-purple-400 flex-shrink-0" />
          Analytics &amp; Key Metrics
        </h2>
        <span className="font-inter text-[10px] text-emerald-400 flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3" />
          Live Data
        </span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-5 overflow-hidden">

        {/* Donut */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl p-4"
             style={{background:'rgba(15,24,40,.8)', border:'1px solid rgba(51,65,85,.4)'}}>
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
               style={{ background:`conic-gradient(
                 #ef4444 0% 45%,
                 #eab308 45% 75%,
                 #3b82f6 75% 100%
               )`}}>
            <div className="w-[58px] h-[58px] rounded-full flex flex-col items-center justify-center"
                 style={{background:'#0c1523'}}>
              <span className="font-bebas text-2xl text-slate-100 leading-none">142</span>
              <span className="font-inter text-[9px] text-slate-500 mt-0.5">Total</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            {METRICS.map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="font-inter text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{background: m.color}}/>
                  {m.label}
                </span>
                <span className="font-inter text-xs font-semibold font-mono" style={{color: m.color}}>
                  {m.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex flex-col gap-3 rounded-xl p-4"
             style={{background:'rgba(15,24,40,.8)', border:'1px solid rgba(51,65,85,.4)'}}>
          <div className="font-inter text-xs text-slate-400 font-semibold flex items-center gap-1.5 flex-shrink-0">
            <BarChart2 className="w-3.5 h-3.5" /> 7-Day Trend
          </div>
          <div className="flex-1 flex items-end justify-between gap-1.5 relative min-h-0">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed opacity-20"
                 style={{borderColor:'#475569'}}/>
            {BARS.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full relative rounded-t overflow-hidden" style={{ height: '80%' }}>
                  <div className="absolute bottom-0 w-full rounded-t transition-all duration-700 group-hover:brightness-110"
                       style={{ height:`${b.h}%`, background: barColor(b.h) }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-inter text-[9px] text-slate-600 font-mono flex-shrink-0">
            {BARS.map(b => <span key={b.label}>{b.label}</span>)}
          </div>
        </div>

      </div>
    </div>
  );
}
