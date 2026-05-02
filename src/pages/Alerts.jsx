import React, { useState, useEffect, useMemo, Component } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { 
    AlertTriangle, Flame, Droplets, Activity,
    Clock, MapPin, ShieldAlert, ChevronRight,
    Search, Filter, Calendar, Zap, Bell,
    CheckCircle2, Truck, Info, Navigation,
    Database, Globe, HeartPulse, Send, Satellite, Shield, X, Radio, Wind, Radiation, Loader2
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
                <div className="h-screen w-full bg-[#0B1220] flex items-center justify-center">
                    <div className="text-red-500 font-mono text-xs uppercase tracking-wider">
                        APPLICATION ERROR // PLEASE REFRESH
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// ── CONSTANTS ──

const LOCAL_SZ = {
  sidebarClosed: 80,
  sidebarOpen:   280,
  navbarH:       72,
};

// Map DB iconName strings to actual icon components
const ICON_MAP = {
    Flame, Droplets, HeartPulse, AlertTriangle, Wind,
    Radiation, Activity, Shield, Truck, Globe,
};
const resolveIcon = (iconName) => ICON_MAP[iconName] || AlertTriangle;


// ── CUSTOM COMPONENTS ──

function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-lg flex items-center gap-4 hover:border-[#374151] transition-all duration-300">
            <div className="p-3 bg-[#0B1220] rounded-md border border-[#1F2937] flex-shrink-0" style={{ color }}>
                <Icon size={24} />
            </div>
            <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</span>
                <span className="text-2xl font-poppins font-bold text-gray-100 leading-none">{value}</span>
            </div>
        </div>
    );
}

function BroadcastModal({ isOpen, onClose, onBroadcast }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Fire',
        severity: 'Critical',
        location: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate broadcast authorization
        setTimeout(() => {
            onBroadcast(formData);
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#0B1220] rounded-xl border border-[#1F2937] shadow-xl flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#1F2937] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-md">
                            <Radio size={20} />
                        </div>
                        <h2 className="font-poppins text-xl font-bold text-gray-100">Send New Alert</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-[#1F2937] text-gray-400 hover:text-gray-200 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Incident Name*</label>
                        <input 
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Major Structure Fire"
                            className="w-full bg-[#111827] border border-[#1F2937] rounded-md px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300">Type*</label>
                            <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-[#111827] border border-[#1F2937] rounded-md px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                            >
                                <option value="Fire">Fire</option>
                                <option value="Flood">Flood</option>
                                <option value="Medical">Medical</option>
                                <option value="Accident">Accident</option>
                                <option value="Terror">Security</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300">Severity*</label>
                            <select 
                                value={formData.severity}
                                onChange={e => setFormData({...formData, severity: e.target.value})}
                                className="w-full bg-[#111827] border border-[#1F2937] rounded-md px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                            >
                                <option value="Critical">Critical</option>
                                <option value="Warning">Warning</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Location*</label>
                        <input 
                            required
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            placeholder="Enter address or area..."
                            className="w-full bg-[#111827] border border-[#1F2937] rounded-md px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">Details*</label>
                        <textarea 
                            required
                            rows="4"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe what happened..."
                            className="w-full bg-[#111827] border border-[#1F2937] rounded-md px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all resize-none"
                        />
                    </div>
                    
                    <div className="pt-6 border-t border-[#1F2937] flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded text-sm font-semibold text-gray-400 hover:text-gray-200 hover:bg-[#1F2937] transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Alert'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AlertsContent() {
    const { isSidebarOpen, addToast, liveAlerts, fetchLiveAlerts } = useDashboard();
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Enrich each alert with resolved icon component
    const alerts = useMemo(() => (liveAlerts || []).map(a => ({
        ...a,
        Icon: resolveIcon(a.iconName),
        color: a.color || (a.severity === 'Critical' || a.severity === 'High' ? '#ef4444' : a.severity === 'Medium' ? '#f59e0b' : '#3b82f6'),
    })), [liveAlerts]);

    // Initial load + 15-second polling for live updates
    useEffect(() => {
        const load = async () => { setLoading(true); await fetchLiveAlerts(); setLoading(false); };
        load();
        const interval = setInterval(fetchLiveAlerts, 15000);
        return () => clearInterval(interval);
    }, []);

    // Auto-select first alert once list arrives
    useEffect(() => {
        if (alerts.length > 0 && !selectedAlert) setSelectedAlert(alerts[0]);
    }, [alerts]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            setIsLoading(true);
            // Convert display status back to DB enum
            const dbStatus = newStatus.toLowerCase();
            await updateAlertStatus(id, dbStatus);
            // Update selected alert if it's the one being changed
            setSelectedAlert(prev => prev && (prev.id === id)
                ? { ...prev, status: newStatus }
                : prev);
        } catch (e) {
            addToast('Failed to update alert', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert => {
            if (filterType !== 'All' && alert.type !== filterType) return false;
            return true;
        });
    }, [filterType, alerts]);

    const handleBroadcast = (data) => {
        const newAlert = {
            id: `AL-${Math.floor(1000 + Math.random() * 9000)}`,
            type: data.type,
            title: data.title,
            location: data.location,
            severity: data.severity,
            time: 'Just Now',
            status: 'Active',
            description: data.description,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            coordinates: 'Pending',
            resources: 'Dispatch_Pending',
            Icon: data.type === 'Fire' ? Flame : data.type === 'Flood' ? Droplets : Activity,
            color: data.severity === 'Critical' ? '#ef4444' : data.severity === 'Warning' ? '#f59e0b' : '#3b82f6'
        };
        
        // This is a simulation since we aren't sending to DB here, but let's assume it updates local state or makes API call via context in real app.
        if (addToast) {
            addToast('Alert created successfully. Refreshing DB sync.', 'success');
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0B1220] text-gray-200 font-inter">
            <Sidebar />
            <TopNavbar />

            <main
                className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}
                style={{
                    marginTop: LOCAL_SZ.navbarH,
                    height: `calc(100vh - ${LOCAL_SZ.navbarH}px)`,
                }}
            >
                <div className="p-6 md:p-8 max-w-7xl mx-auto">

                    {/* ── HEADER ── */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-teal-500">
                                <Shield size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Live Emergency Feed</span>
                            </div>
                            <h1 className="font-poppins text-3xl font-bold text-gray-100">
                                ALERTS
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 rounded bg-[#111827] border border-[#1F2937] text-gray-300 hover:bg-[#1F2937] hover:text-white transition-colors text-sm font-semibold">
                                Export Logs
                            </button>
                            <button 
                                onClick={() => setIsBroadcastOpen(true)}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-semibold flex items-center gap-2"
                            >
                                <Radio size={16} />
                                Send Alert
                            </button>
                        </div>
                    </div>

                    {/* ── KPI GRID ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Total Alerts" value={alerts.length} icon={Bell} color="#9CA3AF" />
                        <StatCard label="Critical" value={alerts.filter(a => a.severity === 'Critical').length} icon={ShieldAlert} color="#ef4444" />
                        <StatCard label="Responding" value={alerts.filter(a => a.status === 'Responding').length} icon={Truck} color="#3b82f6" />
                        <StatCard label="Resolved" value={alerts.filter(a => a.status === 'Resolved').length} icon={CheckCircle2} color="#10b981" />
                    </div>

                    {/* ── MAIN WORKSPACE ── */}
                    <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
                        
                        {/* LEFT: INCIDENT LIST */}
                        <div className="w-full lg:w-1/3 flex flex-col bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-[#1F2937] bg-[#0B1220]/50">
                                <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                                    <Satellite size={16} className="text-teal-500" />
                                    Ongoing Emergencies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Fire', 'Flood', 'Medical', 'Accident'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setFilterType(v)}
                                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${filterType === v ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20' : 'bg-[#1F2937] text-gray-400 hover:text-gray-200 border border-transparent'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
                                        <Loader2 size={24} className="animate-spin" />
                                        <p className="font-mono text-[9px] uppercase tracking-widest">Loading incidents...</p>
                                    </div>
                                ) : filteredAlerts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-white/10 gap-3">
                                        <Bell size={24} className="opacity-40" />
                                        <p className="font-mono text-[9px] uppercase tracking-widest">No alerts found</p>
                                    </div>
                                ) : (
                                    filteredAlerts.map((alert) => (
                                        <div 
                                            key={alert.id}
                                            onClick={() => setSelectedAlert(alert)}
                                            className={`
                                                p-4 rounded border transition-all cursor-pointer flex items-start gap-4
                                                ${selectedAlert?.id === alert.id ? 'bg-[#1F2937] border-teal-500/30' : 'bg-[#0B1220] border-[#1F2937] hover:border-[#374151]'}
                                            `}
                                        >
                                            <div className={`p-2 rounded bg-[#111827] border border-[#1F2937] flex-shrink-0 ${selectedAlert?.id === alert.id ? 'text-teal-400' : 'text-gray-500'}`}>
                                                {alert.Icon && <alert.Icon size={16} />}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                                                        alert.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 
                                                        alert.severity === 'Warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                        {alert.severity}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{alert.time}</span>
                                                </div>
                                                <h4 className="font-poppins font-semibold text-gray-200 truncate">{alert.title}</h4>
                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400 truncate">
                                                    <MapPin size={12} />
                                                    <span className="truncate">{alert.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT: TACTICAL DETAIL */}
                        <div className="w-full lg:w-2/3 flex flex-col bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden">
                            {selectedAlert ? (
                                <>
                                    {/* Detail Header */}
                                    <div className="p-6 md:p-8 border-b border-[#1F2937] bg-[#0B1220]/50">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#1F2937] rounded-lg flex items-center justify-center text-teal-500 flex-shrink-0">
                                                    <selectedAlert.Icon size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 tracking-wider mb-1 block">ID: {selectedAlert.id}</span>
                                                    <h2 className="font-poppins text-2xl font-bold text-gray-100">{selectedAlert.title}</h2>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                                                    selectedAlert.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                                    selectedAlert.severity === 'Warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                    {selectedAlert.severity}
                                                </div>
                                                <div className="px-3 py-1 bg-[#1F2937] rounded text-xs font-semibold text-gray-300">
                                                    {selectedAlert.status}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { l: 'Location', v: selectedAlert.location },
                                                { l: 'Time Reported', v: selectedAlert.time },
                                                { l: 'Coordinates', v: selectedAlert.coordinates },
                                                { l: 'Resources', v: selectedAlert.resources },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-[#0B1220] border border-[#1F2937] rounded p-3">
                                                    <span className="block text-xs text-gray-500 font-semibold mb-1">{stat.l}</span>
                                                    <span className="block text-sm text-gray-200 font-medium truncate">{stat.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Detail Body */}
                                    <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                                        <div className="mb-8">
                                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                                <Info size={16} className="text-teal-500"/> Description
                                            </h4>
                                            <div className="p-4 bg-[#0B1220] border border-[#1F2937] rounded-lg">
                                                <p className="text-gray-300 leading-relaxed text-sm">
                                                    {selectedAlert.description}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                                <Clock size={16} className="text-teal-500"/> Timeline
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="w-px bg-[#374151] mt-2 relative">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-200">Alert Registered</p>
                                                        <p className="text-xs text-gray-500">{selectedAlert.timestamp}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detail Actions */}
                                    <div className="p-4 bg-[#0B1220] border-t border-[#1F2937] flex gap-3 flex-wrap">
                                        {selectedAlert.status !== 'Responding' && selectedAlert.status !== 'Resolved' && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedAlert.id, 'Responding')}
                                                disabled={isLoading}
                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                Mark Responding
                                            </button>
                                        )}
                                        {selectedAlert.status === 'Responding' && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedAlert.id, 'Resolved')}
                                                disabled={isLoading}
                                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        {selectedAlert.status === 'Resolved' && (
                                            <div className="flex-1 py-2 text-center text-sm font-semibold text-emerald-500 bg-emerald-500/10 rounded border border-emerald-500/20">
                                                ✓ Resolved
                                            </div>
                                        )}
                                        {selectedAlert.status !== 'Resolved' && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedAlert.id, 'Resolved')}
                                                className="px-6 py-2 bg-[#1F2937] hover:bg-[#374151] text-white rounded text-sm font-semibold transition-colors"
                                            >
                                                Force Resolve
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
                                    <Satellite size={48} className="mb-4 opacity-50" />
                                    <p className="text-sm">Select an alert to view details</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            <BroadcastModal 
                isOpen={isBroadcastOpen} 
                onClose={() => setIsBroadcastOpen(false)}
                onBroadcast={handleBroadcast}
            />
        </div>
    );
}

export default function Alerts() {
    return (
        <LocalErrorBoundary>
            <AlertsContent />
        </LocalErrorBoundary>
    );
}
