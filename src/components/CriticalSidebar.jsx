import React from 'react';
import { ShieldAlert, AlertCircle, ChevronRight } from 'lucide-react';

const CriticalSidebar = ({ alerts, isOpen, setIsOpen }) => {
  const criticalAlerts = alerts.filter(a => (a.priority === 'P1' || a.priority === 'High') && a.status === 'New');

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[28] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed right-0 top-0 h-full w-80 bg-[#161C30]/95 backdrop-blur-xl border-l border-slate-700/50 
        shadow-2xl z-[30] transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-700/30 flex justify-between items-center bg-red-600/10">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert size={18} className="animate-pulse" />
            <h3 className="text-xs font-black tracking-[0.2em] uppercase">Critical Stream</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-500 font-mono text-[10px] border border-red-500/30">
              {criticalAlerts.length} New
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {criticalAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 text-slate-500">
               <AlertCircle size={40} className="mb-2" />
               <p className="text-xs font-mono">No P1 Emergencies Detected</p>
            </div>
          ) : (
            criticalAlerts.map((alert, index) => (
              <div 
                key={index} 
                className="group p-4 rounded-xl bg-slate-800/20 border border-slate-700/50 hover:border-red-500/30 transition-all hover:bg-slate-800/40 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/40"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-red-400 font-black text-[10px] tracking-widest uppercase">P1 Emergency</span>
                  <span className="text-[10px] font-mono text-slate-500">{alert.time || 'NOW'}</span>
                </div>
                <h4 className="text-slate-200 text-sm font-bold mb-1 group-hover:text-red-400 transition-colors uppercase leading-tight">
                  {alert.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {alert.message}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1 px-2 rounded bg-slate-900 border border-slate-700 text-[9px] font-bold text-slate-400 uppercase tracking-tighter hover:text-white transition-colors">
                    Deploy
                  </button>
                  <button className="flex-1 py-1 px-2 rounded bg-red-600/20 border border-red-500/20 text-[9px] font-bold text-red-400 uppercase tracking-tighter hover:bg-red-600/30 transition-colors">
                    Crisis Hub
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-700/30 bg-slate-900/50">
          <button className="w-full py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
            Full Incident Report
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default CriticalSidebar;
