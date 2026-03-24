import { useDashboard } from '../../context/DashboardContext';
import { Truck } from 'lucide-react';

export default function ResourceTrackingPanel() {
    const { resources, getIcon } = useDashboard();

    return (
        <div className="db-card">
            <div className="db-card-header">
                <h2 className="font-bebas tracking-widest text-lg text-slate-100 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Resource Tracking
                </h2>
                <span className="font-inter text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"/>
                    Live Sync
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                {resources.map((res) => {
                    const Icon = getIcon(res.iconName);
                    const pct = Math.min(Math.round((res.count / res.total) * 100), 100);
                    const barColor = pct >= 80 ? '#ef4444' : pct >= 60 ? '#eab308' : '#22c55e';
                    const labelColor = pct >= 80 ? 'text-red-400' : pct >= 60 ? 'text-yellow-400' : 'text-emerald-400';
                    const status = pct >= 80 ? 'High Util' : pct >= 60 ? 'Moderate' : 'Available';

                    return (
                        <div key={res.id}
                             className="flex items-center gap-4 px-5 py-4 border-b hover:bg-slate-800/25 transition-colors"
                             style={{borderColor:'rgba(51,65,85,.35)'}}>
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${res.color}`}
                                 style={{background:'rgba(30,41,59,.8)'}}>
                                <Icon className="w-4.5 h-4.5" />
                            </div>

                            {/* Bar + labels */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-inter text-sm font-semibold text-slate-200">{res.name}</span>
                                    <span className="font-inter text-xs font-mono text-slate-400">
                                        <b className="text-slate-100">{res.count}</b>/{res.total}
                                        <span className="text-slate-600 text-[10px] ml-1">({pct}%)</span>
                                    </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full overflow-hidden"
                                     style={{background:'rgba(30,41,59,.9)'}}>
                                    <div className="h-full rounded-full transition-all duration-1000"
                                         style={{width: `${pct}%`, background: barColor}}/>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="font-inter text-[9px] text-slate-600 uppercase tracking-wider">Deployed</span>
                                    <span className={`font-inter text-[9px] font-semibold uppercase tracking-wider ${labelColor}`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
