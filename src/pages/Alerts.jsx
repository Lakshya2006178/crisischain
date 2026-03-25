import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreHorizontal, Flame, AlertTriangle, RefreshCw, 
  Map as MapIcon, Plus, Minus, Maximize, Bell, ShieldAlert
} from 'lucide-react';
import AlertToast from '../components/AlertToast';
import CriticalSidebar from '../components/CriticalSidebar';

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, priority: 'P1', title: 'Water Level breached', message: 'Zone D: Critical breach detected at levee sector 7', time: '14:46', status: 'New', type: 'flood' },
    { id: 2, priority: 'P2', title: 'Power failure', message: 'Hospital C: Primary grid down, backup engaged', time: '14:45', status: 'New', type: 'power' },
    { id: 3, priority: 'P1', title: 'Fire Outbreak', message: 'Conbinent: Multiple structures involved', time: '14:42', status: 'Active', type: 'fire' },
  ]);
  const [toasts, setToasts] = useState([]);
  const [isCriticalSidebarOpen, setIsCriticalSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulation of incoming data streams
  useEffect(() => {
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
      if (Math.random() > 0.4) { // 60% chance every 10 seconds
        const newAlertBase = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert = {
          ...newAlertBase,
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          status: 'New'
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toasts for P1 or High priority
        if (newAlert.priority === 'P1' || newAlert.priority === 'High') {
          setToasts(prev => [...prev, newAlert]);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unresolvedCriticalAlerts = alerts.filter(a => 
    (a.priority === 'P1' || a.priority === 'High') && a.status === 'New'
  );

  return (
    <div className="flex h-screen bg-[#0E1525] text-slate-300 font-sans overflow-hidden relative">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <AlertToast alert={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>

      {/* Critical Sidebar Toggle (Floating Button for attention) */}
      <button 
        onClick={() => setIsCriticalSidebarOpen(true)}
        className="fixed bottom-8 right-8 z-[25] bg-red-600 p-4 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] border-4 border-[#0E1525] hover:scale-110 transition-transform animate-bounce group"
      >
        <ShieldAlert size={28} className="text-white group-hover:rotate-12 transition-transform" />
        {unresolvedCriticalAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-600">
            {unresolvedCriticalAlerts.length}
          </span>
        )}
      </button>

      <CriticalSidebar 
        alerts={alerts} 
        isOpen={isCriticalSidebarOpen} 
        setIsOpen={setIsCriticalSidebarOpen} 
      />


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-[#0E1525] border-b border-slate-800/80 flex items-center justify-center px-6 flex-shrink-0">
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search Alerts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A233A] border border-slate-700/50 text-sm focus:outline-none focus:border-blue-500/50 rounded-full py-2 pl-10 pr-4 text-slate-300 placeholder-slate-500 transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[800px]">
            
            {/* Column 1: Notification Origin */}
            <div className="flex flex-col gap-6">
              {/* Map Card */}
              <div className="bg-[#161C30] rounded-xl border border-slate-800/80 p-5 flex flex-col min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold tracking-widest text-slate-300 uppercase flex items-center gap-2">
                    <MapIcon size={14} className="text-blue-400" />
                    Notification Origin
                  </h3>
                  <button className="text-slate-500 hover:text-slate-300"><MoreHorizontal size={18} /></button>
                </div>
                
                <div className="flex-1 bg-[#0E1525] rounded-lg border border-slate-800/50 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                       <path d="M20,10 L30,20 L40,15 L60,40 L50,60 L70,80 L40,90 L20,70 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </svg>
                  </div>
                  
                  <div className="relative w-full max-w-[200px] aspect-[3/4]">
                    <div className="absolute top-[30%] left-[30%] w-3 h-3 rounded-full bg-amber-400 border border-[#161C30] z-10 animate-pulse ring-4 ring-amber-400/20"></div>
                    <div className="absolute top-[40%] left-[50%] w-3 h-3 rounded-full bg-blue-500 border border-[#161C30] z-10"></div>
                    <div className="absolute top-[45%] left-[25%] w-3 h-3 rounded-full bg-blue-500 border border-[#161C30] z-10"></div>
                    <div className="absolute top-[20%] left-[60%] w-3 h-3 rounded-full bg-orange-500 border border-[#161C30] z-10"></div>
                    <div className="absolute top-[60%] left-[45%] z-10">
                       <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] filter"></div>
                    </div>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 30,30 Q 40,35 50,40" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" />
                      <path d="M 50,40 Q 35,45 25,45" fill="none" stroke="#3b82f6" strokeWidth="1" />
                      <path d="M 30,30 Q 35,45 45,60" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                    </svg>
                  </div>
                  
                  <div className="absolute right-3 top-3 flex flex-col gap-2">
                     <button className="bg-[#1A233A] border border-slate-700 rounded p-1.5 text-slate-400 hover:text-white"><Maximize size={14}/></button>
                  </div>
                  <div className="absolute right-3 bottom-3 flex flex-col gap-1 bg-[#1A233A] border border-slate-700 rounded p-1">
                     <button className="p-1 text-slate-400 hover:text-white border-b border-slate-700"><Plus size={14}/></button>
                     <button className="p-1 text-slate-400 hover:text-white"><Minus size={14}/></button>
                  </div>
                </div>
              </div>

              {/* Notification Origins List Card */}
              <div className="bg-[#161C30] rounded-xl border border-slate-800/80 p-5 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold tracking-widest text-slate-300 uppercase">Notification Origins</h3>
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <RefreshCw size={14} className={alerts.length > 0 ? 'animate-spin-slow' : ''} />
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {alerts.slice(0, 8).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between text-sm group">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all ${
                          alert.priority === 'P1' ? 'bg-red-500' : 
                          alert.priority === 'P2' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-slate-300 group-hover:text-white transition-colors">{alert.title}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[10px]">[{alert.time}]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Inter-Agency Alerts */}
            <div className="bg-[#161C30] rounded-xl border border-slate-800/80 p-5 flex flex-col h-full relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-blue-400" />
                  <h3 className="text-xs font-bold tracking-widest text-slate-300 uppercase">Inter-Agency Monitoring</h3>
                </div>
                <div className="flex gap-2">
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter self-center">Live Feed</span>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse self-center"></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`
                      bg-[#1A233A] rounded-lg p-4 border transition-all duration-300
                      ${alert.priority === 'P1' 
                        ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] border-l-[3px] border-l-red-500' 
                        : 'border-slate-700/50 border-l-[3px] border-l-slate-500'}
                      flex justify-between items-start gap-4 hover:bg-[#202945]
                    `}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-slate-200 line-clamp-1">
                        <span className="text-slate-500 font-mono mr-2">[{alert.time}]</span>
                        <span className={`font-bold mr-2 ${alert.priority === 'P1' ? 'text-red-400' : 'text-blue-400'}`}>
                          {alert.priority}:
                        </span>
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed italic">
                        {alert.message}
                      </p>
                    </div>
                    <div className={`
                      px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase
                      ${alert.status === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}
                    `}>
                      {alert.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Unresolved Incident List (Critical Only) */}
            <div className="bg-[#161C30] rounded-xl border border-slate-800/80 p-5 flex flex-col h-full bg-gradient-to-b from-[#161C30] to-[#1a1313]/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-500" />
                  <h3 className="text-xs font-bold tracking-widest text-slate-300 uppercase">Unresolved Incident List</h3>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar flex-1">
                {unresolvedCriticalAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-slate-500 italic">
                    <p className="text-xs">All critical incidents resolved</p>
                  </div>
                ) : (
                  unresolvedCriticalAlerts.map((incident) => (
                    <div 
                      key={incident.id} 
                      className="bg-[#1A233A] rounded-lg border border-red-500/20 p-4 relative overflow-hidden group hover:border-red-500/40 transition-colors"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rotate-45 translate-x-8 -translate-y-8"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded mt-0.5 z-10 transition-colors ${incident.type === 'fire' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                            {incident.type === 'fire' ? <Flame size={16} /> : <AlertTriangle size={16} />}
                          </div>
                          <div className="z-10">
                            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight group-hover:text-red-400 transition-colors">{incident.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-tighter">Emergency P1 • {incident.time}</p>
                          </div>
                        </div>
                        <div className="bg-[#351C1C] text-red-500 border border-red-500/30 px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase z-10">
                          Critical
                        </div>
                      </div>
                      <div className="flex gap-2 z-10 relative">
                        <button className="flex-1 py-1.5 px-3 rounded text-[10px] font-bold text-blue-400 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all uppercase tracking-widest">
                          Acknowledge
                        </button>
                        <button className="flex-1 py-1.5 px-3 rounded text-[10px] font-bold text-red-500 border border-red-600/30 bg-red-600/10 hover:bg-red-600/20 transition-all uppercase tracking-widest">
                          Escalate
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Global styles override */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(14, 21, 37, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
}
