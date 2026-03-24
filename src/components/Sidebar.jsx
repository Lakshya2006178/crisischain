import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
    LayoutDashboard, AlertTriangle, Activity,
    Database, Settings, ShieldAlert,
} from 'lucide-react';

// ── must match DashboardMain SZ ──────────────────────
const W_CLOSED = 72;
const W_OPEN   = 260;
const H_TOP    = 68;

const NAV = [
    { id:'dashboard', icon: LayoutDashboard, label:'Dashboard' },
    { id:'alerts',    icon: AlertTriangle,   label:'Alerts'    },
    { id:'resources', icon: Database,         label:'Resources' },
    { id:'analytics', icon: Activity,         label:'Analytics' },
    { id:'settings',  icon: Settings,         label:'Settings'  },
];

export default function Sidebar() {
    const [active, setActive] = useState('dashboard');
    const { isSidebarOpen } = useDashboard();
    const w = isSidebarOpen ? W_OPEN : W_CLOSED;

    return (
        <aside
            className="fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 overflow-hidden"
            style={{
                width: w,
                background: '#07101e',
                borderRight: '1px solid rgba(51,65,85,.55)',
            }}
        >
            {/* ── Logo bar (matches navbar height) ─────── */}
            <div className="flex items-center justify-center flex-shrink-0"
                 style={{height: H_TOP, borderBottom:'1px solid rgba(51,65,85,.55)'}}>
                {isSidebarOpen ? (
                    <div className="flex items-center gap-2.5 px-5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                             style={{background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)'}}>
                            <ShieldAlert className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="font-bebas text-xl tracking-[.14em] text-slate-100 whitespace-nowrap">
                            Crisis<span className="text-red-500">Chain</span>
                        </span>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)'}}>
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                )}
            </div>

            {/* ── Nav items ──────────────────────────────── */}
            <nav className="flex-1 flex flex-col gap-1 p-2.5 mt-1 overflow-hidden">
                {NAV.map(({ id, icon: Icon, label }) => {
                    const isActive = active === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActive(id)}
                            title={!isSidebarOpen ? label : undefined}
                            className="relative flex items-center rounded-xl transition-all duration-200 group"
                            style={{
                                padding: isSidebarOpen ? '10px 14px' : '10px',
                                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                gap: isSidebarOpen ? 12 : 0,
                                background: isActive ? 'rgba(255,255,255,.07)' : 'transparent',
                                color: isActive ? '#e2e8f0' : '#64748b',
                            }}
                            onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='rgba(255,255,255,.04)'; }}
                            onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent'; }}
                        >
                            {/* Active bar */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                                      style={{background:'#ef4444', boxShadow:'0 0 8px rgba(239,68,68,.6)'}} />
                            )}
                            <Icon className="flex-shrink-0" style={{
                                width: 20, height: 20,
                                color: isActive ? '#f87171' : '#64748b',
                            }} />
                            {isSidebarOpen && (
                                <span className="font-inter text-sm font-medium whitespace-nowrap"
                                      style={{color: isActive ? '#e2e8f0' : '#94a3b8'}}>
                                    {label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* ── User ───────────────────────────────────── */}
            <div className="flex-shrink-0 p-2.5"
                 style={{borderTop:'1px solid rgba(51,65,85,.45)'}}>
                <button
                    className="flex items-center w-full rounded-xl transition-colors"
                    style={{
                        padding: isSidebarOpen ? '10px 14px' : '10px',
                        justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        gap: 12,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.04)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                    <div className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center"
                         style={{background:'rgba(30,41,59,.9)', border:'1px solid rgba(51,65,85,.6)'}}>
                        <span className="font-bebas text-sm tracking-wider text-red-400">CC</span>
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col items-start min-w-0">
                            <span className="font-inter text-sm font-semibold text-slate-200">Commander</span>
                            <span className="font-inter text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                Online
                            </span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}
