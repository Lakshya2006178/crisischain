import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Search, Bell, Menu, User, ChevronDown } from 'lucide-react';

// ── must match DashboardMain SZ ──────────────────────
const W_CLOSED = 72;
const W_OPEN   = 260;
const H_NAV    = 68;

export default function TopNavbar() {
    const [time, setTime] = useState(new Date());
    const { isSidebarOpen, toggleSidebar, addToast } = useDashboard();

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const ml = isSidebarOpen ? W_OPEN : W_CLOSED;

    // Format helpers
    const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = time.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });

    return (
        <header
            className="fixed top-0 right-0 z-40 flex items-center transition-all duration-300"
            style={{
                left: ml,
                height: H_NAV,
                background: 'rgba(6,13,26,0.97)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(51,65,85,.55)',
                padding: '0 24px',
                gap: 16,
            }}
        >
            {/* Hamburger toggle */}
            <button
                onClick={toggleSidebar}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                style={{color:'#64748b'}}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.color='#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748b'; }}
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Brand + divider (always visible) */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-bebas text-xl tracking-[.14em] text-slate-100">
                    Crisis<span className="text-red-500">Chain</span>
                </span>
                <span className="w-px h-6 bg-slate-700/80" />
                <span className="font-inter text-xs font-semibold tracking-[.18em] uppercase text-slate-500">
                    Command Center
                </span>
            </div>

            {/* Search — takes remaining space */}
            <div className="flex-1 min-w-0 max-w-lg relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{color:'#475569'}} />
                <input
                    type="text"
                    placeholder="Search incidents, alerts, resources…"
                    className="font-inter w-full rounded-xl text-sm text-slate-300 placeholder-slate-600 outline-none transition-all"
                    style={{
                        background:'rgba(30,41,59,.6)',
                        border:'1px solid rgba(51,65,85,.6)',
                        padding:'9px 16px 9px 40px',
                    }}
                    onFocus={e => e.target.style.borderColor='rgba(59,130,246,.5)'}
                    onBlur={e => e.target.style.borderColor='rgba(51,65,85,.6)'}
                />
            </div>

            {/* Right side cluster */}
            <div className="flex items-center gap-4 flex-shrink-0 ml-auto">

                {/* Clock */}
                <div className="hidden md:flex flex-col items-end gap-0.5">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-inter text-base font-bold font-mono text-slate-100 tracking-wider">
                            {timeStr}
                        </span>
                        <span className="font-bebas text-sm tracking-widest text-red-500">UTC</span>
                    </div>
                    <span className="font-inter text-[10px] text-slate-500">{dateStr}</span>
                </div>

                {/* Divider */}
                <span className="hidden md:block w-px h-8 bg-slate-700/70" />

                {/* Bell */}
                <button
                    onClick={() => addToast('Checking notifications', 'info')}
                    className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
                    style={{color:'#64748b', border:'1px solid rgba(51,65,85,.5)'}}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.06)'; e.currentTarget.style.color='#e2e8f0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748b'; }}
                >
                    <Bell className="w-4.5 h-4.5" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
                          style={{background:'#ef4444', boxShadow:'0 0 6px rgba(239,68,68,.8)'}} />
                </button>

                {/* Profile pill */}
                <button
                    onClick={() => addToast('Profile settings', 'info')}
                    className="flex items-center gap-2.5 rounded-xl transition-colors flex-shrink-0"
                    style={{
                        padding: '7px 14px 7px 8px',
                        background:'rgba(30,41,59,.6)',
                        border:'1px solid rgba(51,65,85,.5)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(30,41,59,.9)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(30,41,59,.6)'}
                >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.25)'}}>
                        <User className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="hidden sm:flex flex-col items-start gap-0.5">
                        <span className="font-inter text-sm font-semibold text-slate-200 leading-none">Commander</span>
                        <span className="font-inter text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Online
                        </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

            </div>
        </header>
    );
}
