import { useDashboard } from '../../context/DashboardContext';
import { CheckCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function IncidentActionPanel() {
    const { actions, acknowledgeAction, escalateAction } = useDashboard();

    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col h-full animate-fade-in duration-300 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-blue-500">
            <div className="bg-red-950/40 p-4 border-b border-red-900/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    Pending Actions
                </h2>
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                    {actions.length}
                </span>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                {actions.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
                        No pending actions.
                    </div>
                )}
                {actions.map((act) => (
                    <div key={act.id} className="bg-slate-900 border border-slate-700 p-3 rounded-lg hover:border-slate-500 transition-colors">

                        <div className="flex justify-between items-start mb-2 text-sm text-slate-300">
                            <span className="font-semibold text-slate-100">{act.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${act.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                {act.priority}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                From: {act.source}
                            </span>
                        </div>

                        <div className="flex gap-2 w-full mt-2">
                            <button
                                onClick={() => acknowledgeAction(act.id)}
                                className="flex-1 py-1.5 px-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-medium rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center justify-center gap-1"
                            >
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Acknowledge</span>
                            </button>
                            <button
                                onClick={() => escalateAction(act.id)}
                                className="flex-1 py-1.5 px-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.4)] flex items-center justify-center gap-1"
                            >
                                <span>Escalate</span>
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
