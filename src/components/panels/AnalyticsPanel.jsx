import { BarChart3, TrendingUp, Activity, PieChart, Target, Zap, Globe, Gauge } from 'lucide-react';

const D_BARS = [
  { val: 45, label: 'CENTRAL' }, { val: 68, label: 'NORTH' }, 
  { val: 32, label: 'SOUTH' }, { val: 89, label: 'EAST' }, 
  { val: 56, label: 'WEST' }, { val: 74, label: 'URBAN' },
];

const TREND_DATA = [10, 25, 18, 45, 38, 55, 62, 58, 75, 82, 70, 95];

export default function AnalyticsPanel() {
  const points = TREND_DATA.map((v, i) => {
    const x = (i / (TREND_DATA.length - 1)) * 100;
    const y = 40 - (v / 100) * 40;
    return `L ${x} ${y}`;
  }).join(' ');

  const closedPath = `M 0 40 ${points} L 100 40 Z`;
  const openPath = `M 0 40 ${points}`;

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0B0E]/20 relative overflow-hidden backdrop-blur-3xl group">
      
      {/* Proper HUD Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-amber-500/20 bg-amber-500/5 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <h4 className="font-outfit font-black text-sm tracking-tight text-white uppercase leading-none mb-1">CORTEX_ANALYTICS</h4>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/20 uppercase">UPLINK_SYNC_ACTIVE</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
           {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-white/5" />)}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 p-5 md:p-8 overflow-y-auto custom-scrollbar">
        
        {/* Tactical Bar Distribution */}
        <div className="flex flex-col gap-5 bg-white/[0.01] border border-white/5 p-5 hover:border-white/10 transition-all duration-300 group/dist">
          <div className="flex items-center justify-between">
             <span className="font-mono text-[9px] font-black tracking-widest text-white/30 uppercase">SECTOR_DENSITY_INTEL</span>
             <Globe size={11} className="text-white/10" />
          </div>
          
          <div className="h-32 flex items-end justify-between gap-1.5 relative py-2">
            {D_BARS.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                <div className="w-full relative h-[60%] flex items-end">
                   <div className="w-full bg-white/[0.02] absolute top-0 bottom-0" />
                   <div className="w-full transition-all duration-700 group-hover/bar:brightness-150"
                        style={{ height:`${b.val}%`, background: 'rgba(245, 158, 11, 0.7)' }}/>
                </div>
                <span className="font-mono text-[7px] font-bold tracking-[0.1em] text-white/20 uppercase truncate w-full text-center">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Trend Line Line Chart */}
        <div className="flex flex-col gap-5 bg-white/[0.01] border border-white/5 p-5 hover:border-white/10 transition-all duration-300 group/trend">
          <div className="flex items-center justify-between">
             <span className="font-mono text-[9px] font-black tracking-widest text-white/30 uppercase">THREAT_VECTOR_TRACKING</span>
             <TrendingUp size={11} className="text-[#00FFCC]/20" />
          </div>
          
          <div className="h-32 relative flex items-end pt-6 pb-2">
             <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 opacity-[0.02] pointer-events-none">
                {Array.from({length: 8}).map((_, i) => <div key={i} className="border-t border-r border-white" />)}
             </div>

             <svg viewBox="0 0 100 40" className="w-full h-full preserve-3d">
                <defs>
                   <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FFCC" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#00FFCC" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path
                   d={closedPath}
                   fill="url(#trendGradient)"
                />
                <path
                   d={openPath}
                   fill="none"
                   stroke="#00FFCC"
                   strokeWidth="1"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   className="animate-draw-line"
                />
             </svg>
             
             <div className="absolute top-0 right-0 p-1 bg-black/60 border border-white/10 font-mono text-[8px] font-black">
                <span className="text-[#00FFCC]">95.4%</span>
             </div>
          </div>
          
          <div className="flex justify-between items-center text-[7px] font-mono text-white/10 uppercase tracking-[0.3em] mt-2">
             <span>T_MINUS_12H</span>
             <span>T_SYNC_NOW</span>
          </div>
        </div>
      </div>

      {/* Analytics Footer HUD */}
      <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Gauge size={10} className="text-white/20" />
               <span className="font-mono text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">CORTEX_LOAD: 42%</span>
            </div>
            <div className="flex items-center gap-2">
               <Target size={10} className="text-white/20" />
               <span className="font-mono text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">CONF_INDEX: 0.982</span>
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes draw-line {
          from { stroke-dasharray: 0 500; }
          to { stroke-dasharray: 500 500; }
        }
        .animate-draw-line {
          stroke-dasharray: 500;
          animation: draw-line 2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}} />
    </div>
  );
}
