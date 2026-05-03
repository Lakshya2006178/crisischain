import React, { useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Map as MapIcon, Crosshair, Navigation, Target, Zap, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createNumberedIcon = (number, color) => {
    return L.divIcon({
        className: 'custom-numbered-icon',
        html: `<div style="background-color: ${color}; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 0 10px ${color}; font-size: 12px; font-family: monospace;">${number}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

function MapUpdater({ alerts }) {
    const map = useMap();
    useEffect(() => {
        if (alerts && alerts.length > 0) {
            const coords = alerts
                .filter(a => a.coordinates && a.coordinates !== 'N/A' && a.coordinates !== 'Pending')
                .map(a => {
                    const [lat, lng] = a.coordinates.split(',').map(Number);
                    return [lat, lng];
                })
                .filter(c => !isNaN(c[0]) && !isNaN(c[1]));
            
            if (coords.length > 0) {
                const bounds = L.latLngBounds(coords);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            }
        }
    }, [alerts, map]);
    return null;
}

export default function MapPanel() {
    const { addToast, liveAlerts } = useDashboard();

    // Map liveAlerts to include color for markers
    const mapAlerts = (liveAlerts || []).map(a => ({
        ...a,
        color: a.color || (a.severity === 'Critical' || a.severity === 'High' ? '#ef4444' : a.severity === 'Medium' ? '#f59e0b' : '#3b82f6')
    }));

    return (
        <div className="flex flex-col h-full w-full bg-[#0A0A0B]/20 relative overflow-hidden backdrop-blur-3xl group">
            
            {/* Header HUD */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02] relative z-10">
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
                <div className="absolute inset-0 opacity-20 pointer-events-none z-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 255, 204, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.1) 1px, transparent 1px)',
                        backgroundSize: '3rem 3rem',
                    }}
                />
                
                {/* Scanning Radar Sweep */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden origin-center z-10">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-blue-500/30 rounded-full animate-radar-spin" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/20 rounded-full animate-radar-spin-reverse" />
                </div>

                {/* Leaflet Map Integration */}
                <div className="absolute inset-0 z-0">
                    <MapContainer center={[12.8719, 74.8422]} zoom={12} style={{ height: '100%', width: '100%', backgroundColor: '#0B1220' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <MapUpdater alerts={mapAlerts} />
                        {mapAlerts.map((alert, idx) => {
                            if (!alert.coordinates || alert.coordinates === 'N/A' || alert.coordinates === 'Pending') return null;
                            const [lat, lng] = alert.coordinates.split(',').map(Number);
                            if (isNaN(lat) || isNaN(lng)) return null;
                            return (
                                <Marker 
                                    key={alert.id}
                                    position={[lat, lng]}
                                    icon={createNumberedIcon(idx + 1, alert.color)}
                                >
                                    <Popup className="custom-popup">
                                        <div className="font-poppins font-bold">{alert.title}</div>
                                        <div className="text-xs">{alert.severity} • {alert.status}</div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* Legend HUD */}
                <div className="absolute bottom-10 right-10 flex flex-col gap-4 p-8 bg-black/60 backdrop-blur-2xl border border-white/5 opacity-40 hover:opacity-100 transition-opacity z-10">
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
