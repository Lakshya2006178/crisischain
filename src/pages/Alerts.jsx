import React, { useState, useEffect, useMemo, Component } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { 
    AlertTriangle, Flame, Droplets, Activity,
    Clock, MapPin, ShieldAlert, ChevronRight,
    Search, Filter, Calendar, Zap, Bell,
    CheckCircle2, Truck, Info, Navigation,
    Database, Globe, HeartPulse, Send, Satellite, Shield, X, Radio
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
                <div className="h-screen w-full bg-[#08080A] flex items-center justify-center">
                    <div className="text-red-500 font-mono text-[9px] uppercase tracking-[0.5em] animate-pulse">
                        UPLINK_FAILURE // REBOOT_REQUIRED
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

const MOCK_ALERTS = [
    {
        id: 'AL-9284',
        type: 'Fire',
        title: 'Thermal Breach Detected',
        location: 'Industrial Sector 7',
        severity: 'Critical',
        time: '2 mins ago',
        status: 'Active',
        description: 'Multiple thermal anomalies detected in the primary chemical storage unit. Risk of structural failure is high. Immediate exclusion zone required.',
        timestamp: '2026-03-31 22:15:42',
        coordinates: '34.0522° N, 118.2437° W',
        resources: '3 Fire Teams dispatched',
        Icon: Flame,
        color: '#ef4444'
    },
    {
        id: 'AL-9285',
        type: 'Flood',
        title: 'Levee Integrity Warning',
        location: 'Riverfront Alpha',
        severity: 'Warning',
        time: '8 mins ago',
        status: 'Responding',
        description: 'Water levels reaching critical limits at North Levee point. Internal sensors indicate minor seepage. Repair crews are on-site.',
        timestamp: '2026-03-31 22:09:12',
        coordinates: '34.1245° N, 118.1567° W',
        resources: '1 Engineering Corps',
        Icon: Droplets,
        color: '#3b82f6'
    },
    {
        id: 'AL-9286',
        type: 'Medical',
        title: 'Multi-Casualty Event',
        location: 'Central Plaza',
        severity: 'Critical',
        time: '12 mins ago',
        status: 'Active',
        description: 'Large scale medical emergency reported following structural collapse. Heavy smoke in the area. Triage stations established.',
        timestamp: '2026-03-31 22:05:01',
        coordinates: '34.0456° N, 118.2589° W',
        resources: '5 Ambulances, 2 Mobile Med Units',
        Icon: Activity,
        color: '#10b981'
    },
    {
        id: 'AL-9287',
        type: 'Accident',
        title: 'High-Velocity Collision',
        location: 'Highway 101-North',
        severity: 'Low',
        time: '25 mins ago',
        status: 'Resolved',
        description: 'Multi-vehicle collision blocking three lanes. No hazardous material leaked. Cleanup in progress.',
        timestamp: '2026-03-31 21:52:18',
        coordinates: '34.0987° N, 118.3214° W',
        resources: 'Highway Patrol, Towing Unit',
        Icon: Truck,
        color: '#f59e0b'
    },
    {
        id: 'AL-9288',
        type: 'Fire',
        title: 'Brush Fire Escalation',
        location: 'Canyon Ridge',
        severity: 'Critical',
        time: '45 mins ago',
        status: 'Active',
        description: 'Rapidly spreading brush fire due to high wind speeds. Residents in evacuation zone 4 must leave immediately.',
        timestamp: '2026-03-31 21:32:05',
        coordinates: '34.1567° N, 118.4123° W',
        resources: 'Aerial Support, Fire Group 12',
        Icon: Flame,
        color: '#ef4444'
    }
];

// ── CUSTOM COMPONENTS ──

function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div className="bg-[#14171F] border border-white/5 p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-20 h-20 blur-[40px] opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity`} 
                 style={{ backgroundColor: color }} />
            
            <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-white/5 border border-white/5 text-white/40 group-hover:text-white transition-all">
                    <Icon size={16} />
                </div>
                <div className="w-1 h-3 bg-white/5" />
            </div>
            
            <div>
                <span className="block text-[8px] font-mono text-white/30 uppercase tracking-[0.3em] mb-1">{label}</span>
                <span className="text-2xl font-outfit font-black text-white tracking-tighter leading-none">{value}</span>
            </div>
            
            {/* Visual Micro-line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.02]">
                <div className="h-full bg-white/10 w-0 group-hover:w-full transition-all duration-700" />
            </div>
        </div>
    );
}

function SectionLabel({ text, icon: Icon }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="p-1.5 bg-white/5 border border-white/5 text-red-500">
                {Icon && <Icon size={12} />}
            </div>
            <span className="font-mono text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">{text}</span>
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
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-2xl bg-[#08080A] border border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.1)]">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 animate-pulse" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Radio size={14} className="text-red-500 animate-pulse" />
                            <span className="font-mono text-[10px] text-red-500 uppercase tracking-[0.5em] font-black">Create New Alert</span>
                        </div>
                        <h2 className="font-outfit text-4xl font-black text-white tracking-tighter uppercase leading-none">New Alert</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 transition-all text-white/40 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-3">
                        <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-black ml-1">Alert Title*</label>
                        <input 
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Brief incident summary..."
                            className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-6 py-4 font-mono text-xs text-white uppercase tracking-widest outline-none transition-all placeholder:text-white/5"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-black ml-1">Type*</label>
                            <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-[#0E1015] border border-white/5 focus:border-red-500/40 px-6 py-4 font-mono text-xs text-white uppercase tracking-widest outline-none transition-all"
                            >
                                <option value="Fire">Fire</option>
                                <option value="Flood">Flood</option>
                                <option value="Medical">Medical</option>
                                <option value="Accident">Accident</option>
                                <option value="Terror">Security</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-black ml-1">Severity*</label>
                            <select 
                                value={formData.severity}
                                onChange={e => setFormData({...formData, severity: e.target.value})}
                                className="w-full bg-[#0E1015] border border-white/5 focus:border-red-500/40 px-6 py-4 font-mono text-xs text-white uppercase tracking-widest outline-none transition-all"
                            >
                                <option value="Critical" className="text-red-500">Critical</option>
                                <option value="Warning" className="text-amber-500">Warning</option>
                                <option value="Low" className="text-blue-500">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-black ml-1">Location*</label>
                        <input 
                            required
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            placeholder="Location or area..."
                            className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-6 py-4 font-mono text-xs text-white uppercase tracking-widest outline-none transition-all placeholder:text-white/5"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-black ml-1">Description*</label>
                        <textarea 
                            required
                            rows="4"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe the incident in detail..."
                            className="w-full bg-white/5 border border-white/5 focus:border-red-500/40 px-6 py-4 font-mono text-xs text-white uppercase tracking-widest outline-none transition-all resize-none placeholder:text-white/5"
                        />
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end gap-6">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 font-mono text-[10px] text-white/20 hover:text-white font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-12 py-4 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:grayscale"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Alert'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AlertsContent() {
    const { isSidebarOpen, addToast } = useDashboard();
    const [selectedAlert, setSelectedAlert] = useState(MOCK_ALERTS[0]);
    const [filterType, setFilterType] = useState('All');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [alerts, setAlerts] = useState(MOCK_ALERTS);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
            coordinates: 'LAT_LONG_FIXED',
            resources: 'Dispatch_Pending',
            Icon: data.type === 'Fire' ? Flame : data.type === 'Flood' ? Droplets : Activity,
            color: data.severity === 'Critical' ? '#ef4444' : data.severity === 'Warning' ? '#f59e0b' : '#3b82f6'
        };
        
        setAlerts([newAlert, ...alerts]);
        setSelectedAlert(newAlert);
        if (addToast) {
            addToast('Alert created successfully', 'priority');
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
            
            {/* ── AMBIENT TACTICAL OVERLAY ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444] animate-scan-y top-0" />
            </div>

            {/* Mouse Glow */}
            <div 
                className="fixed w-[600px] h-[600px] rounded-full blur-[200px] bg-red-600/5 pointer-events-none z-0 transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` }}
            />

            <Sidebar />
            <TopNavbar />

            <main
                className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-500 relative z-10 custom-scrollbar will-change-transform ${isSidebarOpen ? 'ml-sidebar-open' : 'ml-sidebar-closed'}`}
                style={{
                    marginTop: LOCAL_SZ.navbarH,
                    height: `calc(100vh - ${LOCAL_SZ.navbarH}px)`,
                }}
            >
                <div className="max-w-[1920px] mx-auto fluid-p">

                    {/* ── HEADER ── */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 lg:pb-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Shield size={14} className="text-red-500" />
                                <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-red-500 uppercase">Alerts Management</span>
                            </div>
                            <h1 className="font-outfit text-4xl font-black tracking-tighter uppercase text-white leading-none">
                                ALERTS
                            </h1>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
                            <button className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-mono text-[9px] font-black tracking-widest uppercase">
                                Export
                            </button>
                            <button 
                                onClick={() => setIsBroadcastOpen(true)}
                                className="px-8 py-2.5 bg-red-600 text-white hover:brightness-110 transition-all font-mono text-[9px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                            >
                                New Alert
                            </button>
                        </div>
                    </div>

                    {/* ── KPI GRID ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
                        <StatCard label="Active Incidents" value={alerts.length} icon={Bell} color="#ef4444" />
                        <StatCard label="Critical" value={alerts.filter(a => a.severity === 'Critical').length} icon={ShieldAlert} color="#ef4444" />
                        <StatCard label="In Progress" value="28" icon={Truck} color="#3b82f6" />
                        <StatCard label="Resolved" value="116" icon={CheckCircle2} color="#10b981" />
                    </div>

                    {/* ── OPERATIONS WORKSPACE ── */}
                    <div className="grid grid-cols-12 gap-8 mb-20 relative z-10">
                        
                        {/* LEFT: INCIDENT STREAM */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <SectionLabel text="INCOMING_THREAT_VECTORS" icon={Satellite} />
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['All', 'Fire', 'Flood', 'Medical'].map(v => (
                                    <button 
                                        key={v}
                                        onClick={() => setFilterType(v)}
                                        className={`px-4 py-2 font-mono text-[8px] font-black uppercase tracking-widest transition-all ${filterType === v ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
                                    >
                                        [{v}]
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-3">
                                {filteredAlerts.map((alert) => (
                                    <div 
                                        key={alert.id}
                                        onClick={() => setSelectedAlert(alert)}
                                        className={`
                                            p-5 border transition-all duration-300 cursor-pointer group relative
                                            ${selectedAlert && selectedAlert.id === alert.id ? 'bg-red-500/5 border-red-500/30' : 'bg-[#0E1015]/95 border-white/5 hover:border-white/10'}
                                        `}
                                    >
                                        <div className="flex items-start gap-5">
                                            <div className={`p-3 border border-white/5 flex flex-shrink-0 items-center justify-center transition-all ${selectedAlert && selectedAlert.id === alert.id ? 'text-red-500' : 'text-white/10 group-hover:text-white/30'}`}>
                                                {alert.Icon && <alert.Icon size={18} />}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className={`font-mono text-[8px] font-bold uppercase tracking-widest ${
                                                        alert.severity === 'Critical' ? 'text-red-500' : 'text-white/20'
                                                    }`}>
                                                        {alert.severity}
                                                    </span>
                                                    <span className="font-mono text-[8px] text-white/10 uppercase font-bold">{alert.time}</span>
                                                </div>
                                                <h3 className="font-outfit font-black text-base text-white uppercase tracking-tight truncate group-hover:text-red-500 transition-colors">{alert.title}</h3>
                                                <div className="mt-2 flex items-center gap-2 text-white/20 font-mono text-[9px] uppercase tracking-widest">
                                                    <MapPin size={10} />
                                                    {alert.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: TACTICAL DETAIL */}
                        <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="h-full bg-[#0E1015]/95 border border-white/5 flex flex-col relative overflow-hidden group/detail shadow-2xl">
                                
                                {selectedAlert ? (
                                    <>
                                        {/* Detail Header */}
                                        <div className="px-8 py-10 border-b border-white/5 bg-white/[0.02]">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 flex flex-shrink-0 items-center justify-center text-red-600 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                                        <selectedAlert.Icon size={32} />
                                                    </div>
                                                    <div>
                                                        <span className="font-mono text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">{selectedAlert.id} // UPLINK_SYNC</span>
                                                        <h2 className="font-outfit font-black text-3xl lg:text-4xl text-white uppercase tracking-tighter leading-none mt-1">{selectedAlert.title}</h2>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className={`px-4 py-1.5 border font-mono text-[10px] font-black uppercase tracking-[0.2em] ${
                                                        selectedAlert.severity === 'Critical' ? 'bg-red-600 text-white border-red-400' : 'bg-white/5 text-white border-white/10'
                                                    }`}>
                                                        {selectedAlert.severity}
                                                    </div>
                                                    <span className="font-mono text-[9px] text-white/20 uppercase font-black mt-2">{selectedAlert.coordinates}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { l: 'LOCALITY', v: selectedAlert.location },
                                                    { l: 'TIME_ELAPSED', v: selectedAlert.time },
                                                    { l: 'UPLINK_SOURCE', v: 'ALPHA_HUB' },
                                                    { l: 'STATUS', v: selectedAlert.status },
                                                ].map((stat, i) => (
                                                    <div key={i} className="bg-black/20 border border-white/5 p-4 py-3">
                                                        <span className="block text-[7px] font-mono text-white/20 uppercase tracking-widest mb-1">{stat.l}</span>
                                                        <span className="block font-mono text-[10px] text-white font-black uppercase">{stat.v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Detail Body */}
                                        <div className="p-8 lg:p-10 flex-1 space-y-12">
                                            <div>
                                                <SectionLabel text="INCIDENT_SYNOPSIS" icon={Info} />
                                                <p className="font-outfit font-bold text-xl lg:text-2xl text-white/70 leading-relaxed pl-6 border-l border-red-600/30">
                                                    {selectedAlert.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                   <SectionLabel text="RESOURCE_ALLOTMENT" icon={Truck} />
                                                   <div className="bg-blue-600/5 border border-blue-600/10 p-6">
                                                      <span className="block text-[8px] font-mono text-blue-400/60 uppercase tracking-widest mb-2">Deployed_Assets</span>
                                                      <span className="text-xl font-outfit font-black text-white uppercase">{selectedAlert.resources}</span>
                                                   </div>
                                                </div>
                                                <div className="space-y-6">
                                                   <SectionLabel text="TEMPORAL_DATA" icon={Clock} />
                                                   <div className="space-y-4 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                                                      <div className="flex items-center gap-3">
                                                          <div className="w-1 h-1 bg-white/20 rounded-full" />
                                                          <span>LOGGED: {selectedAlert.timestamp}</span>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                          <div className="w-1 h-1 bg-white/20 rounded-full" />
                                                          <span>AUTH_KEY: AES_512_SECURE</span>
                                                      </div>
                                                   </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detail Actions */}
                                        <div className="p-8 lg:p-10 bg-white/[0.01] border-t border-white/5 flex gap-4">
                                            <button className="flex-1 py-4 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-lg">
                                                INITIALIZE_RESPONSE
                                            </button>
                                            <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                                                MARK_RESOLVED
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center p-20 grayscale opacity-20">
                                        <Satellite size={80} strokeWidth={0.5} />
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ── FOOTER ── */}
                    <div className="mt-20 border-t border-white/5 pt-10 pb-10 flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="flex gap-10 text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] font-black">
                            <span className="flex items-center gap-3"><div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />CORE_UPLINK: ACTIVE</span>
                            <span className="flex items-center gap-3"><Database size={12} />SECURE_VOX_SYNC</span>
                         </div>
                         <div className="text-[9px] font-mono text-white/5 uppercase tracking-[0.8em] font-black">
                            TACTICAL_ALERTS // VER_5.4.1
                         </div>
                    </div>

                </div>
            </main>

            <BroadcastModal 
                isOpen={isBroadcastOpen} 
                onClose={() => setIsBroadcastOpen(false)}
                onBroadcast={handleBroadcast}
            />

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
                
                @keyframes scan-y {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
                .animate-scan-y { animation: scan-y 10s linear infinite; }
                
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .animate-slide-up { animation: slide-up 0.8s ease-out forwards; opacity: 0; }
                @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}} />
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
