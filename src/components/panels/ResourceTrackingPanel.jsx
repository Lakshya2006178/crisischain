import { useDashboard } from '../../context/DashboardContext';
import { Truck, Activity, Package, Battery, Zap, ChevronRight, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResourceTrackingPanel() {
    const { resources, getIcon } = useDashboard();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0B]/20 relative overflow-hidden  group">
            
            {/* Header Status Bar */}
            <div className="flex items-center justify-between px-10 py-8 border-b border-[#1F2937] bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-all"
                 onClick={() => navigate('/resources')}>
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h4 className="font-poppins font-black text-xl tracking-tight text-white uppercase leading-none mb-1">RESOURCES</h4>
                        <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">STOCK LEVEL: {resources.length} ITEMS</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                   <span className="font-mono text-[9px] text-emerald-500 font-black tracking-widest uppercase italic">CONNECTED</span>
                </div>
            </div>

            {/* Asset List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                {resources.map((res) => {
                    const Icon = getIcon(res.iconName);
                    const pct = Math.min(Math.round((res.deployed / res.total) * 100), 100);
                    const barColor = pct >= 80 ? '#ef4444' : pct >= 60 ? '#fbbf24' : '#00FFCC';
                    const textColor = pct >= 80 ? 'text-red-500' : pct >= 60 ? 'text-yellow-500' : 'text-[#14B8A6]';

                    return (
                        <div key={res.id} className="group/asset px-10 py-8 hover:bg-white/[0.02] transition-all duration-500 flex items-center gap-8 border-l-2 border-l-transparent hover:border-l-emerald-500/40">
                            {/* Icon Pod */}
                            <div className="flex-shrink-0 w-12 h-12 bg-[#1F2937] border border-[#1F2937] flex items-center justify-center transition-all group-hover/asset:border-emerald-500/40 group-hover/asset:bg-emerald-500/5">
                                <Icon className="w-5 h-5 text-[#6B7280] group-hover/asset:text-emerald-400 transition-colors" />
                            </div>

                            {/* Data Block */}
                            <div className="flex-1 min-w-0 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-poppins font-black text-lg tracking-tight uppercase leading-none text-white group-hover/asset:text-emerald-400 transition-colors">
                                        {res.name}
                                    </h5>
                                    <div className="font-mono text-[10px] font-black tracking-widest text-white/10 uppercase">
                                        <b className="text-[#D1D5DB]">{res.deployed}</b> / {res.total}
                                    </div>
                                </div>
                                
                                {/* Progress HUD */}
                                <div className="relative h-2 bg-white/[0.05] overflow-hidden">
                                     <div className="absolute top-0 left-0 h-full transition-all duration-1000 bg-gradient-to-r from-transparent via-current to-current shadow-[0_0_10px_currentColor]"
                                          style={{ width: `${pct}%`, color: barColor }} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[8px] font-black tracking-widest uppercase text-[#6B7280]">CAPACITY</span>
                                    <span className={`font-mono text-[9px] font-black tracking-widest uppercase italic ${textColor}`}>
                                        {pct >= 80 ? 'SUPPLY CRITICAL' : pct >= 60 ? 'MODERATE' : 'OPTIMAL'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View Full Inventory Action */}
            <div className="p-10 border-t border-[#1F2937] bg-black/40">
                <button
                    onClick={() => navigate('/resources')}
                    className="w-full h-12 bg-white/[0.03] hover:bg-emerald-500 text-[#9CA3AF] hover:text-black border border-[#1F2937] hover:border-transparent transition-all duration-500 font-mono text-[10px] font-black tracking-[0.5em] uppercase flex items-center justify-center gap-4 group/btn shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                >
                    VIEW FULL INVENTORY
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </button>
            </div>
        </div>
    );
}
