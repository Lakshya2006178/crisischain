import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { Search, Bell, Menu, User, ChevronDown, Shield, Zap, Globe, Terminal, Clock, Activity, Settings, AlertTriangle, CheckCircle2, Info, LogOut } from 'lucide-react';

const W_CLOSED = 80;
const W_OPEN   = 300;
const H_NAV    = 80;

export default function TopNavbar() {
    const [time, setTime] = useState(new Date());
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const { isSidebarOpen, toggleSidebar, addToast, alerts } = useDashboard();
    const navigate = useNavigate();
    const notifRef = useRef(null);
    const userRef = useRef(null);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const ml = isSidebarOpen ? W_OPEN : W_CLOSED;

    const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

    const unreadCount = alerts.filter(a => a.critical).length;

    const handleLogout = () => {
        addToast('Terminating session...', 'info');
        setTimeout(() => {
            navigate('/');
        }, 800);
    };

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
                className="group flex flex-col gap-2 w-12 h-12 items-center justify-center bg-white/5 hover:bg-red-600 border border-white/5 hover:border-transparent transition-all duration-500"
            >
                <div className={`h-[1px] bg-white group-hover:bg-white transition-all duration-500 ${isSidebarOpen ? 'w-6' : 'w-4 translate-x-1'}`} />
                <div className={`h-[1px] bg-white group-hover:bg-white transition-all duration-500 ${isSidebarOpen ? 'w-4' : 'w-7'}`} />
                <div className={`h-[1px] bg-white group-hover:bg-white transition-all duration-500 ${isSidebarOpen ? 'w-6' : 'w-4 -translate-x-1'}`} />
            </button>

            {/* Omni-Search */}
            <div className="flex-1 max-w-2xl relative group/search">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                   <Search className="w-4 h-4 text-white/20 group-focus-within/search:text-red-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search for resources, alerts, or organizations..."
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-red-500/20 focus:bg-red-500/[0.01] px-16 lg:px-16 py-4 font-mono text-[10px] font-black tracking-widest text-[#E5E5E7] placeholder:text-white/10 focus:outline-none transition-all duration-1000 uppercase"
                />
            </div>

            {/* Strategic Feed (Header) */}
            <div className="hidden xl:flex items-center gap-16 font-mono text-[9px] tracking-[0.5em] text-white/20 uppercase border-r border-white/5 pr-12 py-3">
               <div className="flex flex-col items-start gap-2">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                      <span className="text-white/40 font-black">SYSTEM_OPERATIONAL</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Activity className="w-3.5 h-3.5 text-blue-500" />
                      <span>Connectivity: 98%</span>
                   </div>
               </div>
               
               <div className="flex flex-col items-center gap-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-lg font-outfit font-black text-white tracking-widest leading-none">{timeStr}</span>
                    <span className="text-[10px] text-red-500 font-black italic">UTC</span>
                  </div>
                  <span className="text-[8px] text-white/40 font-black tracking-[0.8em]">{dateStr}</span>
               </div>
            </div>

            {/* Action Cluster */}
            <div className="flex items-center gap-8 ml-auto relative">
                
                {/* NOTIFICATIONS PANEL WRAPPER */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative w-12 h-12 flex items-center justify-center transition-all duration-500 group border border-white/5 ${isNotifOpen ? 'bg-red-600 border-transparent' : 'bg-white/[0.02] hover:border-red-500/40 hover:bg-red-500/[0.02]'}`}
                    >
                        <Bell className={`w-5 h-5 transition-colors ${isNotifOpen ? 'text-white font-black' : 'text-white/20 group-hover:text-red-500'}`} />
                        {unreadCount > 0 && !isNotifOpen && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse rounded-full" />
                        )}
                    </button>

                    {/* DROPDOWN PANEL */}
                    {isNotifOpen && (
                        <div className="absolute right-0 top-16 w-[380px] bg-[#0E1015] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-[100] animate-fade-in overflow-hidden">
                            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <Bell size={14} className="text-red-500" />
                                    <span className="font-outfit font-black text-sm text-white uppercase tracking-wider">Emergency Pipeline</span>
                                </div>
                                <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{unreadCount} Pending</span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {alerts.length > 0 ? (
                                    alerts.slice(0, 5).map((alert, i) => (
                                        <div key={alert.id} className="p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group/notif cursor-pointer">
                                            <div className="flex gap-4">
                                                <div className={`mt-1 w-8 h-8 flex-shrink-0 flex items-center justify-center border ${alert.critical ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-blue-500/20 text-blue-500 bg-blue-500/5'}`}>
                                                    <AlertTriangle size={14} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-outfit font-black text-xs text-white uppercase tracking-tight">{alert.type}</span>
                                                        <span className="font-mono text-[8px] text-white/10 uppercase">{alert.time}</span>
                                                    </div>
                                                    <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
                                                        Detected at {alert.location}. immediate attention required.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-[10px] font-mono text-white/10 uppercase tracking-[0.5em]">
                                        NO_ACTIVE_INCIDENTS
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex gap-2">
                                <button onClick={() => addToast('Notifications cleared', 'success')} className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-mono text-[8px] font-black text-white/40 hover:text-white uppercase tracking-widest">
                                    Clear History
                                </button>
                                <Link to="/alerts" onClick={() => setIsNotifOpen(false)} className="flex-1 py-3 bg-red-600 text-white font-mono text-[8px] font-black uppercase tracking-widest text-center hover:brightness-110 transition-all">
                                    All Alerts
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-[2px] bg-white/5" />

                <div className="relative" ref={userRef}>
                    <button 
                        onClick={() => setIsUserOpen(!isUserOpen)}
                        className={`flex items-center gap-6 border transition-all duration-700 px-6 py-3 group relative overflow-hidden ${isUserOpen ? 'bg-red-600 border-transparent' : 'bg-white/[0.03] border-white/5 hover:border-white/20'}`}
                    >
                        {!isUserOpen && <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                        <div className={`w-10 h-10 bg-black border flex items-center justify-center transition-all duration-500 ${isUserOpen ? 'border-white/40' : 'border-white/10 group-hover:border-red-500/40'}`}>
                            <User className={`w-5 h-5 transition-colors ${isUserOpen ? 'text-white font-black' : 'text-white/20 group-hover:text-red-500'}`} />
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-tight">
                            <span className={`text-[11px] font-outfit font-black uppercase tracking-wider transition-colors ${isUserOpen ? 'text-white' : 'text-white'}`}>Commander Alex</span>
                            <div className="flex items-center gap-3 mt-1">
                                <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#10b981] ${isUserOpen ? 'bg-white' : 'bg-emerald-500'}`} />
                                <span className={`text-[9px] font-mono font-bold tracking-[0.3em] uppercase transition-colors ${isUserOpen ? 'text-white/60' : 'text-emerald-500'}`}>Authenticated</span>
                            </div>
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-500 ${isUserOpen ? 'rotate-180 text-white' : 'text-white/10 group-hover:text-white'}`} />
                    </button>

                    {/* USER DROPDOWN (LOGOUT) */}
                    {isUserOpen && (
                        <div className="absolute right-0 top-16 w-full bg-[#0E1015] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-[100] animate-fade-in overflow-hidden">
                             <Link to="/settings" onClick={() => setIsUserOpen(false)} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/5 group/link">
                                <Settings size={14} className="text-white/20 group-hover/link:text-white transition-colors" />
                                <span className="font-mono text-[9px] font-black text-white/40 group-hover/link:text-white uppercase tracking-widest">Settings</span>
                             </Link>
                             <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-red-600/10 transition-colors group/logout"
                             >
                                <LogOut size={14} className="text-red-500" />
                                <span className="font-mono text-[9px] font-black text-red-500 uppercase tracking-widest">Logout Session</span>
                             </button>
                        </div>
                    )}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                header {
                    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.5);
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
                @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
            `}} />
        </header>
    );
}
