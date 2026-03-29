import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Search, Bell, Menu, User, ChevronDown, Shield, Zap, Globe, Terminal, Clock, Activity, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const W_CLOSED = 80;
const W_OPEN   = 300;
const H_NAV    = 80;

export default function TopNavbar() {
    const [time, setTime] = useState(new Date());
    const { isSidebarOpen, toggleSidebar, addToast } = useDashboard();

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const ml = isSidebarOpen ? W_OPEN : W_CLOSED;

    const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

    return (
        <header
            className={`fixed top-0 right-0 z-40 flex items-center transition-all duration-500 border-b border-white/5 px-4 md:px-10 gap-6 md:gap-12 bg-black/90 backdrop-blur-md will-change-transform ${isSidebarOpen ? 'left-sidebar-open' : 'left-sidebar-closed'}`}
            style={{
                height: H_NAV,
            }}
        >
            {/* Command Trigger Toggle */}
            <button
                onClick={toggleSidebar}
                className="group flex flex-col gap-2 w-12 h-12 items-center justify-center bg-white/5 hover:bg-[#00FFCC] border border-white/5 hover:border-transparent transition-all duration-500"
            >
                <div className={`h-[1px] bg-white group-hover:bg-black transition-all duration-500 ${isSidebarOpen ? 'w-6' : 'w-4 translate-x-1'}`} />
                <div className={`h-[1px] bg-white group-hover:bg-black transition-all duration-500 ${isSidebarOpen ? 'w-4' : 'w-7'}`} />
                <div className={`h-[1px] bg-white group-hover:bg-black transition-all duration-500 ${isSidebarOpen ? 'w-6' : 'w-4 -translate-x-1'}`} />
            </button>

            {/* Cortex Omni-Search Terminal */}
            <div className="flex-1 max-w-2xl relative group/search">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                   <Terminal className="w-4 h-4 text-white/20 group-focus-within/search:text-[#00FFCC] transition-colors" />
                   <span className="text-[9px] font-mono text-white/10 font-black tracking-widest hidden lg:block group-focus-within/search:text-[#00FFCC]/20 transition-colors uppercase">CMD_EXEC:</span>
                </div>
                <input
                    type="text"
                    placeholder="SCAN_FOR_MISSION_CRITICAL_INTEL..."
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-[#00FFCC]/20 focus:bg-[#00FFCC]/[0.02] px-16 lg:px-28 py-4 font-mono text-[11px] font-black tracking-[0.3em] text-[#00FFCC] placeholder:text-white/10 focus:outline-none transition-all duration-1000 uppercase"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-4 opacity-0 group-focus-within/search:opacity-100 transition-opacity">
                   <span className="text-[8px] font-mono text-white/20 font-black uppercase tracking-widest">ENTER_TO_SCAN</span>
                </div>
            </div>

            {/* Strategic Intelligence Feed (Header) */}
            <div className="hidden xl:flex items-center gap-16 font-mono text-[9px] tracking-[0.5em] text-white/20 uppercase border-r border-white/5 pr-12 py-3">
               <div className="flex flex-col items-start gap-3">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                      <span className="text-white/40 font-black">UPLINK_01_OPTIMAL</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Zap className="w-3.5 h-3.5 text-yellow-500/20" />
                      <span>SIGNAL: 12.04dBm</span>
                   </div>
               </div>
               
               <div className="flex flex-col items-center gap-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-lg font-outfit font-black text-white tracking-widest leading-none">{timeStr}</span>
                    <span className="text-[10px] text-red-500 font-black italic">UTC+00</span>
                  </div>
                  <span className="text-[8px] text-white/40 font-black tracking-[0.8em]">{dateStr}</span>
               </div>
            </div>

            {/* Tactical Action Cluster */}
            <div className="flex items-center gap-8 ml-auto">
                <button 
                  onClick={() => addToast('Calibrating notification vectors', 'info')}
                  className="relative w-12 h-12 flex items-center justify-center bg-white/[0.02] border border-white/5 hover:border-[#00FFCC]/40 hover:bg-[#00FFCC]/[0.02] transition-all duration-500 group"
                >
                    <Bell className="w-5 h-5 text-white/20 group-hover:text-[#00FFCC] transition-colors" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse rounded-full" />
                </button>

                <div className="h-6 w-[2px] bg-white/5" />

                <button 
                  onClick={() => addToast('Opening strategic cortex', 'info')}
                  className="flex items-center gap-6 bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-700 px-6 py-3 group relative overflow-hidden"
                >
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFCC] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 bg-black border border-white/10 flex items-center justify-center group-hover:border-[#00FFCC]/40 transition-all duration-500">
                        <Terminal className="w-5 h-5 text-white/20 group-hover:text-[#00FFCC] transition-colors" />
                    </div>
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                        <span className="text-[11px] font-outfit font-black text-white uppercase tracking-wider">COMMANDER_01</span>
                        <div className="flex items-center gap-3 mt-1">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                           <span className="text-[9px] font-mono font-bold text-green-500 tracking-[0.3em] uppercase">Authenticated</span>
                        </div>
                    </div>
                    <ChevronDown size={14} className="text-white/10 group-hover:text-white transition-transform group-hover:rotate-180" />
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              header {
                box-shadow: 0 4px 20px -5px rgba(0,0,0,0.5);
              }
            `}} />
        </header>
    );
}
