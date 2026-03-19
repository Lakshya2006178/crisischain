import { useDashboard } from '../../context/DashboardContext';
import { Map, Crosshair, Navigation } from 'lucide-react';

const markers = [
    { id: 1, top: '25%', left: '30%', type: 'critical', pulse: true },
    { id: 2, top: '45%', left: '60%', type: 'active', pulse: false },
    { id: 3, top: '70%', left: '25%', type: 'safe', pulse: false },
    { id: 4, top: '60%', left: '75%', type: 'critical', pulse: true },
    { id: 5, top: '35%', left: '80%', type: 'warning', pulse: true },
];

export default function MapPanel() {
    const { addToast } = useDashboard();

    return (
        <div className="bg-gray-800 backdrop-blur-lg bg-white/5 rounded-xl p-4 shadow-lg border border-gray-700 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 transition-all duration-300 flex flex-col h-full animate-fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-400" />
                    Tactical Map View
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => addToast('Recalibrating GPS Centering...', 'info')}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                    >
                        <Crosshair className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => addToast('Activating Drone View...', 'info')}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                    >
                        <Navigation className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden relative group">

                {/* Map Grid Background Simulation */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.4) 1px, transparent 1px)',
                        backgroundSize: '2rem 2rem',
                        backgroundPosition: 'center center',
                    }}
                />

                {/* Topographic Lines Simulation */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,150 Q150,250 300,150 T600,150 T900,150" fill="none" stroke="#475569" strokeWidth="2" />
                    <path d="M0,250 Q200,350 400,200 T800,250 T1200,200" fill="none" stroke="#475569" strokeWidth="1" />
                    <path d="M-100,50 Q100,150 300,50 T700,50 T1100,50" fill="none" stroke="#475569" strokeWidth="1" />
                </svg>

                {/* Radar Sweep Animation Simulation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden origin-center text-blue-500/10">
                    <div className="w-[1000px] h-[1000px] rounded-full border border-blue-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[ping_10s_linear_infinite]" />
                </div>

                {/* Dynamic Markers */}
                {markers.map(marker => (
                    <div
                        key={marker.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/marker cursor-crosshair z-10"
                        style={{ top: marker.top, left: marker.left }}
                    >
                        <div className="relative flex items-center justify-center">
                            {marker.pulse && (
                                <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-50 ${marker.type === 'critical' ? 'bg-red-500' :
                                    marker.type === 'warning' ? 'bg-yellow-500' :
                                        marker.type === 'safe' ? 'bg-green-500' : 'bg-blue-500'
                                    }`} />
                            )}

                            <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 ${marker.type === 'critical' ? 'bg-red-500 border-2 border-slate-900' :
                                marker.type === 'warning' ? 'bg-yellow-500 border-2 border-slate-900' :
                                    marker.type === 'safe' ? 'bg-green-500 border-2 border-slate-900' :
                                        'bg-blue-400 border-2 border-slate-900'
                                }`} />

                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-xs font-mono px-2 py-1 rounded border border-slate-700 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-20 pointer-events-none">
                                {marker.type === 'critical' ? 'CRITICAL EVAC' : marker.type.toUpperCase()} - {marker.top},{marker.left}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Map Overlays */}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> Critical
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" /> Warning
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Active Response
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> Safe Zone
                    </div>
                </div>

            </div>
        </div>
    );
}
