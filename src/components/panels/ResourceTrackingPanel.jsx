import { useDashboard } from '../../context/DashboardContext';
import { Truck, Flame, Users, HeartPulse } from 'lucide-react';

export default function ResourceTrackingPanel() {
    const { resources, getIcon } = useDashboard();

    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 transition-all duration-300 flex flex-col h-full animate-fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    Field Resources Active
                </h2>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sync
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2 overflow-y-auto custom-scrollbar flex-1 pb-2 pr-2">
                {resources.map((res) => {
                    const Icon = getIcon(res.iconName);
                    const percentage = Math.round((res.count / res.total) * 100);

                    return (
                        <div key={res.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4 transition-transform hover:scale-[1.03] hover:shadow-lg group animate-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-lg bg-slate-800 ${res.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold font-mono text-slate-100">{res.count}</span>
                                    <span className="text-xs text-slate-500 font-mono">/{res.total}</span>
                                </div>
                            </div>

                            <h3 className="text-sm font-semibold text-slate-300 mb-2">{res.name}</h3>

                            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                                <div
                                    className={`h-1.5 rounded-full ${res.bg} transition-all duration-1000 group-hover:brightness-125`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                <span>Deployed</span>
                                <span className="truncate ml-2">{percentage}% Util</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
