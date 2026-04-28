import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import * as apiClient from '../api/index.js';
import {
    Activity, TrendingUp, AlertTriangle, CheckCircle2, 
    Clock, Gauge, Globe, Zap, Database, BarChart3, 
    ArrowUpRight, ArrowDownRight, Search, Filter, Calendar
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ── MOCK DATA FOR CHARTS THAT AREN'T FULLY DB DRIVEN ──

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
    { label: 'Communication Hubs', value: 92, color: '#14B8A6' },
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
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 flex flex-col justify-between h-32 hover:border-[#374151] transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <Icon size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-400">{label}</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <span className="text-3xl font-poppins font-bold text-gray-100">{value}</span>
            </div>
            <div className="mt-2 h-1 w-full bg-[#1F2937] rounded-full overflow-hidden">
                 <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%', backgroundColor: color }} />
            </div>
        </div>
    );
}

function AnalyticsCard({ children, label }) {
    return (
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 flex flex-col h-full hover:border-[#374151] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-200">{label}</h3>
                <span className="px-2 py-1 bg-[#1F2937] rounded text-xs font-medium text-gray-400">Live Data</span>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

// ── MAIN PAGE COMPONENT ──

export default function Analytics() {
    const { isSidebarOpen, stats } = useDashboard();
    const [isLoading, setIsLoading] = useState(true);

    // Real chart data from API
    const [incidentTrendData, setIncidentTrendData] = useState([]);
    const [incidentTypeData, setIncidentTypeData] = useState([]);
    const [responseTimeData, setResponseTimeData] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const [distRes, trendsRes, responseRes] = await Promise.all([
                    apiClient.fetchDistribution(),
                    apiClient.fetchTrends(),
                    apiClient.fetchResponseTrends(),
                ]);

                // Distribution: [{id: 'fire', count: 5}] -> pie chart format
                const colorMap = { fire: '#ef4444', flood: '#3b82f6', medical: '#10b981', accident: '#f59e0b' };
                setIncidentTypeData(
                    (distRes.data || []).map(d => ({
                        name: d.id ? (d.id.charAt(0).toUpperCase() + d.id.slice(1)) : 'Other',
                        value: d.count,
                        color: colorMap[d.id] || '#a855f7',
                    }))
                );

                // Incident trends: [{id: '10:00', count: 3}] -> line chart format
                setIncidentTrendData(
                    (trendsRes.data || []).map(d => ({
                        name: d.id,
                        incidents: d.count,
                        resolved: 0,
                    }))
                );

                // Response trends: [{id: '2026-04-28', avgResponse: 12.5}]
                setResponseTimeData(
                    (responseRes.data || []).map(d => ({
                        time: d.id,
                        avg: Math.round(d.avgResponse || 0),
                    }))
                );
            } catch (err) {
                console.warn('Analytics fetch error:', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0B1220] border border-[#1F2937] rounded-lg p-3 shadow-xl">
                    <p className="text-xs font-semibold text-gray-400 mb-2 border-b border-[#1F2937] pb-1">{label}</p>
                    <div className="space-y-1.5">
                        {payload.map((p, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-xs text-gray-200">{p.name}: <span className="font-bold">{p.value}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex h-screen w-full bg-[#0B1220] text-gray-200 font-inter">
            <Sidebar />
            <TopNavbar />

            <main
                className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}
                style={{
                    marginTop: 72,
                    height: `calc(100vh - 72px)`,
                }}
            >
                <div className="p-6 md:p-8 max-w-7xl mx-auto">

                    {/* ── HEADER ── */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-teal-500">
                                <Activity size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Performance Analytics</span>
                            </div>
                            <h1 className="font-poppins text-3xl font-bold text-gray-100">
                                DASHBOARD
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#1F2937] rounded text-sm text-gray-400">
                                <Calendar size={14} />
                                <span>Last 30 Days</span>
                            </div>
                            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-semibold transition-colors">
                                Export Data
                            </button>
                        </div>
                    </div>

                    {/* ── TOP KPI ROW ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <KPIField label="Total Incidents" value={stats.total} trend={12.4} icon={AlertTriangle} color="#ef4444" />
                        <KPIField label="Active Cases" value={stats.active} trend={-4.2} icon={TrendingUp} color="#3b82f6" />
                        <KPIField label="Resolved" value={stats.resolved} trend={8.1} icon={CheckCircle2} color="#10b981" />
                        <KPIField label="Avg Response" value={`${stats.avgResponseTime ? stats.avgResponseTime.toFixed(1) : '0.0'}m`} trend={-15.8} icon={Clock} color="#a855f7" />
                        <KPIField label="Success Rate" value={stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : '0%'} trend={2.4} icon={Gauge} color="#14B8A6" />
                    </div>

                    {/* ── MIDDLE SECTION ── */}
                    <div className="grid grid-cols-12 gap-6 mb-6">
                        {/* Incident Trends: Line Chart */}
                        <div className="col-span-12 lg:col-span-8">
                            <AnalyticsCard label="Incident Trend Analysis">
                                <div className="h-[300px] w-full">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading...</div>
                                    ) : incidentTrendData.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">No data yet</div>
                                    ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={incidentTrendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1 }} />
                                            <Legend 
                                                verticalAlign="top" 
                                                align="right" 
                                                iconType="circle"
                                                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', color: '#9CA3AF' }}
                                            />
                                            <Line 
                                                name="Incidents"
                                                type="monotone" 
                                                dataKey="incidents" 
                                                stroke="#ef4444" 
                                                strokeWidth={2} 
                                                dot={false}
                                                activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 2, fill: '#0B1220' }}
                                            />
                                            <Line 
                                                name="Resolved"
                                                type="monotone" 
                                                dataKey="resolved" 
                                                stroke="#10b981" 
                                                strokeWidth={2} 
                                                dot={false}
                                                activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#0B1220' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    )}
                                </div>
                            </AnalyticsCard>
                        </div>

                        {/* Incident Type: Pie Chart */}
                        <div className="col-span-12 lg:col-span-4">
                            <AnalyticsCard label="Incident Categories">
                                <div className="h-[300px] w-full relative flex flex-col items-center">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading...</div>
                                    ) : incidentTypeData.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">No data yet</div>
                                    ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={incidentTypeData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={4}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {incidentTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    )}
                                    {/* Central Indicator */}
                                    <div className="absolute top-[45%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <span className="text-xs text-gray-500 mb-1">Total</span>
                                        <span className="font-poppins font-bold text-2xl text-gray-100 leading-none">{incidentTypeData.reduce((s, d) => s + d.value, 0)}</span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                                        {incidentTypeData.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-xs text-gray-400">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnalyticsCard>
                        </div>
                    </div>

                    {/* ── NEXT SECTION ── */}
                    <div className="grid grid-cols-12 gap-6 mb-6">
                        {/* Region Analysis: Bar Chart */}
                        <div className="col-span-12 lg:col-span-7">
                            <AnalyticsCard label="Regional Load Overview">
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={REGION_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={0}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1F2937' }} />
                                            <Bar 
                                                name="Callouts"
                                                dataKey="count" 
                                                fill="#3b82f6" 
                                                radius={[4, 4, 0, 0]} 
                                                barSize={32}
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
                        <div className="col-span-12 lg:col-span-5">
                            <AnalyticsCard label="Resource Allocation">
                                <div className="space-y-4 py-2">
                                    {RESOURCE_UTILIZATION.map((item, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-semibold text-gray-300">{item.label}</span>
                                                <span className="text-sm font-bold" style={{ color: item.value > 80 ? '#ef4444' : '#fff' }}>{item.value}%</span>
                                            </div>
                                            <div className="h-1.5 bg-[#1F2937] rounded-full w-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AnalyticsCard>
                        </div>
                    </div>

                    {/* ── RESPONSE TIME SECTION ── */}
                    <div className="grid grid-cols-12 gap-6 mb-6">
                        <div className="col-span-12">
                            <AnalyticsCard label="Response Time Distribution">
                                <div className="h-[250px] w-full">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading...</div>
                                    ) : responseTimeData.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">No response data yet</div>
                                    ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={responseTimeData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                                            <XAxis 
                                                dataKey="time" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area 
                                                name="Avg Resp"
                                                type="monotone" 
                                                dataKey="avg" 
                                                stroke="#8b5cf6" 
                                                fillOpacity={1} 
                                                fill="url(#areaColor)" 
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                     </ResponsiveContainer>
                                    )}
                                </div>
                            </AnalyticsCard>
                        </div>
                    </div>

                    {/* ── BOTTOM ACTIVITY LOG ── */}
                    <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6">
                         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-[#1F2937] gap-4">
                            <h3 className="text-sm font-semibold text-gray-200">System Activity Log</h3>
                            <div className="flex gap-2">
                                 <button className="p-2 bg-[#1F2937] rounded text-gray-400 hover:text-gray-200 transition-colors">
                                    <Filter size={16} />
                                 </button>
                                 <button className="p-2 bg-[#1F2937] rounded text-gray-400 hover:text-gray-200 transition-colors">
                                    <Search size={16} />
                                 </button>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                             {ACTIVITY_LOG.map((log) => {
                                 const levelColors = {
                                     'Critical': 'text-red-500 bg-red-500/10',
                                     'Warning': 'text-amber-500 bg-amber-500/10',
                                     'Success': 'text-emerald-500 bg-emerald-500/10',
                                     'Info': 'text-blue-500 bg-blue-500/10',
                                     'System': 'text-purple-500 bg-purple-500/10',
                                 };
                                 return (
                                     <div key={log.id} className="p-4 bg-[#0B1220] border border-[#1F2937] rounded-lg flex flex-col gap-3">
                                         <div className="flex justify-between items-center">
                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${levelColors[log.level]}`}>
                                                 {log.level}
                                             </span>
                                             <span className="text-[10px] text-gray-500 font-medium">{log.time}</span>
                                         </div>
                                         <div>
                                             <span className="block font-poppins font-semibold text-sm text-gray-200 mb-1">{log.event}</span>
                                             <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                                                 <Globe size={12} className="text-gray-400" /> {log.sector}
                                             </span>
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
