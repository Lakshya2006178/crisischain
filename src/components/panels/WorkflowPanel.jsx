import { useDashboard } from '../../context/DashboardContext';
import { AlertTriangle, ClipboardCheck, Siren, HeartHandshake, ChevronRight } from 'lucide-react';

const STEPS = [
    { id:1, title:'SIGNAL_INTAKE',      sub:'12:01 UTC',   icon: AlertTriangle,  color:'#ef4444', desc:'Anomaly detected in coastal sectors.' },
    { id:2, title:'THREAT_VECTOR',     sub:'12:45 UTC',   icon: ClipboardCheck, color:'#fbbf24', desc:'Structural impact modeling active.' },
    { id:3, title:'RESPONSE_SYNC',    sub:'13:30 UTC',   icon: Siren,          color:'#3b82f6', desc:'Deployment of priority response units.' },
    { id:4, title:'RECOVERY_LOG',      sub:'PLANNED',     icon: HeartHandshake, color:'#10b981', desc:'Post-incident stability assessment.' },
];

export default function WorkflowPanel() {
    const { workflowId, advanceWorkflow } = useDashboard();

    return (
        <div className="flex h-full w-full items-stretch divide-x divide-white/5 overflow-x-auto custom-scrollbar">
            {/* Header Label */}
            <div className="flex-shrink-0 flex flex-col justify-center px-8 bg-white/[0.02]">
                <div className="h-1 w-8 bg-[#00FFCC] mb-4" />
                <p className="font-mono text-[10px] text-white/40 tracking-[0.5em] uppercase vertical-text">
                    LIFECYCLE
                </p>
            </div>

            {/* Steps */}
            <div className="flex flex-1 min-w-max">
                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive    = step.id === workflowId;
                    const isCompleted = step.id < workflowId;
                    const isDimmed    = step.id > workflowId;

                    return (
                        <div key={step.id} className="flex items-center">
                            <button
                                onClick={() => { if (isActive && step.id < 4) advanceWorkflow(); }}
                                className={`
                                    group/step relative flex flex-col justify-center gap-4 px-10 py-8 text-left transition-all duration-700 w-[280px] h-full
                                    ${isActive ? 'bg-[#00FFCC]/[0.03] shadow-[inset_0_0_40px_rgba(0,255,204,0.02)]' : 'hover:bg-white/[0.02]'}
                                    ${isDimmed ? 'opacity-30 grayscale' : ''}
                                `}
                            >
                                {/* Step Indicator */}
                                <div className="absolute top-4 left-10 flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#00FFCC] animate-pulse shadow-[0_0_8px_#00FFCC]' : isCompleted ? 'bg-white/40' : 'bg-white/10'}`} />
                                    <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">STAGE_0{step.id}</span>
                                </div>

                                {/* Icon & Title */}
                                <div className="flex items-start gap-5">
                                    <div className={`
                                        flex-shrink-0 w-12 h-12 flex items-center justify-center border transition-all duration-500
                                        ${isActive ? 'bg-[#00FFCC]/10 border-[#00FFCC]/40 text-[#00FFCC]' : isCompleted ? 'bg-white/5 border-white/10 text-white/60' : 'bg-transparent border-white/5 text-white/20'}
                                    `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h4 className={`font-outfit font-black text-lg tracking-tight uppercase leading-none mb-1 ${isActive ? 'text-white' : 'text-white/40'}`}>
                                            {step.title}
                                        </h4>
                                        <p className={`font-mono text-[9px] font-bold tracking-[0.2em] mb-3 ${isActive ? 'text-[#00FFCC]' : 'text-white/20'}`}>
                                            {step.sub}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-[10px] leading-relaxed text-white/40 font-inter uppercase italic group-hover/step:text-white/60 transition-colors">
                                    {step.desc}
                                </p>

                                {isActive && (
                                    <div className="absolute bottom-0 left-0 h-1 bg-[#00FFCC] animate-progress-glow" style={{ width: '40%' }} />
                                )}
                            </button>

                            {/* Chevron Divider */}
                            {idx < STEPS.length - 1 && (
                                <div className="flex-shrink-0 h-full flex items-center px-2">
                                    <ChevronRight className="w-4 h-4 text-white/5" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); }
                @keyframes progress-glow {
                    0% { opacity: 0.3; width: 0%; }
                    50% { opacity: 1; width: 100%; }
                    100% { opacity: 0.3; width: 0%; }
                }
                .animate-progress-glow { animation: progress-glow 4s ease-in-out infinite; }
            `}} />
        </div>
    );
}
