import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreHorizontal, Flame, AlertTriangle, RefreshCw, 
  Map as MapIcon, Plus, Minus, Maximize, Bell, ShieldAlert,
  Zap, Clock, Globe, Terminal, Activity
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SZ } from '../DashboardMain';
import { useDashboard } from '../context/DashboardContext';

export default function Alerts() {
  const { isSidebarOpen } = useDashboard();
  const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [alerts, setAlerts] = useState([
    { id: 1, priority: 'P1', title: 'Water Level breached', message: 'Zone D: Critical breach detected at levee sector 7', time: '14:46', status: 'New', type: 'flood' },
    { id: 2, priority: 'P2', title: 'Power failure', message: 'Hospital C: Primary grid down, backup engaged', time: '14:45', status: 'New', type: 'power' },
    { id: 3, priority: 'P1', title: 'Fire Outbreak', message: 'Conbinent: Multiple structures involved', time: '14:42', status: 'Active', type: 'fire' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    
    const alertTypes = [
      { priority: 'P1', title: 'Critical Rescue', message: 'Zone C: Rescue needed at Central Ave - Building collapse', type: 'fire' },
      { priority: 'P1', title: 'Medical Emergency', message: 'Sector 4: Multiple casualties reported', type: 'medical' },
      { priority: 'High', title: 'Infrastructure Failure', message: 'Main Bridge: Structural instability detected', type: 'hazard' },
      { priority: 'P1', title: 'Seismic Activity', message: 'Zone A: Magnitude 4.2 detected', type: 'geology' },
      { priority: 'P1', title: 'Chemical Leak', message: 'Industrial Zone 3: Toxic plume detected', type: 'hazard' },
      { priority: 'P2', title: 'Traffic Jam', message: 'Evacuation Route 1 blocked', type: 'transport' },
      { priority: 'P3', title: 'Resource Low', message: 'Shelter 4: Water supplies at 10%', type: 'resource' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const newAlertBase = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert = {
          ...newAlertBase,
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          status: 'New'
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }, 12000);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(interval);
    };
  }, []);

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unresolvedCriticalAlerts = alerts.filter(a => 
    (a.priority === 'P1' || a.priority === 'High') && a.status === 'New'
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
      
      {/* AMBIENT MESH BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full blur-[200px] opacity-[0.05] bg-red-600 transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x - 500}px, ${mousePos.y - 500}px)` }}
        />
        <div className="absolute bottom-[-15%] left-[-15%] w-[800px] h-[800px] rounded-full blur-[220px] opacity-[0.02] bg-blue-900" />
      </div>

      <Sidebar />
      <TopNavbar />

      <main
        className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-500 relative z-10 custom-scrollbar"
        style={{
          marginLeft: ml,
          marginTop: SZ.navbarH,
          height: `calc(100vh - ${SZ.navbarH}px)`,
        }}
      >
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="mb-12 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-8 bg-red-500/40" />
                  <span className="text-[10px] font-mono tracking-[0.6em] text-red-500 uppercase">Emergency_Cortex_Stream</span>
              </div>
              <h1 className="font-outfit text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
                INTER-AGENCY<br />
                <span className="bg-gradient-to-r from-red-500 via-white to-white/40 bg-clip-text text-transparent italic">MONITORING_CORTEX</span>
              </h1>
          </div>

          <div className="grid grid-cols-12 gap-8 animate-slide-up">
            
            {/* Column 1: Notification Origin */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              <div className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 group">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                  <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-white/40 uppercase flex items-center gap-3">
                    <MapIcon size={14} className="text-[#00FFCC]" />
                    GEOSPATIAL_ORIGIN
                  </h3>
                  <div className="flex gap-4">
                    <Maximize size={14} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
                
                <div className="aspect-square bg-black/40 rounded border border-white/5 relative overflow-hidden flex items-center justify-center group-hover:border-[#00FFCC]/20 transition-all">
                  <div className="absolute inset-0 opacity-10">
                     <svg viewBox="0 0 100 100" className="w-full h-full stroke-white/40 fill-none stroke-[0.2]">
                        <path d="M10,10 L30,20 L50,15 L90,40 L70,80 L40,90 L10,60 Z" />
                        <circle cx="50" cy="50" r="30" />
                        <line x1="0" y1="50" x2="100" y2="50" />
                        <line x1="50" y1="0" x2="50" y2="100" />
                     </svg>
                  </div>
                  
                  <div className="relative w-full h-full p-10">
                    <div className="absolute top-[30%] left-[30%] w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]" />
                    <div className="absolute top-[40%] left-[50%] w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                    <div className="absolute top-[60%] left-[45%]">
                       <ShieldAlert className="w-6 h-6 text-red-500 animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 flex-1">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                  <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-white/40 uppercase">SIGNAL_NODES</h3>
                  <RefreshCw size={14} className="text-white/20 animate-spin-slow" />
                </div>
                
                <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                  {alerts.slice(0, 8).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          alert.priority === 'P1' ? 'bg-red-500' : 'bg-blue-400'
                        }`} />
                        <span className="text-[11px] font-mono font-bold tracking-widest text-white/40 group-hover:text-white transition-colors uppercase">{alert.title}</span>
                      </div>
                      <span className="text-white/10 font-mono text-[9px]">[{alert.time}]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Live Feed */}
            <div className="col-span-12 lg:col-span-4 bg-white/5 border border-white/5 backdrop-blur-3xl p-8 flex flex-col h-full relative overflow-hidden">
               <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-[#00FFCC]" />
                  <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-white/40 uppercase">LIVE_UPLINK_FEED</h3>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[8px] font-mono text-green-500 uppercase tracking-widest font-black">Sync_Stable</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`
                      bg-white/[0.02] border p-6 transition-all duration-500 hover:bg-white/[0.05]
                      ${alert.priority === 'P1' ? 'border-red-500/20' : 'border-white/5'}
                    `}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <span className="font-mono text-[9px] text-white/20 tracking-widest">[{alert.time}]</span>
                         <span className={`text-[8px] font-mono font-black tracking-[0.3em] uppercase px-3 py-1 border ${alert.priority === 'P1' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>
                            {alert.priority}
                         </span>
                      </div>
                      <h4 className="font-outfit font-black text-lg text-white uppercase tracking-tight">{alert.title}</h4>
                      <p className="font-mono text-[10px] text-white/40 leading-relaxed uppercase italic">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Critical Dashboard */}
            <div className="col-span-12 lg:col-span-4 bg-white/5 border border-white/5 backdrop-blur-3xl p-10 flex flex-col h-full relative">
               <div className="flex items-center gap-3 mb-12 pb-4 border-b border-white/5">
                  <ShieldAlert size={18} className="text-red-500" />
                  <h3 className="text-[11px] font-mono font-bold tracking-[0.4em] text-white/40 uppercase">CRITICAL_ACTION_QUEUE</h3>
               </div>
              
              <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {unresolvedCriticalAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/10 uppercase tracking-[0.4em] font-mono text-[10px]">
                     No_Active_Threats
                  </div>
                ) : (
                  unresolvedCriticalAlerts.map((incident) => (
                    <div 
                      key={incident.id} 
                      className="bg-red-500/[0.03] border border-red-500/10 p-8 hover:border-red-500/30 transition-all relative group"
                    >
                      <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-6">
                          <div className={`p-4 bg-red-500/10 border border-red-500/20 text-red-500`}>
                            {incident.type === 'fire' ? <Flame size={24} /> : <AlertTriangle size={24} />}
                          </div>
                          <div>
                            <h4 className="font-outfit font-black text-xl text-white uppercase tracking-tight group-hover:text-red-500 transition-colors leading-tight">{incident.title}</h4>
                            <p className="text-[9px] font-mono font-black text-red-500/60 mt-2 uppercase tracking-widest">{incident.priority} // {incident.time} // SECTOR_ALPHA</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <button className="flex-1 py-4 bg-white/5 border border-white/10 text-[9px] font-mono font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                            ACKNOWLEDGE
                          </button>
                          <button className="flex-1 py-4 bg-red-600 text-[9px] font-mono font-black text-white hover:brightness-110 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            ESCALATE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.2); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
