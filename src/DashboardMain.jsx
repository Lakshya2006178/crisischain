import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { useDashboard } from './context/DashboardContext';
import { Shield, Database, AlertTriangle, Activity, Radio, MapPin, Clock } from 'lucide-react';

export const SZ = {
  sidebarClosed: 72,
  sidebarOpen:   260,
  navbarH:       72,
};

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-[#111827] border border-[#1F2937] p-6 flex flex-col gap-3 rounded-md shadow-sm transition-all hover:border-[#374151]">
       <div className="flex justify-between items-start">
          <div className="p-2 bg-[#1F2937] text-gray-400 rounded">
             <Icon size={18} />
          </div>
       </div>
       <div className="mt-2">
          <span className="block text-xs font-poppins text-gray-400 uppercase tracking-wider mb-1 font-semibold">{label}</span>
          <span className="text-3xl font-poppins font-bold text-gray-100">{value}</span>
       </div>
    </div>
  );
}

export default function DashboardMain() {
  const { toasts, isSidebarOpen, closeSidebar, stats, alerts, updateStatus } = useDashboard();
  const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;

  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B1220] text-gray-200 font-inter">
      
      <Sidebar />
      <TopNavbar />

      <main
        className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 relative z-10 custom-scrollbar will-change-transform ${isSidebarOpen ? 'ml-sidebar-open' : 'ml-sidebar-closed'}`}
        style={{
          marginTop: SZ.navbarH,
          height: `calc(100vh - ${SZ.navbarH}px)`,
        }}
      >
        <div className="max-w-[1600px] mx-auto fluid-p">
          
          {/* Functional Dashboard Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-[#1F2937] pb-6">
             <div className="space-y-1">
                 <div className="flex items-center gap-2">
                  <Shield size={16} className="text-teal-500" />
                  <span className="text-xs font-poppins font-bold tracking-widest text-teal-500 uppercase">System Overview</span>
                </div>
                <h1 className="font-poppins text-3xl font-bold text-gray-100">Command Center</h1>
             </div>
             
             <div className="flex gap-3 mt-4 md:mt-0">
                 <button className="px-4 py-2 bg-[#1F2937] border border-[#374151] hover:bg-gray-700 transition-all font-poppins text-xs font-semibold rounded shadow-sm text-gray-200">
                    Export Report
                 </button>
             </div>
          </div>

          {/* Quick Stats Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
             <StatCard label="Total Incidents (24h)" value={stats.total} icon={AlertTriangle} color="#ef4444" />
             <StatCard label="Active Cases" value={stats.active} icon={Database} color="#3b82f6" />
             <StatCard label="Resolved Cases" value={stats.resolved} icon={Radio} color="#a855f7" />
             <StatCard label="Avg Response Time" value={`${stats.avgResponseTime !== 'N/A' && !isNaN(stats.avgResponseTime) ? stats.avgResponseTime.toFixed(1) : '0'}m`} icon={Activity} color="#10b981" />
          </div>

          {/* Incident Table */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-md shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="px-6 py-4 border-b border-[#1F2937] flex justify-between items-center bg-[#1F2937]/30">
              <h2 className="font-poppins font-semibold text-gray-100 flex items-center gap-2">
                <Radio size={18} className="text-teal-500" /> Live Incident Feed
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1F2937] bg-[#111827]">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {alerts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                        No active incidents found.
                      </td>
                    </tr>
                  ) : (
                    alerts.slice(0, 10).map((alert) => (
                      <tr key={alert.id} className="hover:bg-[#1F2937]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          {alert.type ? (alert.type.charAt(0).toUpperCase() + alert.type.slice(1)) : 'General'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center gap-2">
                          <MapPin size={14} className="text-gray-500" /> {alert.location || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            alert.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            alert.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                            alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {alert.severity ? alert.severity.toUpperCase() : 'LOW'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            alert.status === 'active' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            alert.status === 'responding' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-green-500/10 text-green-500 border-green-500/20'
                          }`}>
                            {alert.status ? alert.status.toUpperCase() : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           {alert.status === 'active' && (
                              <button 
                                onClick={() => updateStatus(alert.id, 'responding')}
                                className="text-teal-500 hover:text-teal-400 transition-colors"
                              >
                                Dispatch
                              </button>
                           )}
                           {alert.status === 'responding' && (
                              <button 
                                onClick={() => updateStatus(alert.id, 'resolved')}
                                className="text-green-500 hover:text-green-400 transition-colors"
                              >
                                Resolve
                              </button>
                           )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {toasts && toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
          {toasts.map(t => (
            <div key={t.id} className="px-4 py-3 rounded border bg-[#111827] text-sm shadow-lg flex items-center gap-2"
                 style={{ 
                   borderColor: t.type === 'error' ? '#ef4444' : '#14B8A6',
                   color: '#E5E7EB'
                 }}>
                {t.type === 'error' ? <AlertTriangle size={16} color="#ef4444"/> : <Activity size={16} color="#14B8A6"/>}
                {t.message}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
