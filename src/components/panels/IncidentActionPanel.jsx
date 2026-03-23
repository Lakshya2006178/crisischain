import { useDashboard } from '../../context/DashboardContext';
import { CheckCircle, ChevronsUp, ShieldAlert } from 'lucide-react';

export default function IncidentActionPanel() {
    const { actions, acknowledgeAction, escalateAction } = useDashboard();

    return (
        <div className="db-card">
            {/* Header */}
            <div className="db-card-header">
                <h2 className="font-bebas tracking-widest text-lg text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    Pending Actions
                </h2>
                <span className="min-w-[22px] h-5 flex items-center justify-center rounded-full font-inter text-[10px] font-bold animate-pulse px-1.5"
                      style={{background:'#ef4444', color:'#fff'}}>
                    {actions.length}
                </span>
            </div>

            {/* Actions */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 divide-y"
                 style={{divideColor:'rgba(51,65,85,.4)'}}>
                {actions.length === 0 && (
                    <div className="flex items-center justify-center h-full font-inter text-xs italic text-slate-500 p-6">
                        No pending actions
                    </div>
                )}
                {actions.map((act) => (
                    <div key={act.id} className="px-5 py-4 hover:bg-slate-800/25 transition-colors">
                        {/* Title + time */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-inter text-sm font-semibold text-slate-100 leading-snug">{act.title}</span>
                            <span className="font-inter text-[10px] text-slate-500 font-mono flex-shrink-0 mt-0.5">{act.time}</span>
                        </div>

                        {/* Priority + source */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`font-inter text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded
                                ${act.priority === 'High'
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                    : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                                }`}>
                                {act.priority}
                            </span>
                            <span className="font-inter text-[10px] text-slate-500">From: {act.source}</span>
                        </div>

                        {/* Buttons — equal width, full row */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <button
                                onClick={() => acknowledgeAction(act.id)}
                                className="font-inter flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold
                                    rounded-lg transition-all duration-200 active:scale-95 tracking-wide
                                    bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/60 text-blue-300"
                            >
                                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                Acknowledge
                            </button>
                            <button
                                onClick={() => escalateAction(act.id)}
                                className="font-inter flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold
                                    rounded-lg transition-all duration-200 active:scale-95 tracking-wide
                                    bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 hover:border-red-500/60 text-red-300"
                                style={{boxShadow:'0 0 12px rgba(239,68,68,.15)'}}
                            >
                                <ChevronsUp className="w-3.5 h-3.5 flex-shrink-0" />
                                Escalate
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
