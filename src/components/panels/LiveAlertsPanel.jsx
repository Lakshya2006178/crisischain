import { useDashboard } from '../../context/DashboardContext';

export default function LiveAlertsPanel() {
    const { alerts, getIcon, addToast } = useDashboard();
    const criticalCount = alerts.filter(a => a.critical).length;

    return (
        <div className="db-card">
            {/* Header */}
            <div className="db-card-header">
                <h2 className="font-bebas tracking-widest text-lg text-slate-100 flex items-center gap-2.5">
                    <span className="relative w-2.5 h-2.5 flex-shrink-0">
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-70"/>
                        <span className="relative block w-full h-full rounded-full bg-red-500"/>
                    </span>
                    Live Alerts
                </h2>
                <span className="font-inter text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase"
                      style={{background:'rgba(239,68,68,.12)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)'}}>
                    {criticalCount} Critical
                </span>
            </div>

            {/* Body: alert rows */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 divide-y"
                 style={{divideColor:'rgba(51,65,85,.4)'}}>
                {alerts.map(alert => {
                    const Icon = getIcon(alert.iconName);
                    return (
                        <div
                            key={alert.id}
                            onClick={() => addToast(`Alert: ${alert.type}`, 'info')}
                            className={`flex items-start gap-3.5 px-5 py-3.5 cursor-pointer transition-colors hover:bg-slate-800/30
                                ${alert.critical ? 'border-l-2 border-l-red-500 bg-red-500/[.03]' : 'border-l-2 border-l-transparent'}`}
                        >
                            {/* Icon */}
                            <div className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center
                                ${alert.critical ? 'bg-red-500/15 text-red-400' : 'bg-slate-800 text-orange-400'}`}>
                                <Icon className="w-4 h-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-bebas tracking-widest text-base leading-none"
                                          style={{color: alert.critical ? '#fca5a5' : '#e2e8f0'}}>
                                        {alert.type}
                                    </span>
                                    <span className="font-inter text-[10px] text-slate-500 font-mono flex-shrink-0">
                                        {alert.time}
                                    </span>
                                </div>
                                <p className="font-inter text-[11px] text-slate-400 truncate">{alert.location}</p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${alert.critical ? 'bg-red-500' : 'bg-yellow-500'}`}/>
                                    <span className={`font-inter text-[10px] font-semibold ${alert.critical ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {alert.critical ? 'Critical' : 'Warning'}
                                    </span>
                                    {alert.status && (
                                        <span className="font-inter text-[10px] text-slate-600">· {alert.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 py-3 border-t" style={{borderColor:'rgba(51,65,85,.5)'}}>
                <button
                    onClick={() => addToast('Opening full alerts…', 'info')}
                    className="font-inter w-full py-2.5 text-xs font-semibold tracking-wider uppercase text-slate-400
                        hover:text-slate-200 rounded-lg transition-colors border border-dashed border-slate-700/60
                        hover:border-slate-500 hover:bg-slate-800/40"
                >
                    View All Alerts
                </button>
            </div>
        </div>
    );
}
