import { useDashboard } from '../../context/DashboardContext';
import { AlertTriangle, ClipboardCheck, Siren, HeartHandshake } from 'lucide-react';

const stepsMeta = [
    { id: 1, title: 'Alert Detected', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/20' },
    { id: 2, title: 'Damage Assessment', icon: ClipboardCheck, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
    { id: 3, title: 'Active Response', icon: Siren, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { id: 4, title: 'Recovery Phase', icon: HeartHandshake, color: 'text-green-500', bg: 'bg-green-500/20' }
];

export default function WorkflowPanel() {
    const { workflowId, advanceWorkflow } = useDashboard();

    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            {stepsMeta.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === workflowId;
                const isCompleted = step.id < workflowId;
                const finalBg = isActive ? step.bg : isCompleted ? step.bg : 'bg-slate-800';
                const finalColor = isActive || isCompleted ? step.color : 'text-slate-500';

                return (
                    <div key={step.id} className="flex items-center w-full group">
                        <div
                            onClick={() => { if (isActive && step.id < 4) advanceWorkflow() }}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 w-full ${isActive ? 'bg-slate-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] ring-1 ring-slate-500/30 scale-[1.02] cursor-pointer hover:bg-slate-600' : 'hover:bg-slate-700/50 hover:scale-[1.02]'}`}>
                            <div className={`p-3 rounded-full mb-3 ${finalBg} ${isActive ? 'animate-pulse ring-4 ring-slate-800' : ''}`}>
                                <Icon className={`w-6 h-6 ${finalColor}`} />
                            </div>
                            <h3 className={`font-semibold text-sm uppercase tracking-wider ${isCompleted || isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                                {step.title}
                            </h3>
                            <span className={`text-xs mt-1 ${isCompleted ? 'text-green-400' : isActive ? 'text-yellow-400' : 'text-slate-600'}`}>
                                {isCompleted ? 'Completed' : isActive ? 'Click to Advance' : 'Pending'}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index !== stepsMeta.length - 1 && (
                            <div className="hidden md:flex flex-1 items-center px-4 w-full">
                                <div className={`h-1 w-full rounded-full ${isCompleted ? step.color.replace('text', 'bg') : 'bg-slate-700'} relative overflow-hidden`}>
                                    {isActive && <div className="absolute top-0 left-0 h-full w-1/2 bg-slate-500 animate-pulse"></div>}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
