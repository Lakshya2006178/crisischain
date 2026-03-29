import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import WorkflowPanel from './components/panels/WorkflowPanel';
import LiveAlertsPanel from './components/panels/LiveAlertsPanel';
import MapPanel from './components/panels/MapPanel';
import CommunicationPanel from './components/panels/CommunicationPanel';
import ResourceTrackingPanel from './components/panels/ResourceTrackingPanel';
import AnalyticsPanel from './components/panels/AnalyticsPanel';
import IncidentActionPanel from './components/panels/IncidentActionPanel';
import { useDashboard } from './context/DashboardContext';
import { Shield, Zap, Globe, Cpu, Radio, Terminal, Target, Square, Lock, Activity, Radar, Database, BarChart3, ListFilter, AlertTriangle, Clock } from 'lucide-react';

export const SZ = {
  sidebarClosed: 80,
  sidebarOpen:   280,
  navbarH:       72,
};

function TacticalCortexOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFCC] to-transparent shadow-[0_0_10px_#00FFCC] animate-scan-y top-0 blur-[0.5px] will-change-transform" />
    </div>
  );
}

function PanelContainer({ children, label = "DATA_STREAM", status = "STABLE", accent = "#00FFCC" }) {
  return (
    <div className="group relative h-full bg-[#0E1015]/95 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden flex flex-col rounded-sm will-change-transform">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between bg-white/[0.04] border-b border-white/5 relative z-20">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
            <span className="font-mono text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">{label}</span>
         </div>
         <div className="hidden sm:flex items-center gap-3">
            <span className="font-mono text-[7px] text-white/20 uppercase tracking-widest">{status}</span>
         </div>
      </div>
      <div className="flex-1 relative z-10 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }) {
  return (
    <div className="bg-[#14171F] border border-white/5 p-6 flex flex-col gap-3 group hover:border-white/10 transition-all">
       <div className="flex justify-between items-start">
          <div className="p-2 bg-white/5 border border-white/5 text-white/20 group-hover:text-white transition-colors">
             <Icon size={16} />
          </div>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${trend > 0 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
       </div>
       <div className="mt-2">
          <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.3em] mb-1">{label}</span>
          <span className="text-3xl font-outfit font-black text-white tracking-tighter">{value}</span>
       </div>
    </div>
  );
}

export default function DashboardMain() {
  const { toasts, isSidebarOpen, closeSidebar } = useDashboard();
  const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;

  useEffect(() => {
    closeSidebar();
    const injected = document.getElementById('cc-v5');
    if (injected) injected.remove();
  }, [closeSidebar]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
      
      <TacticalCortexOverlay />

      <Sidebar />
      <TopNavbar />

      {/* ── PROPER DASHBOARD GRID ── */}
      <main
        className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-500 relative z-10 custom-scrollbar will-change-transform ${isSidebarOpen ? 'ml-sidebar-open' : 'ml-sidebar-closed'}`}
        style={{
          marginTop: SZ.navbarH,
          height: `calc(100vh - ${SZ.navbarH}px)`,
        }}
      >
        <div className="max-w-[1920px] mx-auto p-6 md:p-10 lg:p-16">
          
          {/* Functional Dashboard Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Shield size={14} className="text-[#00FFCC]" />
                  <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-[#00FFCC] uppercase">TACTICAL_OVERVIEW</span>
                </div>
                <h1 className="font-outfit text-4xl font-black tracking-tighter uppercase text-white">COMMAND_CENTER</h1>
             </div>
             
             <div className="flex gap-4 mt-6 md:mt-0">
                <button className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-mono text-[9px] font-black tracking-widest uppercase">
                   Export_Report
                </button>
                <button className="px-6 py-2.5 bg-[#00FFCC] text-black hover:brightness-110 transition-all font-mono text-[9px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,255,204,0.2)]">
                   New_Incident
                </button>
             </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
             <StatCard label="Total_Incidents" value="1,452" trend={12} icon={AlertTriangle} color="#ef4444" />
             <StatCard label="Active_Resources" value="405" trend={-4} icon={Database} color="#3b82f6" />
             <StatCard label="Resolution_Rate" value="94.2%" trend={3} icon={Activity} color="#10b981" />
             <StatCard label="Node_Latency" value="4ms" trend={-15} icon={Radio} color="#a855f7" />
          </div>

          {/* ── Main Workspace Grid ── */}
          <div className="grid grid-cols-12 gap-10 lg:gap-14">

            {/* Workflow: Sticky Top Strip */}
            <div className="col-span-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <PanelContainer label="INCIDENT_LIFECYCLE_STAGE" accent="#00FFCC">
                <WorkflowPanel />
              </PanelContainer>
            </div>

            {/* Left Column: Alerts & Comms */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
               <div className="h-[550px] animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <PanelContainer label="CRITICAL_THREAT_VECTORS" accent="#ef4444" status="MONITORING">
                    <LiveAlertsPanel />
                  </PanelContainer>
               </div>
               <div className="h-[430px] animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <PanelContainer label="INTERNAL_UPLINK_COMMUNICATIONS" accent="#a855f7">
                    <CommunicationPanel />
                  </PanelContainer>
               </div>
            </div>

            {/* Right Column: Map & Analytics */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-10 lg:gap-14">
               <div className="h-[600px] animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <PanelContainer label="REALTIME_GEOSPATIAL_INTEL" accent="#3b82f6" status="LIVE">
                    <MapPanel />
                  </PanelContainer>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                  <div className="h-[450px] md:h-[400px] animate-slide-up" style={{ animationDelay: '0.5s' }}>
                     <PanelContainer label="ANALYTICS_&_TRENDS" accent="#f59e0b">
                        <AnalyticsPanel />
                     </PanelContainer>
                  </div>
                  <div className="h-[450px] md:h-[400px] animate-slide-up" style={{ animationDelay: '0.6s' }}>
                     <PanelContainer label="PENDING_OPERATIONAL_ACTIONS" accent="#ef4444">
                        <IncidentActionPanel />
                     </PanelContainer>
                  </div>
               </div>
            </div>

            {/* Bottom: Resource Tracking (Full Width) */}
            <div className="col-span-12 animate-slide-up" style={{ animationDelay: '0.7s' }}>
               <PanelContainer label="ASSET_DEPLOYMENT_&_LOGISTICS" accent="#10b981">
                  <ResourceTrackingPanel />
               </PanelContainer>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-10 pb-10">
             <div className="flex gap-10 text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] font-black">
                <span className="flex items-center gap-3"><Clock size={12} />SYSTEM_UPTIME: 99.99%</span>
                <span className="flex items-center gap-3"><Lock size={12} />AES_256_ACTIVE</span>
             </div>
             <div className="text-[9px] font-mono text-white/5 uppercase tracking-[0.8em] font-black">
                CRISISCHAIN // TACTICAL_INTERFACE // V5.4.1
             </div>
          </div>
        </div>
      </main>

      {toasts && toasts.length > 0 && (
        <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4 pointer-events-none">
          {toasts.map(t => (
            <div key={t.id} className="font-mono px-6 py-4 backdrop-blur-3xl border border-white/5 bg-black/80 text-[10px] font-black tracking-widest uppercase shadow-2xl animate-slide-in-right"
                 style={{ color: t.type === 'error' ? '#ef4444' : '#00FFCC' }}>
                {t.message}
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-y {
          0% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
        .animate-scan-y { animation: scan-y 8s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}} />
    </div>
  );
}
