import { useDashboard } from '../../context/DashboardContext';
import { AlertCircle, Waves, Wind, Flame } from 'lucide-react';

export default function LiveAlertsPanel() {
    const { alerts, getIcon, addToast } = useDashboard();
    const criticalCount = alerts.filter(a => a.critical).length;

    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 transition-all duration-300 flex flex-col h-full animate-fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute"></span>
                    <span className="w-2 h-2 rounded-full bg-red-500 relative"></span>
                    Live Alerts
                </h2>
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/30">
                    {criticalCount} Critical
                </span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {alerts.map(alert => {
                    const Icon = getIcon(alert.iconName);
                    return (
                        <div
                            key={alert.id}
                            className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer flex items-start gap-4 
                ${alert.critical
                                    ? 'bg-red-500/10 border border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.6)] hover:bg-red-500/20'
                                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${alert.critical ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-orange-400'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className={`font-bold text-sm ${alert.critical ? 'text-red-400' : 'text-slate-200'}`}>
                                        {alert.type}
                                    </h4>
                                    <span className="text-xs text-slate-500 font-mono">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    {alert.location}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => addToast('Opening full alerts modal...', 'info')}
                className="w-full mt-4 py-2 text-sm text-slate-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all duration-300 border border-dashed border-gray-600 hover:scale-[1.02] active:scale-95"
            >
                View All Alerts
            </button>
        </div>
    );
}
