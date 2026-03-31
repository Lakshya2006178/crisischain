import React, { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SZ } from '../DashboardMain';
import {
    Activity, TrendingUp, AlertTriangle, CheckCircle2, 
    Clock, Gauge, Globe, Zap, Database, BarChart3, 
    PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight,
    Search, Filter, Calendar
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ── MOCK DATA ──

const INCIDENT_TREND_DATA = [
    { name: '01 Mar', incidents: 40, resolved: 24 },
    { name: '05 Mar', incidents: 30, resolved: 13 },
    { name: '10 Mar', incidents: 20, resolved: 98 },
    { name: '15 Mar', incidents: 27, resolved: 39 },
    { name: '20 Mar', incidents: 18, resolved: 48 },
    { name: '25 Mar', incidents: 23, resolved: 38 },
    { name: '30 Mar', incidents: 34, resolved: 43 },
];

const INCIDENT_TYPE_DATA = [
    { name: 'Flood', value: 400, color: '#3b82f6' },
    { name: 'Fire', value: 300, color: '#ef4444' },
    { name: 'Earthquake', value: 300, color: '#f59e0b' },
    { name: 'Medical', value: 200, color: '#10b981' },
    { name: 'Storm', value: 278, color: '#a855f7' },
];

const REGION_DATA = [
    { name: 'Central', count: 450, density: 85 },
    { name: 'North', count: 680, density: 92 },
    { name: 'South', count: 320, density: 45 },
    { name: 'East', count: 890, density: 78 },
    { name: 'West', count: 560, density: 60 },
];

const RESOURCE_UTILIZATION = [
    { label: 'Medical Squads', value: 85, color: '#10b981' },
    { label: 'Logistics Fleet', value: 64, color: '#3b82f6' },
    { label: 'Aerial Recon', value: 42, color: '#a855f7' },
    { label: 'Heavy Machinery', value: 28, color: '#f59e0b' },
    { label: 'Communication Hubs', value: 92, color: '#00FFCC' },
];

const RESPONSE_TIME_DATA = [
    { time: '00:00', avg: 12 },
    { time: '04:00', avg: 15 },
    { time: '08:00', avg: 45 },
    { time: '12:00', avg: 85 },
    { time: '16:00', avg: 65 },
    { time: '20:00', avg: 35 },
    { time: '23:59', avg: 18 },
];

const ACTIVITY_LOG = [
    { id: 1, event: 'Alert Escalation', sector: 'North-Alpha', time: '2 mins ago', level: 'Critical' },
    { id: 2, event: 'Resource Deployed', sector: 'East-Omega', time: '15 mins ago', level: 'Info' },
    { id: 3, event: 'Incident Resolved', sector: 'South-Beta', time: '45 mins ago', level: 'Success' },
    { id: 4, event: 'Uplink Synced', sector: 'Global-Hub', time: '1 hour ago', level: 'System' },
    { id: 5, event: 'New Alert Detected', sector: 'West-Gamma', time: '2 hours ago', level: 'Warning' },
];

// ── CUSTOM COMPONENTS ──

function KPIField({ label, value, trend, icon: Icon, color }) {
    const isPositive = trend > 0;
    return (
        <div className="bg-[#0E1015]/95 border border-white/5 p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity`} 
                 style={{ backgroundColor: color }} />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-white/5 border border-white/5 text-white/40 group-hover:text-white transition-colors">
                    <Icon size={18} />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 border font-mono text-[9px] font-bold ${isPositive ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                    {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            
            <div className="mt-8 relative z-10">
                <span className="block text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-black mb-2">{label}</span>
                <span className="text-4xl font-outfit font-black text-white tracking-tighter">{value}</span>
            </div>
            
            {/* Visual Progress Line Bottom */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-white/[0.03] w-full">
                <div className="h-full transition-all duration-1000" 
                     style={{ width: '100%', backgroundColor: `${color}40` }} />
            </div>
        </div>
    );
}

function SectionHeading({ title, subtitle, icon: Icon }) {
    return (
        <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 border border-white/5 text-[#00FFCC]">
                    <Icon size={14} />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-[#00FFCC] uppercase">{subtitle}</span>
            </div>
            <h2 className="text-2xl font-outfit font-black text-white uppercase tracking-tight">{title}</h2>
        </div>
    );
}

function AnalyticsCard({ children, label, status = "REALTIME", accent = "#00FFCC" }) {
    return (
        <div className="bg-[#0E1015]/95 border border-white/5 p-8 flex flex-col h-full group hover:border-white/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }} />
                    <span className="font-mono text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-white/5" />
                    <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{status}</span>
                </div>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

// ── MAIN PAGE COMPONENT ──

export default function Analytics() {
    const { isSidebarOpen } = useDashboard();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#08080A] border border-white/10 p-4 backdrop-blur-xl shadow-2xl">
                    <p className="font-mono text-[10px] font-black text-white/40 mb-3 border-b border-white/5 pb-2 uppercase tracking-widest">{label}</p>
                    <div className="space-y-2">
                        {payload.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-2 h-2" style={{ backgroundColor: p.color }} />
                                <span className="font-mono text-[10px] text-white uppercase tracking-wider">{p.name}: <span className="font-black">{p.value}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
            
            {/* ── AMBIENT HUD ARCHITECTURE ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div 
                  className="absolute w-[800px] h-[800px] rounded-full blur-[180px] bg-[#00FFCC] transition-transform duration-1000"
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
                <div className="max-w-[1920px] mx-auto fluid-p">

                    {/* ── HEADER ── */}
                    <div className="mb-10 lg:mb-14 flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-8 lg:pb-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-[#00FFCC]" />
                                <span className="text-[10px] font-mono font-bold tracking-[0.5em] text-[#00FFCC] uppercase">INTELLIGENCE_METRICS</span>
                            </div>
                            <h1 className="font-outfit text-4xl lg:text-5xl font-black tracking-tighter uppercase text-white leading-none">
                                CORTEX<span className="text-white/20">://</span>ANALYTICS
                            </h1>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-8 lg:mt-0">
                            <div className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 font-mono text-[9px] font-black tracking-widest uppercase">
                                <Calendar size={12} className="text-white/40" />
                                <span>Last_30_Days</span>
                            </div>
                            <button className="flex-1 lg:flex-none px-8 py-2.5 bg-[#00FFCC] text-black hover:brightness-110 transition-all font-mono text-[9px] font-black tracking-widest uppercase shadow-[0_0_30px_rgba(0,255,204,0.15)]">
                                EXPORT_HUD_DATA
                            </button>
                        </div>
                    </div>

                    {/* ── TOP KPI ROW ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10 lg:mb-14 animate-fade-in">
                        <KPIField label="Total_Incidents" value="2,842" trend={12.4} icon={AlertTriangle} color="#ef4444" />
                        <KPIField label="Active_Cases" value="482" trend={-4.2} icon={TrendingUp} color="#3b82f6" />
                        <KPIField label="Resolved_Units" value="2,360" trend={8.1} icon={CheckCircle2} color="#10b981" />
                        <KPIField label="Avg_Response" value="14.2m" trend={-15.8} icon={Clock} color="#a855f7" />
                        <KPIField label="Success_Rate" value="98.2%" trend={2.4} icon={Gauge} color="#00FFCC" />
                    </div>

                    {/* ── MIDDLE SECTION ── */}
                    <div className="grid grid-cols-12 gap-8 mb-10 lg:mb-14">
                        {/* Incident Trends: Line Chart */}
                        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <AnalyticsCard label="INCIDENT_TRAJECTORY_SYNC" accent="#3b82f6">
                                <div className="h-[300px] md:h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={INCIDENT_TREND_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontFamily: 'monospace' }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontFamily: 'monospace' }} 
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                            <Legend 
                                                verticalAlign="top" 
                                                align="right" 
                                                iconType="rect"
                                                wrapperStyle={{ paddingBottom: '20px', fontFamily: 'monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                                            />
                                            <Line 
                                                name="Incidents"
                                                type="monotone" 
                                                dataKey="incidents" 
                                                stroke="#ef4444" 
                                                strokeWidth={2} 
                                                dot={false}
                                                activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 2, fill: '#000' }}
                                            />
                                            <Line 
                                                name="Resolved"
                                                type="monotone" 
                                                dataKey="resolved" 
                                                stroke="#10b981" 
                                                strokeWidth={2} 
                                                dot={false}
                                                activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#000' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </AnalyticsCard>
                        </div>

                        {/* Incident Type: Pie Chart */}
                        <div className="col-span-12 lg:col-span-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <AnalyticsCard label="VECTOR_TAXONOMY_DIST" accent="#f59e0b">
                                <div className="h-[300px] md:h-[400px] w-full relative flex flex-col items-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={INCIDENT_TYPE_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {INCIDENT_TYPE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Central Indicator */}
                                    <div className="absolute top-[45%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest mb-1">Total</span>
                                        <span className="font-outfit font-black text-2xl md:text-3xl text-white leading-none">1,478</span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                                        {INCIDENT_TYPE_DATA.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnalyticsCard>
                        </div>
                    </div>

                    {/* ── NEXT SECTION ── */}
                    <div className="grid grid-cols-12 gap-8 mb-10 lg:mb-14">
                        {/* Region Analysis: Bar Chart */}
                        <div className="col-span-12 lg:col-span-7 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <AnalyticsCard label="GEOSPATIAL_LOAD_INTEL" accent="#a855f7">
                                <div className="h-[300px] md:h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={REGION_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={0}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontFamily: 'monospace' }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontFamily: 'monospace' }} 
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                            <Bar 
                                                name="Callouts"
                                                dataKey="count" 
                                                fill="#3b82f6" 
                                                radius={[2, 2, 0, 0]} 
                                                barSize={30}
                                            >
                                                {REGION_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </AnalyticsCard>
                        </div>

                        {/* Resource Utilization: Progress Bars */}
                        <div className="col-span-12 lg:col-span-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <AnalyticsCard label="ASSET_SATURATION_TELEM" accent="#10b981">
                                <div className="space-y-6 md:space-y-8 py-2 md:py-4">
                                    {RESOURCE_UTILIZATION.map((item, i) => (
                                        <div key={i} className="space-y-2 md:space-y-3">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-3 bg-white/10" />
                                                    <span className="font-mono text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-widest">{item.label}</span>
                                                </div>
                                                <span className="font-outfit font-black text-base md:text-lg text-white" style={{ color: item.value > 80 ? '#ef4444' : '#fff' }}>{item.value}%</span>
                                            </div>
                                            <div className="h-1.5 md:h-2 bg-white/5 border border-white/5 w-full relative overflow-hidden">
                                                <div 
                                                    className="h-full transition-all duration-1000 ease-out relative"
                                                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                                >
                                                    <div className="absolute top-0 right-0 w-8 h-full bg-white/20 animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Database size={10} className="text-white/20" />
                                            <span className="font-mono text-[7px] md:text-[8px] text-white/20 uppercase tracking-[0.2em]">Overall_Utilization</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="font-mono text-[8px] md:text-[9px] text-emerald-500 font-black uppercase tracking-widest italic">Stable</span>
                                        </div>
                                    </div>
                                </div>
                            </AnalyticsCard>
                        </div>
                    </div>

                    {/* ── RESPONSE TIME SECTION ── */}
                    <div className="grid grid-cols-12 gap-8 mb-10 lg:mb-14">
                        <div className="col-span-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <AnalyticsCard label="TEMPORAL_RESPONSE_INDEX" accent="#a855f7">
                                <div className="h-[250px] md:h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={RESPONSE_TIME_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                            <XAxis 
                                                dataKey="time" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontFamily: 'monospace' }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontFamily: 'monospace' }} 
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area 
                                                name="Avg Resp"
                                                type="monotone" 
                                                dataKey="avg" 
                                                stroke="#a855f7" 
                                                fillOpacity={1} 
                                                fill="url(#areaColor)" 
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </AnalyticsCard>
                        </div>
                    </div>

                    {/* ── BOTTOM ACTIVITY LOG ── */}
                    <div className="col-span-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <div className="bg-[#0E1015]/95 border border-white/5 p-6 md:p-8 group hover:border-white/10 transition-all duration-500">
                             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 pb-4 border-b border-white/5 gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="font-mono text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">SYSTEM_ACTIVITY_JOURNAL</span>
                                    </div>
                                    <h3 className="font-outfit font-black text-xl text-white uppercase tracking-tight">RECENT_PROTOCOL_EVENTS</h3>
                                </div>
                                <div className="flex gap-4">
                                     <button className="flex-1 md:flex-none p-2.5 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all flex justify-center">
                                        <Filter size={14} />
                                     </button>
                                     <button className="flex-1 md:flex-none p-2.5 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all flex justify-center">
                                        <Search size={14} />
                                     </button>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                 {ACTIVITY_LOG.map((log) => {
                                     const levelColors = {
                                         'Critical': 'text-red-500 border-red-500/20 bg-red-500/5',
                                         'Warning': 'text-amber-500 border-amber-500/20 bg-amber-500/5',
                                         'Success': 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
                                         'Info': 'text-blue-500 border-blue-500/20 bg-blue-500/5',
                                         'System': 'text-purple-500 border-purple-500/20 bg-purple-500/5',
                                     };
                                     return (
                                         <div key={log.id} className="p-5 md:p-6 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group/item">
                                             <div className="flex justify-between items-start">
                                                 <span className={`px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-widest border ${levelColors[log.level]}`}>
                                                     {log.level}
                                                 </span>
                                                 <span className="font-mono text-[8px] text-white/10 group-hover/item:text-white/30 transition-colors uppercase font-bold tracking-[0.2em]">{log.time}</span>
                                             </div>
                                             <div>
                                                 <span className="block font-outfit font-black text-base md:text-lg text-white uppercase tracking-tight leading-none mb-1">{log.event}</span>
                                                 <span className="font-mono text-[8px] md:text-[9px] text-white/20 uppercase tracking-widest flex items-center gap-2">
                                                     <Globe size={10} className="text-blue-500/40" /> {log.sector}
                                                 </span>
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>
                    </div>

                    {/* ── FOOTER METADATA ── */}
                    <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-10 pb-10">
                         <div className="flex gap-10 text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] font-black">
                            <span className="flex items-center gap-3 shadow-[0_0_10px_rgba(34,197,94,0.1)]"><div className="w-1 h-1 bg-emerald-500 rounded-full" />UPTIME: 99.998%</span>
                            <span className="flex items-center gap-3"><Zap size={12} />CORE_STABLE</span>
                         </div>
                         <div className="text-[9px] font-mono text-white/5 uppercase tracking-[0.8em] font-black">
                            CRISIS_ANALYTICS // TACTICAL_INTERFACE // V2.0.1_STABLE
                         </div>
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { 
                    opacity: 0;
                    animation: slide-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; 
                }
            `}} />
        </div>
    );
}
