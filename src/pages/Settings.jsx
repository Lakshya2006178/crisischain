import React, { useState, useEffect, useMemo, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SZ } from '../DashboardMain';
import { 
    Settings as SettingsIcon, Users, Building2, Bell, Shield, 
    Server, Cpu, Activity, CheckCircle2, XCircle, 
    ChevronRight, Search, Plus, Edit2, ToggleLeft, 
    ToggleRight, Mail, MessageSquare, Clock, AlertCircle,
    Key, Lock, Smartphone, LogOut, ChevronDown, Filter, Trash2,
    Zap, Radio, Database, Globe, Phone, Info
} from 'lucide-react';

// ── ERROR BOUNDARY ──

class LocalErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full bg-[#08080A] flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-16 h-16 border border-red-500/20 flex items-center justify-center mb-6">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h2 className="font-outfit font-black text-2xl text-white uppercase tracking-tighter mb-2">SYSTEM ERROR</h2>
                    <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] mb-8">Connection lost // Refresh to retry</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                        RETRY CONNECTION
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// ── MOCK DATA ──

const MOCK_ORGS = [
    { id: 1, name: 'City General Hospital', type: 'Hospital', location: 'Downtown', status: 'Active', contact: '+1-555-0123', capacity: '200 Beds' },
    { id: 2, name: 'Western Fire Dept', type: 'Fire Dept', location: 'Industrial Sector', status: 'Active', contact: '+1-555-0199', capacity: '12 Units' },
    { id: 3, name: 'Red Cross Alpha', type: 'NGO', location: 'Suburban East', status: 'Inactive', contact: '+1-555-0144', capacity: '50 Responders' },
    { id: 4, name: 'Emergency Medics Unit', type: 'Hospital', location: 'North Point', status: 'Active', contact: '+1-555-0188', capacity: '40 Beds' },
];

const MOCK_USERS = [
    { id: 1, name: 'Commander Alex', role: 'Admin', org: 'Crisis HQ', status: 'Active', lastLogin: '2 mins ago', sessions: 1 },
    { id: 2, name: 'Major Sarah', role: 'Responder', org: 'Fire Dept', status: 'Active', lastLogin: '1 hour ago', sessions: 2 },
    { id: 3, name: 'Officer James', role: 'User', org: 'General Hospital', status: 'Active', lastLogin: '3 hours ago', sessions: 1 },
    { id: 4, name: 'Tech Elena', role: 'Admin', org: 'IT Hub', status: 'Inactive', lastLogin: '2 days ago', sessions: 0 },
];

// ── CUSTOM COMPONENTS ──

function SettingCard({ title, description, icon: Icon, children, accent = "#00FFCC", badge }) {
    return (
        <div className="bg-[#0E1015]/95 border border-white/5 p-6 lg:p-8 flex flex-col h-full group hover:border-white/10 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity" style={{ backgroundColor: accent }} />
            
            <div className="flex items-center justify-between mb-4 relative z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 border border-white/5 text-white/40 group-hover:text-white transition-colors">
                        {Icon && <Icon size={18} />}
                    </div>
                    <div>
                        <h3 className="font-outfit font-black text-xl text-white uppercase tracking-tight leading-none">{title}</h3>
                    </div>
                </div>
                {badge && (
                    <span className="px-3 py-1 bg-white/5 border border-white/5 font-mono text-[8px] text-white/40 uppercase tracking-widest">{badge}</span>
                )}
            </div>

            {description && (
                <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mb-8 relative z-20 border-b border-white/5 pb-4">
                    {description}
                </p>
            )}
            
            <div className="flex-1 relative z-10 w-full overflow-hidden">
                {children}
            </div>
        </div>
    );
}

function Toggle({ enabled, onChange, label, subLabel }) {
    return (
        <div className="flex items-center justify-between py-3 group/toggle cursor-pointer border-b border-white/[0.02] last:border-0" onClick={() => onChange(!enabled)}>
            <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white/40 group-hover/toggle:text-white transition-colors uppercase tracking-widest">{label}</span>
                {subLabel && <span className="text-[8px] font-mono text-white/10 uppercase mt-1">{subLabel}</span>}
            </div>
            <div className={`w-10 h-5 relative flex items-center transition-all ${enabled ? 'bg-red-500/20' : 'bg-white/5'} border border-white/10 p-0.5`}>
                <div className={`w-3.5 h-3.5 transition-all ${enabled ? 'translate-x-5 bg-red-500 shadow-[0_0_10px_#ef4444]' : 'translate-x-0 bg-white/20'}`} />
            </div>
        </div>
    );
}

function TableHeader({ columns }) {
    return (
        <thead>
            <tr className="border-b border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] text-left">
                {columns.map((c, i) => (
                    <th key={i} className="px-6 py-4 font-normal">{c}</th>
                ))}
                <th className="px-6 py-4 font-normal text-right">ACTIONS</th>
            </tr>
        </thead>
    );
}

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#0E1015] border border-white/10 p-10 space-y-8 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <div className="space-y-4">
                    <h3 className="font-outfit font-black text-2xl text-white uppercase tracking-tighter">{title}</h3>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                        {message}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-mono text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-4 bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all">Confirm</button>
                </div>
            </div>
        </div>
    );
};

// ── MAIN CONTENT ──

function SettingsContent() {
    const { isSidebarOpen, addToast, logout } = useDashboard();
    const navigate = useNavigate();
    
    // States
    const [notifs, setNotifs] = useState({ alerts: true, email: false, sms: true });
    const [config, setConfig] = useState({ respTime: '15', threshold: 'Critical', autoDispatch: true });
    const [tfa, setTfa] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
    // Modal controls
    const [modal, setModal] = useState({ open: false, type: '', data: null });

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const openConfirm = (type, data) => setModal({ open: true, type, data });
    const closeConfirm = () => setModal({ open: false, type: '', data: null });

    const handleLogout = () => {
        addToast('Terminating session...', 'info');
        logout();
        setTimeout(() => {
            navigate('/');
        }, 800);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div 
                  className="absolute w-[800px] h-[800px] rounded-full blur-[200px] bg-red-600 transition-transform duration-1000"
                  style={{ transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)` }}
                />
            </div>

            <Sidebar />
            <TopNavbar />

            <main
                className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-500 relative z-10 custom-scrollbar will-change-transform ${isSidebarOpen ? 'ml-sidebar-open' : 'ml-sidebar-closed'}`}
                style={{
                    marginTop: SZ.navbarH,
                    height: `calc(100vh - ${SZ.navbarH}px)`,
                }}
            >
                <div className="max-w-[1700px] mx-auto fluid-p">

                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <SettingsIcon size={14} className="text-red-500" />
                                <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-red-500 uppercase">SYSTEM SETTINGS</span>
                            </div>
                            <h1 className="font-outfit text-4xl lg:text-5xl font-black tracking-tighter uppercase text-white leading-none">
                                SETTINGS<span className="text-white/20">://</span>PANEL
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 mt-6 md:mt-0 px-4 py-2 bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/40">
                           <Activity size={12} className="text-blue-500" /> STATUS: OPERATIONAL
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 mb-14">
                        
                        {/* 1. ORGANIZATIONS */}
                        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <SettingCard 
                                title="Organizations" 
                                description="Manage emergency units, hospitals, and logistical partners participating in crisis response."
                                icon={Building2} 
                                accent="#3b82f6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="relative group flex-1 max-w-xs">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={12} />
                                        <input type="text" placeholder="Search entries..." className="w-full bg-white/5 border border-white/5 px-10 py-2.5 font-mono text-[10px] uppercase tracking-widest outline-none focus:border-red-500/30 transition-all text-white" />
                                    </div>
                                    <button className="px-6 py-2.5 bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                                        Add Organization
                                    </button>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full min-w-[900px]">
                                        <TableHeader columns={['NAME', 'TYPE', 'CONTACT', 'CAPACITY', 'STATUS']} />
                                        <tbody className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                                            {MOCK_ORGS.map((org) => (
                                                <tr key={org.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-5 font-black text-white">{org.name}</td>
                                                    <td className="px-6 py-5">{org.type}</td>
                                                    <td className="px-6 py-5 text-[9px]">{org.contact}</td>
                                                    <td className="px-6 py-5 text-blue-400 font-bold">{org.capacity}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${org.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                            <span className={org.status === 'Active' ? 'text-emerald-500' : 'text-red-500/60'}>
                                                                {org.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-4">
                                                            <button className="text-white/20 hover:text-white transition-colors" title="Edit"><Edit2 size={12} /></button>
                                                            <button 
                                                                onClick={() => openConfirm('delete_org', org.name)} 
                                                                className="text-white/20 hover:text-red-500 transition-colors" 
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </SettingCard>
                        </div>

                        {/* 2. SYSTEM STATUS */}
                        <div className="col-span-12 lg:col-span-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <SettingCard 
                                title="System Status" 
                                description="Live monitoring of server infrastructure and global response reliability indices."
                                icon={Server} 
                                accent="#a855f7" 
                                badge="LIVE"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase">Global Health</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                                <span className="font-outfit font-black text-xl text-white uppercase tracking-tight">OPERATIONAL</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[8px] font-mono text-white/30 tracking-widest uppercase">Last Sync</span>
                                            <span className="font-mono text-[10px] text-white/60 uppercase">Just now</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Cpu size={12} className="text-blue-400" />
                                                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Server Load</span>
                                                </div>
                                                <span className="font-outfit font-black text-sm text-white">42%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 w-full relative">
                                                <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_#3b82f640]" style={{ width: '42%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={12} className="text-purple-400" />
                                                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Network Speed</span>
                                                </div>
                                                <span className="font-outfit font-black text-sm text-white">892 Mbps</span>
                                            </div>
                                            <div className="h-1 bg-white/5 w-full relative">
                                                <div className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_10px_#a855f740]" style={{ width: '78%' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center justify-between font-mono text-[8px] text-white/20 uppercase tracking-[0.2em] font-black">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">UPTIME: 142 Days</div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">HEALTH: 100%</div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 mb-14">
                        
                        {/* 3. USERS & ROLES */}
                        <div className="col-span-12 lg:col-span-7 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <SettingCard 
                                title="Users & Roles" 
                                description="Manage system administrators, field responders, and organization operators."
                                icon={Users} 
                                accent="#f59e0b"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative group max-w-xs flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={12} />
                                        <input type="text" placeholder="Search users..." className="w-full bg-white/5 border border-white/5 px-10 py-2.5 font-mono text-[10px] uppercase tracking-widest outline-none focus:border-red-500/30 transition-all text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10">
                                         <Filter size={12} className="text-white/20" />
                                         <select className="bg-transparent font-mono text-[8px] text-white/40 uppercase tracking-widest outline-none cursor-pointer">
                                            <option>All Roles</option>
                                            <option>Admin</option>
                                            <option>Responder</option>
                                         </select>
                                    </div>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full min-w-[700px]">
                                        <TableHeader columns={['NAME', 'ROLE', 'ORGANIZATION', 'LAST LOGIN', 'SESSIONS']} />
                                        <tbody className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                                            {MOCK_USERS.map((user) => (
                                                <tr key={user.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group/row">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                           <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-[8px] font-black">{user.name ? user.name[0] : 'U'}</div>
                                                           <span className="font-black text-white">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 ${user.role === 'Admin' ? 'text-red-400' : 'text-blue-400'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">{user.org}</td>
                                                    <td className="px-6 py-5 text-white/40 font-bold">{user.lastLogin}</td>
                                                    <td className="px-6 py-5">{user.sessions} ACTIVE</td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                            <button className="p-1.5 bg-white/5 hover:bg-white/10 transition-all"><Edit2 size={10} /></button>
                                                            <button className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={10} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </SettingCard>
                        </div>

                        {/* 4 & 5. NOTIFS & SYS SETTINGS */}
                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                             
                             {/* NOTIFICATIONS */}
                             <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                <SettingCard 
                                    title="Notifications" 
                                    description="Configure how alerts and system updates are delivered to your devices."
                                    icon={Bell} 
                                    accent="#eab308"
                                >
                                    <div className="space-y-2">
                                        <Toggle label="Emergency Alerts" subLabel="Visual pulse on critical alert detection" enabled={notifs.alerts} onChange={v => setNotifs({...notifs, alerts: v})} />
                                        <Toggle label="Email Notifications" subLabel="Daily summaries and priority reports" enabled={notifs.email} onChange={v => setNotifs({...notifs, email: v})} />
                                        <Toggle label="SMS Delivery" subLabel="Immediate text delivery for emergency events" enabled={notifs.sms} onChange={v => setNotifs({...notifs, sms: v})} />
                                    </div>
                                </SettingCard>
                             </div>

                             {/* SYSTEM SETTINGS */}
                             <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                <SettingCard 
                                    title="System Settings" 
                                    description="Adjust core response logic and automation thresholds."
                                    icon={Zap} 
                                    accent="#10b981"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="font-mono text-[8px] text-white/20 uppercase tracking-widest pl-1">Target Response Time (minutes)</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                                                <input type="number" value={config.respTime} onChange={e => setConfig({...config, respTime: e.target.value})} className="w-full bg-[#0A0B0E] border border-white/5 py-3 pl-10 pr-4 font-mono text-[11px] text-white focus:border-red-500/30 outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-mono text-[8px] text-white/20 uppercase tracking-widest pl-1">Alert Sensitivity</label>
                                            <div className="relative">
                                                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                                                <select value={config.threshold} onChange={e => setConfig({...config, threshold: e.target.value})} className="w-full bg-[#0A0B0E] border border-white/5 py-3 pl-10 pr-4 font-mono text-[11px] text-white focus:border-red-500/30 outline-none cursor-pointer appearance-none">
                                                    <option>High Priority</option>
                                                    <option>Moderate</option>
                                                    <option>All Signals</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={12} />
                                            </div>
                                        </div>
                                    </div>
                                    <Toggle label="Automated Dispatch" subLabel="Enable AI-assisted help for regional events" enabled={config.autoDispatch} onChange={v => setConfig({...config, autoDispatch: v})} />
                                </SettingCard>
                             </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 mb-20">
                        
                        {/* SECURITY */}
                        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <SettingCard 
                                title="Security" 
                                description="Secure your account with multi-factor authentication and password management."
                                icon={Shield} 
                                accent="#ef4444"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <h4 className="font-mono text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                            <Lock size={12} className="text-red-500" /> CHANGE PASSWORD
                                        </h4>
                                        <div className="space-y-4">
                                            <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/5 px-6 py-4 font-mono text-xs text-white outline-none focus:border-red-500/30 transition-all" />
                                            <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/5 px-6 py-4 font-mono text-xs text-white outline-none focus:border-red-500/30 transition-all" />
                                            <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-mono text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Update Password</button>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <h4 className="font-mono text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                                            <Smartphone size={12} className="text-blue-500" /> 2FA SETTINGS
                                        </h4>
                                        <div className="p-6 bg-white/[0.02] border border-white/5 relative group">
                                            <p className="text-[10px] font-mono text-white/40 mb-6 leading-relaxed uppercase tracking-widest">Two-factor authentication adds an extra layer of security to your account.</p>
                                            <Toggle label="Enable 2FA" enabled={tfa} onChange={setTfa} />
                                        </div>
                                        <div className="pt-2">
                                            <button className="font-mono text-[9px] text-blue-400 hover:text-blue-300 uppercase underline tracking-widest">View Recent Logins</button>
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>

                        {/* LOGOUT */}
                        <div className="col-span-12 lg:col-span-4 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                            <div className="bg-red-500/5 border border-red-500/20 p-10 h-full flex flex-col justify-between group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <h4 className="font-outfit font-black text-2xl text-white uppercase tracking-tight mb-4">Logout All Sessions</h4>
                                    <p className="font-mono text-[10px] text-red-500/60 uppercase tracking-widest leading-relaxed mb-8">
                                        Log out of all devices and active sessions for this account.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => openConfirm('logout_all', 'Log out of all devices?')}
                                        className="w-full py-5 bg-white/5 border border-red-500/20 text-red-500 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-4"
                                    >
                                       LOG OUT OTHER DEVICES
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full py-5 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(239,68,68,0.3)] transition-all active:scale-95 flex items-center justify-center gap-4"
                                    >
                                       <LogOut size={16} /> LOGOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 border-t border-white/5 pt-10 pb-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-mono text-white/10 uppercase tracking-[0.5em] font-black">
                         <div className="flex gap-10">
                            <span className="flex items-center gap-3"><div className="w-1 h-1 bg-emerald-500 rounded-full" />UPTIME: 99.98%</span>
                            <span className="flex items-center gap-3"><Shield size={12} />SECURE CONNECTION</span>
                         </div>
                         <div className="text-white/5 tracking-[0.8em]">CRISISCHAIN // ADMIN CONSOLE // V5.4.1</div>
                    </div>
                </div>
            </main>

            <ConfirmationModal 
                isOpen={modal.open}
                title={modal.type === 'delete_org' ? 'Delete Organization?' : 'Security Action'}
                message={modal.type === 'delete_org' ? `Are you sure you want to remove ${modal.data}? This action cannot be undone.` : modal.data}
                onConfirm={closeConfirm}
                onCancel={closeConfirm}
            />

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
                .animate-slide-up { animation: slide-up 0.8s ease-out forwards; opacity: 0; }
                @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}} />
        </div>
    );
}

export default function Settings() {
    return (
        <LocalErrorBoundary>
            <SettingsContent />
        </LocalErrorBoundary>
    );
}
