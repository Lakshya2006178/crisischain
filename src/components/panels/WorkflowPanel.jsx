import { useDashboard } from '../../context/DashboardContext';
import { AlertTriangle, ClipboardCheck, Siren, HeartHandshake } from 'lucide-react';

const STEPS = [
    { id:1, title:'ALERT',      sub:'12:01 UTC · Active',   icon: AlertTriangle,  dot:'#ef4444', bar:'#ef4444', dim:'text-red-400',    ring:'ring-red-500/30',    desc:'Coastal Cyclone identified, warning issued' },
    { id:2, title:'ASSESSMENT', sub:'12:45 UTC · Current',  icon: ClipboardCheck, dot:'#eab308', bar:'#eab308', dim:'text-yellow-400', ring:'ring-yellow-400/30',  desc:'Impact analysis, damage reporting, resource needs' },
    { id:3, title:'RESPONSE',   sub:'13:30 UTC · Active',   icon: Siren,          dot:'#3b82f6', bar:'#3b82f6', dim:'text-blue-400',   ring:'ring-blue-500/30',    desc:'Search & Rescue, Aid distribution' },
    { id:4, title:'RECOVERY',   sub:'Planned',              icon: HeartHandshake, dot:'#22c55e', bar:'#22c55e', dim:'text-emerald-400',ring:'ring-emerald-500/25', desc:'Long term rehabilitation planning' },
];

export default function WorkflowPanel() {
    const { workflowId, advanceWorkflow } = useDashboard();

    return (
        <div className="db-card" style={{flexDirection:'row', overflow:'visible', minHeight:0}}>
            {/* Label */}
            <div className="flex-shrink-0 flex items-center px-5 border-r border-slate-700/50">
                <p className="font-bebas text-slate-500 tracking-[.22em] text-sm whitespace-nowrap"
                   style={{writingMode:'unset'}}>
                    WORKFLOW
                </p>
            </div>

            {/* Steps */}
            <div className="flex flex-1 items-stretch overflow-x-auto">
                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive    = step.id === workflowId;
                    const isCompleted = step.id < workflowId;
                    const isDimmed    = step.id > workflowId;

                    return (
                        <div key={step.id} className="flex flex-1 items-center min-w-0 min-w-[180px]">
                            <button
                                onClick={() => { if (isActive && step.id < 4) advanceWorkflow(); }}
                                className={`flex-1 flex items-start gap-4 px-5 py-4 text-left transition-all duration-200
                                    ${isActive ? `bg-slate-800/70 ring-1 ${step.ring}` : ''}
                                    ${isDimmed ? 'opacity-35' : ''}
                                    hover:bg-slate-800/40 cursor-pointer`}
                            >
                                {/* Icon circle */}
                                <div className={`flex-shrink-0 mt-0.5 w-10 h-10 rounded-full flex items-center justify-center
                                    ${isActive ? 'ring-2 ' + step.ring : ''}`}
                                     style={{background: isActive || isCompleted ? step.dot + '22' : 'rgba(30,41,59,.6)'}}>
                                    <Icon className="w-5 h-5 flex-shrink-0"
                                          style={{color: isActive || isCompleted ? step.dot : '#475569'}} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bebas tracking-widest text-lg leading-none mb-1"
                                       style={{color: isActive || isCompleted ? '#e2e8f0' : '#475569'}}>
                                        {step.title}
                                    </p>
                                    <p className="text-[11px] font-semibold mb-1.5"
                                       style={{color: isActive ? step.dot : '#475569', fontFamily:'Inter,sans-serif'}}>
                                        {step.sub}
                                    </p>
                                    <p className="text-[11px] leading-snug text-slate-500 font-inter line-clamp-2">
                                        {step.desc}
                                    </p>
                                </div>
                            </button>

                            {/* Connector */}
                            {idx < STEPS.length - 1 && (
                                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                                    <div className="h-px w-full rounded-full relative overflow-hidden"
                                         style={{background: isCompleted ? step.bar : 'rgba(51,65,85,.8)'}}>
                                        {isActive && (
                                            <div className="absolute inset-y-0 left-0 w-1/2 animate-pulse"
                                                 style={{background: step.bar}}/>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
