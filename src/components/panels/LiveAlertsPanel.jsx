import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { ShieldAlert, Zap, Clock, Terminal, Activity, ChevronRight, Activity as Heartbeat } from 'lucide-react';

export default function LiveAlertsPanel() {
    const navigate = useNavigate();
    const { alerts, getIcon, addToast, updateStatus, user } = useDashboard();
    const criticalCount = alerts.filter(a => a.critical).length;

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0B]/20 relative overflow-hidden  group">
            
            {/* Header Header Status Bar */}
            <div className={`
                flex items-center justify-between px-6 py-5 border-b transition-all duration-700
                ${criticalCount > 0 ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-white/[0.02] border-[#1F2937]'}
            `}>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Heartbeat className={`w-6 h-6 ${criticalCount > 0 ? 'text-red-500 animate-[pulse_2s_infinite]' : 'text-blue-500/40'}`} />
                        {criticalCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping" />}
                    </div>
                    <div>
                        <h4 className="font-poppins font-black text-xl tracking-tight text-white uppercase leading-none mb-1">LIVE INCIDENTS</h4>
                        <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">MONITORING: {alerts.length} AREAS</p>
                    </div>
                </div>
                {criticalCount > 0 && (
                    <div className="px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[9px] font-black tracking-widest uppercase animate-pulse">
                        {criticalCount} URGENT
                    </div>
                )}
            </div>

            {/* Alert List Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                {alerts.map((alert, idx) => {
                    const Icon = getIcon(alert.iconName);
                    return (
                        <div
                            key={alert.id}
                            onClick={() => addToast(`Uplink: ${alert.type}`, 'info')}
                            className={`
                                group/alert flex items-start gap-5 px-6 py-5 cursor-pointer transition-all duration-500 hover:bg-white/[0.03] relative border-l-2
                                ${alert.critical ? 'border-l-red-500 bg-red-500/[0.02]' : 'border-l-blue-500/40'}
                            `}
                        >
                            {/* Marker */}
                            <div className="relative flex-shrink-0 mt-1">
                                <div className={`w-10 h-10 border flex items-center justify-center transition-all group-hover/alert:scale-110 ${alert.critical ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-[#1F2937] border-[#1F2937] text-[#9CA3AF]'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                {alert.critical && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                            </div>

                            {/* Content Block */}
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h5 className={`font-poppins font-black text-lg tracking-tight uppercase leading-none ${alert.critical ? 'text-white' : 'text-[#D1D5DB] text-blue-100'}`}>
                                        {alert.type}
                                    </h5>
                                    <span className="font-mono text-[9px] text-[#6B7280] tracking-widest font-bold uppercase transition-transform group-hover/alert:translate-x-2">[{alert.time}]</span>
                                </div>
                                <p className="font-mono text-[10px] text-white/30 uppercase italic tracking-tighter line-clamp-1">LOCATION: {alert.location}</p>
                                
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="px-3 py-1 bg-[#1F2937] border border-[#1F2937] font-mono text-[8px] font-black tracking-widest uppercase text-[#6B7280]">
                                        ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                                    </div>
                                    <div className={`px-3 py-1 border font-mono text-[8px] font-black tracking-widest uppercase ${alert.critical ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'}`}>
                                        {alert.status === 'active' ? 'ACTIVE_UNASSIGNED' : alert.status === 'responding' ? 'RESPONDERS_DISPATCHED' : 'RESOLVED'}
                                    </div>
                                    
                                    {/* Responder Actions */}
                                    {(user?.role === 'responder' || user?.role === 'admin') && (
                                       <div className="flex gap-2">
                                          {alert.status === 'active' && (
                                            <button 
                                              onClick={async (e) => { e.stopPropagation(); await updateStatus(alert.id, 'responding'); }}
                                              className="px-3 py-1 bg-blue-600 text-white font-mono text-[8px] font-black uppercase hover:bg-blue-700"
                                            >
                                              Dispatch
                                            </button>
                                          )}
                                          {alert.status === 'responding' && (
                                            <button 
                                              onClick={async (e) => { e.stopPropagation(); await updateStatus(alert.id, 'resolved'); }}
                                              className="px-3 py-1 bg-green-600 text-white font-mono text-[8px] font-black uppercase hover:bg-green-700"
                                            >
                                              Resolve
                                            </button>
                                          )}
                                       </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-10 border-t border-[#1F2937] bg-black/40">
                <button
                    onClick={() => {
                        addToast('Opening Alert Feed…', 'info');
                        navigate('/alerts');
                    }}
                    className="w-full h-12 bg-white/[0.03] hover:bg-white/10 border border-[#1F2937] hover:border-white/20 transition-all font-mono text-[10px] font-black tracking-[0.5em] text-[#9CA3AF] hover:text-[#14B8A6] uppercase"
                >
                    VIEW ALL ALERTS
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
            `}} />
        </div>
    );
}
