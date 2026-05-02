import { useDashboard } from '../../context/DashboardContext';
import { CheckCircle, ChevronsUp, ShieldAlert, Zap, Clock, Terminal, Activity } from 'lucide-react';

export default function IncidentActionPanel() {
    const { actions, acknowledgeAction, escalateAction } = useDashboard();

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0B]/20 relative overflow-hidden  group">
            
            {/* Mission Critical Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-red-500/10 bg-red-500/[0.02]">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-red-500/20 bg-red-500/5 flex items-center justify-center relative">
                        <ShieldAlert className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444]" />
                    </div>
                    <div>
                        <h4 className="font-poppins font-black text-xl tracking-tight text-white uppercase leading-none mb-1">ACTION_QUEUE</h4>
                        <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase flex items-center gap-2">
                           <Activity className="w-3 h-3 text-red-500" /> PENDING_PROTOCOL_SYNC
                        </p>
                    </div>
                </div>
                
                <div className="px-5 py-2 bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-[10px] font-black tracking-widest uppercase animate-pulse">
                    {actions.length} MISSIONS
                </div>
            </div>

            {/* Action Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                {actions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-6 opacity-10">
                        <Terminal className="w-12 h-12" />
                        <span className="font-mono text-[10px] font-black tracking-[0.5em] uppercase">SYSTEM_STABLE: NO_PENDING_THREADS</span>
                    </div>
                )}
                {actions.map((act) => (
                    <div key={act.id} className="group/action px-6 py-5 hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.01] -rotate-45 translate-x-16 -translate-y-16" />
                        
                        <div className="flex items-start justify-between gap-6 mb-6">
                            <div className="flex items-start gap-4">
                               <div className={`w-1 h-8 mt-1 ${act.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                               <div>
                                  <h5 className="font-poppins font-black text-lg tracking-tight uppercase leading-snug text-white group-hover/action:text-red-400 transition-colors">
                                      {act.title}
                                  </h5>
                                  <div className="flex items-center gap-4 mt-2">
                                     <span className={`font-mono text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 border ${act.priority === 'High' ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500'}`}>
                                        {act.priority}_PRIORITY
                                     </span>
                                     <span className="font-mono text-[9px] text-[#6B7280] tracking-widest font-bold uppercase transition-transform group-hover/action:translate-x-2">SOURCE: {act.source}</span>
                                  </div>
                               </div>
                            </div>
                            <span className="font-mono text-[10px] text-[#6B7280] tracking-widest font-bold uppercase">[{act.time}]</span>
                        </div>
                        
                        {/* Action Clusters */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <button
                                onClick={() => acknowledgeAction(act.id)}
                                className="flex items-center justify-center gap-4 py-4 bg-white/[0.02] hover:bg-white/10 border border-[#1F2937] hover:border-white/20 transition-all font-mono text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 hover:text-white"
                            >
                                <CheckCircle className="w-4 h-4" />
                                ACKNOWLEDGE
                            </button>
                            <button
                                onClick={() => escalateAction(act.id)}
                                className="flex items-center justify-center gap-4 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-black border border-red-500/20 hover:border-transparent transition-all duration-500 font-mono text-[10px] font-black tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                            >
                                <ChevronsUp className="w-4 h-4" />
                                ESCALATE_C4
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tactical Footer Overlay */}
            <div className="p-10 bg-black/40 border-t border-[#1F2937] relative group/footer">
                <div className="flex items-center justify-between opacity-20 group-hover/footer:opacity-40 transition-opacity">
                   <div className="flex gap-4">
                      <Zap className="w-4 h-4 text-white" />
                      <span className="font-mono text-[9px] font-black tracking-[0.4em] text-white uppercase">CORTEX_RESPONSE_INITIATED</span>
                   </div>
                   <Clock className="w-4 h-4 text-white" />
                </div>
            </div>
        </div>
    );
}
