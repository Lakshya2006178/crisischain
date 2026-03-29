import { useDashboard } from '../../context/DashboardContext';
import { Map as MapIcon, Crosshair, Navigation, Target, Zap, Globe } from 'lucide-react';

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
        <div className="flex flex-col h-full w-full bg-[#0A0A0B]/20 relative overflow-hidden backdrop-blur-3xl group">
            
            {/* Header HUD */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02] relative">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-blue-500/20 bg-blue-500/5 flex items-center justify-center">
                        <MapIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h4 className="font-outfit font-black text-xl tracking-tight text-white uppercase leading-none mb-1">GEOSPATIAL_INTEL</h4>
                        <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">SAT_LINK: AETHER_GRID_STABLE</p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <button
                        onClick={() => addToast('Recalibrating GPS...', 'info')}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Crosshair className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => addToast('Engaging Drone Uplink...', 'info')}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Navigation className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Map Body */}
            <div className="flex-1 relative overflow-hidden bg-black/40 border-b border-white/5">
                
                {/* Advanced Grid Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 255, 204, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.1) 1px, transparent 1px)',
                        backgroundSize: '3rem 3rem',
                    }}
                />
                
                {/* Scanning Radar Sweep */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden origin-center">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-blue-500/30 rounded-full animate-radar-spin" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/20 rounded-full animate-radar-spin-reverse" />
                </div>

                {/* Topographic Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,150 Q150,250 300,150 T600,150 T900,150" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="20%" cy="30%" r="50" fill="none" stroke="#fff" strokeWidth="1" />
                    <circle cx="70%" cy="60%" r="80" fill="none" stroke="#fff" strokeWidth="1" />
                </svg>

                {/* Markers */}
                {markers.map(marker => (
                    <div
                        key={marker.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/marker z-10"
                        style={{ top: marker.top, left: marker.left }}
                    >
                        <div className="relative flex items-center justify-center">
                            {marker.pulse && (
                                <div className={`absolute w-12 h-12 rounded-full animate-[ping_4s_linear_infinite] opacity-30 ${marker.type === 'critical' ? 'bg-red-500' : 'bg-blue-400'}`} />
                            )}

                            <div className={`w-3 h-3 transition-all duration-700 group-hover/marker:scale-[3] ${marker.type === 'critical' ? 'bg-red-500' : marker.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
                            
                            {/* Marker Metadata HUD */}
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/10 opacity-0 group-hover/marker:opacity-100 transition-all duration-500 whitespace-nowrap z-20 pointer-events-none">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${marker.type === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`} />
                                    <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">{marker.type === 'critical' ? 'EVENT_ALPHA' : 'EVENT_STABLE'}</span>
                                </div>
                                <div className="font-mono text-[8px] text-white/40 tracking-[0.2em]">LAT_SYNC: {marker.top} | LNG_SYNC: {marker.left}</div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Legend HUD */}
                <div className="absolute bottom-10 right-10 flex flex-col gap-4 p-8 bg-black/60 backdrop-blur-2xl border border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                    {[
                        { label: 'CRITICAL_HIT', color: '#ef4444' },
                        { label: 'THREAT_WARN', color: '#fbbf24' },
                        { label: 'ACTIVE_SYNK', color: '#3b82f6' },
                        { label: 'SECURE_ZONE', color: '#10b981' }
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
                            <span className="font-mono text-[8px] font-black uppercase text-white tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Footer Telemetry */}
            <div className="px-6 py-4 bg-black flex justify-between items-center bg-white/[0.02]">
                <div className="flex gap-10">
                    <div className="flex items-center gap-3">
                         <Globe className="w-3.5 h-3.5 text-white/20" />
                         <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase italic">COORD_SYS: WGS84_OPTIMIZED</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <Zap className="w-3.5 h-3.5 text-yellow-500/40" />
                         <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase italic">SIGNAL: 44.2dBm</span>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes radar-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes radar-spin-reverse {
                    from { transform: translate(-50%, -50%) rotate(360deg); }
                    to { transform: translate(-50%, -50%) rotate(0deg); }
                }
                .animate-radar-spin { animation: radar-spin 10s linear infinite; }
                .animate-radar-spin-reverse { animation: radar-spin-reverse 15s linear infinite; }
            `}} />
        </div>
    );
}
