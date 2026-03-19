import { PieChart, BarChart } from 'lucide-react';

export default function AnalyticsPanel() {
    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 transition-all duration-300 flex flex-col h-full animate-fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Incident Analytics
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 flex-1 items-center overflow-y-auto custom-scrollbar pr-2 pb-2">

                {/* CSS Circular Chart Simulation */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ background: 'conic-gradient(#ef4444 0% 45%, #eab308 45% 75%, #3b82f6 75% 100%)' }}>
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex flex-col items-center justify-center absolute">
                            <span className="text-xl font-bold text-slate-100 font-mono">142</span>
                            <span className="text-[10px] text-slate-500 leading-none">Total</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col w-full gap-1.5 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> Critical</div>
                            <span className="font-mono text-slate-300">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-yellow-500 rounded-sm"></div> Warning</div>
                            <span className="font-mono text-slate-300">30%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-sm"></div> Resolved</div>
                            <span className="font-mono text-slate-300">25%</span>
                        </div>
                    </div>
                </div>

                {/* CSS Bar Chart Simulation */}
                <div className="flex flex-col p-4 bg-slate-900 rounded-xl border border-slate-700/50 w-full h-full justify-between hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-400 font-semibold group cursor-pointer">
                        <BarChart className="w-4 h-4" /> 7-Day Trend
                    </div>

                    <div className="flex items-end justify-between h-24 w-full gap-2 px-1 relative">
                        {/* Simple grid line */}
                        <div className="absolute top-1/2 left-0 w-full border-t border-slate-800 border-dashed z-0"></div>

                        {/* Bars */}
                        {[40, 65, 30, 85, 50, 45, 90].map((h, i) => (
                            <div key={i} className="w-full bg-slate-800 rounded-t-sm relative group overflow-hidden z-10 hover:bg-slate-700 transition-colors" style={{ height: '100%' }}>
                                <div className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 group-hover:brightness-125
                    ${h > 70 ? 'bg-red-500' : h > 40 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                    style={{ height: `${h}%` }}>
                                </div>
                                {/* Tooltip on hover */}
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-950 text-slate-300 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                    {h} Alerts
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between w-full mt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-1">
                        <span>M</span>
                        <span>T</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>S</span>
                        <span>S</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
