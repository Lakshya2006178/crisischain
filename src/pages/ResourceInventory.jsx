import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SZ } from '../DashboardMain';
import {
    Search, Plus, Package, MapPin, Database, Hospital,
    AlertCircle, CheckCircle2, ChevronRight, Pill,
    Truck, Navigation, Clock, Activity, Send, HeartPulse, Wrench
} from 'lucide-react';

function Toast({ message, type }) {
    const bg = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#00c8ff';
    return (
        <div className="font-inter px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white"
            style={{ background: bg, border: '1px solid rgba(255,255,255,.12)' }}>
            {message}
        </div>
    );
}

function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
            {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
        </div>
    );
}

// MiniMap visual for Hospital cards
const MiniMap = ({ isFull, isNear }) => {
    const colorClass = isFull ? "text-red-500 border-red-500" : isNear ? "text-yellow-500 border-yellow-500" : "text-[#00c8ff] border-[#00c8ff]";
    const bgColor = isFull ? "bg-red-500" : isNear ? "bg-yellow-500" : "bg-[#00c8ff]";
    const pulseColor = isFull ? "border-red-500" : isNear ? "border-yellow-500" : "border-[#00c8ff]";
    const strokeHex = isFull ? "#ef4444" : isNear ? "#eab308" : "#00c8ff";

    return (
        <div className="relative w-full h-24 bg-slate-900/40 rounded-xl overflow-hidden border border-slate-700/50 mb-5 flex items-center justify-center">
            {/* Map Grid/Topography Mock */}
            <svg viewBox="0 0 100 40" className="absolute w-full h-full opacity-30" preserveAspectRatio="none">
                <path d="M0,20 Q15,5 25,20 T50,20 T75,5 T100,20" fill="none" stroke={strokeHex} strokeWidth="0.8" />
                <path d="M-10,30 Q10,15 25,30 T50,30 T75,15 T110,30" fill="none" stroke={strokeHex} strokeWidth="0.4" />
                <path d="M0,10 Q25,-5 50,10 T100,10" fill="none" stroke={strokeHex} strokeWidth="0.3" strokeDasharray="2 2" />
                <line x1="30" y1="0" x2="30" y2="40" stroke={strokeHex} strokeWidth="0.5" strokeDasharray="1 2" />
                <line x1="70" y1="0" x2="70" y2="40" stroke={strokeHex} strokeWidth="0.5" strokeDasharray="1 2" />
            </svg>

            {/* Pulsating Map Pin (Red if full) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-3 h-3 rounded-full ${bgColor} shadow-[0_0_8px_currentColor] ${colorClass}`} />
                <div className={`absolute -inset-2 rounded-full border ${pulseColor} animate-ping opacity-60`} style={{ animationDuration: '1.5s' }} />
                <div className={`absolute -inset-4 rounded-full border ${pulseColor} animate-ping opacity-30`} style={{ animationDuration: '2.5s' }} />
            </div>

            {/* Label Overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700/50">
                <span className="font-inter text-[9px] font-bold tracking-[0.1em] text-slate-300 uppercase">
                    Live Sector Sync
                </span>
            </div>
        </div>
    );
};

export default function ResourceInventory() {
    const { toasts, isSidebarOpen } = useDashboard();
    const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;

    const [activeTab, setActiveTab] = useState('hospitals');

    // Supplies State
    const [resources, setResources] = useState([
        { id: 1, name: 'Medical Kits', quantity: 500, unit: 'kits', location: 'Main Warehouse' },
        { id: 2, name: 'Bottled Water', quantity: 2000, unit: 'liters', location: 'Sector A Storage' },
        { id: 3, name: 'Blankets', quantity: 1500, unit: 'units', location: 'Camp B Supply' },
        { id: 4, name: 'Emergency Rations', quantity: 3000, unit: 'kg', location: 'Main Warehouse' },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: 'kg', location: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hospital State
    const [hospitals] = useState([
        { id: 1, name: 'City Central Hospital', distance: '1.2 km', bedsTotal: 200, bedsAvailable: 0, status: 'Full', medicines: { critical: 40, general: 120 } },
        { id: 2, name: 'Northside Medical Center', distance: '3.5 km', bedsTotal: 150, bedsAvailable: 45, status: 'Available', medicines: { critical: 80, general: 300 } },
        { id: 3, name: 'St. Jude Emergency', distance: '4.1 km', bedsTotal: 80, bedsAvailable: 5, status: 'Near Capacity', medicines: { critical: 10, general: 50 } },
        { id: 4, name: 'Field Care Unit A', distance: '0.8 km', bedsTotal: 40, bedsAvailable: 30, status: 'Available', medicines: { critical: 20, general: 80 } },
    ]);
    const [hospitalSearch, setHospitalSearch] = useState('');

    // Fleet & Logistics State
    const [fleet] = useState([
        { id: 1, unit: 'AMB-01', type: 'Ambulance', status: 'En Route', location: 'Sector B - Evac', eta: '5 mins' },
        { id: 2, unit: 'TRK-05', type: 'Supply Truck', status: 'Available', location: 'Main Warehouse', eta: '-' },
        { id: 3, unit: 'HELI-A', type: 'Air Support', status: 'Deployed', location: 'North Mountains', eta: 'Arrived' },
        { id: 4, unit: 'AMB-02', type: 'Ambulance', status: 'Maintenance', location: 'City Garage', eta: '-' },
        { id: 5, unit: 'TRK-08', type: 'Command Vehicle', status: 'Available', location: 'HQ Base', eta: '-' },
    ]);
    const [fleetSearch, setFleetSearch] = useState('');

    // Recent Dispatches
    const [dispatches] = useState([
        { id: 101, item: 'Medical Kits', qty: 50, to: 'St. Jude Emergency', time: '10 mins ago', status: 'In Transit' },
        { id: 102, item: 'Bottled Water', qty: 200, to: 'Sector B Evac', time: '25 mins ago', status: 'Delivered' },
        { id: 103, item: 'Blankets', qty: 100, to: 'Field Care Unit A', time: '1 hour ago', status: 'Delivered' },
        { id: 104, item: 'Emergency Rations', qty: 500, to: 'Camp B Supply', time: '2 hours ago', status: 'Delivered' },
    ]);

    useEffect(() => {
        fetch('/api/resources')
            .then(res => res.json())
            .then(data => { if (data && data.length > 0) setResources(data); })
            .catch(() => { });
    }, []);

    const handleAddStock = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const addedItem = {
                id: Date.now(),
                name: newItem.name,
                quantity: Number(newItem.quantity),
                unit: newItem.unit,
                location: newItem.location
            };
            setResources([...resources, addedItem]);
            setIsSubmitting(false);
            setIsSpaceModalOpen(false);
            setNewItem({ name: '', quantity: '', unit: 'kg', location: '' });
        }, 600);
    };

    const filteredResources = resources.filter(res => res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredHospitals = hospitals.filter(hosp => hosp.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || hosp.status.toLowerCase().includes(hospitalSearch.toLowerCase()));
    const filteredFleet = fleet.filter(f => f.unit.toLowerCase().includes(fleetSearch.toLowerCase()) || f.type.toLowerCase().includes(fleetSearch.toLowerCase()) || f.status.toLowerCase().includes(fleetSearch.toLowerCase()));

    const getFleetIcon = (type) => {
        switch (type) {
            case 'Ambulance': return <HeartPulse className="w-5 h-5" />;
            case 'Supply Truck': return <Truck className="w-5 h-5" />;
            case 'Air Support': return <Navigation className="w-5 h-5" />;
            default: return <Activity className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: '#070d2a' }}>
            <Sidebar />
            <TopNavbar />

            <main
                className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300"
                style={{
                    marginLeft: ml,
                    marginTop: SZ.navbarH,
                    height: `calc(100vh - ${SZ.navbarH}px)`,
                }}
            >
                <div className="p-8 lg:p-12 max-w-[1400px] mx-auto text-slate-200">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-[#1a2a5e] pb-8">
                        <div>
                            <span className="font-bebas text-[#00c8ff]" style={{ fontSize: 14, letterSpacing: ".28em", display: "block", marginBottom: 6 }}>NETWORK STATUS</span>
                            <h1 className="font-bebas text-slate-100 flex items-center gap-4" style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: ".04em", lineHeight: 1 }}>
                                RESOURCE & FACILITY<br />MANAGEMENT
                            </h1>
                            <p className="font-inter text-slate-400 mt-4 max-w-2xl" style={{ fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", lineHeight: 1.8 }}>
                                Track NGO supplies, monitor real-time hospital capacities, and manage logistics fleet globally.
                            </p>
                        </div>

                        {activeTab === 'supplies' && (
                            <button
                                onClick={() => setIsSpaceModalOpen(true)}
                                className="font-inter text-white rounded-full transition-all flex items-center gap-2"
                                style={{
                                    background: "#e53935",
                                    padding: "16px 36px",
                                    fontSize: 15,
                                    letterSpacing: ".1em",
                                    fontWeight: 700,
                                    boxShadow: "0 0 24px rgba(229,57,53,.45)",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 42px rgba(229,57,53,.8)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(229,57,53,.45)"; }}
                            >
                                <Plus className="w-5 h-5" /> ADD NEW STOCK
                            </button>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'supplies', label: 'NGO SUPPLIES', icon: Package },
                            { id: 'hospitals', label: 'HOSPITALS & MAPS', icon: Hospital },
                            { id: 'fleet', label: 'FLEET & LOGISTICS', icon: Truck },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-3.5 font-inter font-bold text-[13px] rounded-full transition-all whitespace-nowrap flex items-center gap-2 border-2`}
                                    style={{
                                        letterSpacing: ".1em",
                                        background: isActive ? (tab.id === 'hospitals' ? "rgba(0,200,255,.1)" : "rgba(229,57,53,.1)") : "transparent",
                                        color: isActive ? (tab.id === 'hospitals' ? "#00c8ff" : "#e53935") : "rgba(255,255,255,.5)",
                                        borderColor: isActive ? (tab.id === 'hospitals' ? "rgba(0,200,255,.4)" : "rgba(229,57,53,.4)") : "rgba(255,255,255,.15)",
                                    }}
                                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; e.currentTarget.style.color = "#fff"; } }}
                                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; } }}
                                >
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area - Supplies */}
                    {activeTab === 'supplies' && (
                        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left: Inventory Table */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH RESOURCES..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#0a1130] border border-[#1a2a5e] rounded-xl py-4 pl-14 pr-4 transition-colors font-inter text-sm font-semibold tracking-wider text-white"
                                        style={{ outline: "none" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#e53935"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                    />
                                </div>

                                <div className="bg-[#0a1130] border border-[#1a2a5e] rounded-xl overflow-hidden shadow-xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[700px]">
                                            <thead>
                                                <tr className="border-b border-[#1a2a5e] font-bebas text-slate-400" style={{ fontSize: 16, letterSpacing: ".12em" }}>
                                                    <th className="px-6 py-5 font-normal">ITEM NAME</th>
                                                    <th className="px-6 py-5 font-normal">QUANTITY</th>
                                                    <th className="px-6 py-5 font-normal">LOCATION</th>
                                                    <th className="px-6 py-5 font-normal text-right">STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredResources.length > 0 ? filteredResources.map((item) => (
                                                    <tr key={item.id} className="border-b border-[#1a2a5e]/50 hover:bg-[#0f1a42] transition-colors cursor-pointer">
                                                        <td className="px-6 py-5 font-inter text-[14px] font-bold text-slate-100 tracking-wide">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center text-[#e53935]" style={{ border: "1px solid rgba(229,57,53,.3)", background: "rgba(229,57,53,.1)" }}>
                                                                    <Package className="w-4 h-4" />
                                                                </div>
                                                                {item.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 font-inter">
                                                            <span className="font-bebas text-2xl text-slate-100 mr-2 tracking-wider">{item.quantity.toLocaleString()}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] border border-[#1a2a5e] px-2 py-1 rounded">
                                                                {item.unit}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 font-inter text-[13px] text-slate-300 font-medium tracking-wide">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-[#e53935] flex-shrink-0" />
                                                                <span className="truncate max-w-[150px]">{item.location}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            {item.quantity > 500 ? (
                                                                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.1em] text-[#00c8ff] border border-[#00c8ff]/30 bg-[#00c8ff]/10 px-3 py-1.5 rounded-full whitespace-nowrap">
                                                                    <CheckCircle2 className="w-3 h-3" /> OPTIMAL
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.1em] text-[#e53935] border border-[#e53935]/30 bg-[#e53935]/10 px-3 py-1.5 rounded-full whitespace-nowrap">
                                                                    <AlertCircle className="w-3 h-3" /> LOW STOCK
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-16 text-center text-slate-500 font-inter text-[13px] tracking-widest uppercase font-bold">
                                                            No resources match criteria
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Recent Dispatches */}
                            <div className="lg:col-span-1">
                                <div className="bg-[#0a1130] border border-[#1a2a5e] rounded-xl p-8 h-full shadow-xl">
                                    <h3 className="font-bebas text-2xl tracking-[0.1em] text-slate-100 mb-6 flex items-center gap-3 border-b border-[#1a2a5e] pb-5">
                                        <div style={{ width: 8, height: 8, background: "#00c8ff", borderRadius: "50%", boxShadow: "0 0 10px #00c8ff" }} />
                                        LIVE DISPATCHES
                                    </h3>

                                    <div className="space-y-5">
                                        {dispatches.map(dispatch => (
                                            <div key={dispatch.id} className="relative pl-6 pb-5 border-l-2 border-[#1a2a5e] last:border-transparent last:pb-0">
                                                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full" style={{ background: "#e53935", boxShadow: "0 0 8px rgba(229,57,53,0.8)" }} />
                                                <div className="bg-[#070d2a] border border-[#1a2a5e] rounded-xl p-5 hover:border-[#e53935]/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-inter text-[13px] font-bold text-slate-100 tracking-wide">{dispatch.item}</span>
                                                        <span className="font-bebas text-lg tracking-wider text-[#e53935] bg-[#e53935]/10 px-2 py-0.5 rounded border border-[#e53935]/20">
                                                            x{dispatch.qty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] font-inter text-slate-400 font-semibold mb-3">
                                                        <MapPin className="w-3.5 h-3.5 text-[#00c8ff]" /> TO: {dispatch.to}
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-inter uppercase font-bold tracking-[0.15em]">
                                                        <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {dispatch.time}</span>
                                                        <span style={{ color: dispatch.status === 'In Transit' ? "#00c8ff" : "#64748b" }}>
                                                            {dispatch.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Area - Hospitals */}
                    {activeTab === 'hospitals' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-6 relative max-w-xl">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="SEARCH HOSPITALS..."
                                    value={hospitalSearch}
                                    onChange={(e) => setHospitalSearch(e.target.value)}
                                    className="w-full bg-[#0a1130] border border-[#1a2a5e] rounded-xl py-4 pl-14 pr-4 transition-colors font-inter text-sm font-semibold tracking-wider text-white"
                                    style={{ outline: "none" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#00c8ff"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredHospitals.length > 0 ? filteredHospitals.map(hosp => {
                                    const isFull = hosp.status === 'Full';
                                    const isNear = hosp.status === 'Near Capacity';

                                    const statusColor = isFull ? '#e53935' : isNear ? '#eab308' : '#00c8ff';
                                    const pctFull = Math.round(((hosp.bedsTotal - hosp.bedsAvailable) / hosp.bedsTotal) * 100);

                                    return (
                                        <div key={hosp.id} className="bg-[#0a1130] border border-[#1a2a5e] rounded-xl p-6 shadow-xl hover:border-[#00c8ff]/50 transition-colors relative overflow-hidden group">

                                            {/* MINI MAP COMPONENT */}
                                            <MiniMap isFull={isFull} isNear={isNear} />

                                            {/* Status Badge Overlapped */}
                                            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                                                <span className="px-3 py-1 rounded bg-[#070d2a]/90 backdrop-blur border text-[10px] font-bold uppercase tracking-[0.15em]"
                                                    style={{ borderColor: statusColor, color: statusColor }}>
                                                    {hosp.status}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-4 mb-6 pr-20 relative z-10">
                                                <div className="w-12 h-12 rounded-full border border-[rgba(0,200,255,0.3)] bg-[rgba(0,200,255,0.1)] flex flex-shrink-0 items-center justify-center text-[#00c8ff]">
                                                    <Hospital className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold font-inter text-slate-100 uppercase tracking-wide">{hosp.name}</h3>
                                                    <p className="text-[12px] font-inter font-bold text-slate-400 flex items-center gap-1.5 mt-1 tracking-wider uppercase">
                                                        <MapPin className="w-3.5 h-3.5 text-[#e53935]" /> {hosp.distance} AWAY
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-[#070d2a] rounded-xl p-4 border border-[#1a2a5e]">
                                                    <p className="text-[10px] font-inter text-slate-400 uppercase tracking-[0.1em] mb-2 font-bold">AVAILABLE BEDS</p>
                                                    <div className="flex items-end gap-2">
                                                        <span className="font-bebas text-4xl leading-none" style={{ color: statusColor, letterSpacing: ".05em" }}>
                                                            {hosp.bedsAvailable}
                                                        </span>
                                                        <span className="text-xs font-inter font-bold text-slate-500 pb-1">/ {hosp.bedsTotal}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-[#1a2a5e] rounded-full mt-3 overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${pctFull}%`, background: statusColor }} />
                                                    </div>
                                                </div>

                                                <div className="bg-[#070d2a] rounded-xl p-4 border border-[#1a2a5e]">
                                                    <p className="text-[10px] font-inter text-slate-400 uppercase tracking-[0.1em] mb-2 font-bold flex items-center gap-1.5">
                                                        <Pill className="w-3.5 h-3.5" /> MEDICINES
                                                    </p>
                                                    <div className="mt-2 space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical</span>
                                                            <span className="font-bebas text-lg text-slate-200 tracking-widest">{hosp.medicines.critical}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">General</span>
                                                            <span className="font-bebas text-lg text-slate-200 tracking-widest">{hosp.medicines.general}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {isFull ? (
                                                <button className="w-full text-white py-3.5 rounded-full font-inter text-[12px] font-bold uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-3 border border-[#e53935] hover:bg-[#e53935]">
                                                    <Search className="w-4 h-4" /> FIND ALTERNATIVE
                                                </button>
                                            ) : (
                                                <button className="w-full bg-[#00c8ff] hover:bg-[#009ecc] text-slate-900 py-3.5 rounded-full font-inter text-[12px] font-extrabold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:shadow-[0_0_25px_rgba(0,200,255,0.6)]">
                                                    ROUTE PATIENTS <ChevronRight className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-12 text-center text-slate-500 font-inter font-bold tracking-widest uppercase">
                                        No hospitals match criteria
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content Area - Fleet */}
                    {activeTab === 'fleet' && (
                        <div className="animate-in fade-in duration-300">
                            {/* Similar adjustments for Fleet if needed, keeping it consistent */}
                            <div className="mb-6 relative max-w-xl">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="SEARCH FLEET..."
                                    value={fleetSearch}
                                    onChange={(e) => setFleetSearch(e.target.value)}
                                    className="w-full bg-[#0a1130] border border-[#1a2a5e] rounded-xl py-4 pl-14 pr-4 transition-colors font-inter text-sm font-semibold tracking-wider text-white"
                                    style={{ outline: "none" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#00c8ff"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFleet.length > 0 ? filteredFleet.map(unit => {
                                    const isEnRoute = unit.status === 'En Route' || unit.status === 'Deployed';
                                    const isMaint = unit.status === 'Maintenance';
                                    const statusColor = isEnRoute ? '#00c8ff' : isMaint ? '#e53935' : '#10b981';

                                    return (
                                        <div key={unit.id} className="bg-[#0a1130] border border-[#1a2a5e] rounded-xl p-6 shadow-xl relative">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center border"
                                                        style={{ borderColor: `${statusColor}40`, background: `${statusColor}10`, color: statusColor }}>
                                                        {isMaint ? <Wrench className="w-5 h-5" /> : getFleetIcon(unit.type)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bebas text-2xl tracking-[0.1em] text-slate-100">{unit.unit}</h3>
                                                        <p className="text-[11px] font-bold uppercase tracking-wider font-inter text-slate-400">{unit.type}</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 rounded bg-[#070d2a] border text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap"
                                                    style={{ borderColor: statusColor, color: statusColor }}>
                                                    {unit.status}
                                                </span>
                                            </div>

                                            <div className="space-y-4 p-5 bg-[#070d2a] rounded-xl border border-[#1a2a5e] flex flex-col justify-between" style={{ minHeight: 120 }}>
                                                <div>
                                                    <p className="text-[10px] font-inter text-slate-400 uppercase tracking-[0.1em] mb-1.5 font-bold flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5" /> CURRENT LOCATION
                                                    </p>
                                                    <p className="font-inter text-[13px] font-bold tracking-wide text-slate-200">{unit.location}</p>
                                                </div>

                                                {isEnRoute ? (
                                                    <div className="border-t border-[#1a2a5e] pt-4 flex justify-between items-center">
                                                        <span className="text-[10px] font-inter text-slate-500 uppercase tracking-[0.15em] font-bold flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-[#00c8ff]" /> ETA
                                                        </span>
                                                        <span className="font-bebas text-xl tracking-[0.1em] text-[#00c8ff]">{unit.eta}</span>
                                                    </div>
                                                ) : (
                                                    <div className="border-t border-[#1a2a5e] pt-4 flex justify-between items-center">
                                                        <span className="text-[10px] font-inter text-slate-500 uppercase tracking-[0.15em] font-bold">
                                                            STATUS DETAIL
                                                        </span>
                                                        <span className="font-inter text-[12px] font-bold uppercase tracking-wide text-slate-400">
                                                            {isMaint ? 'Out of Service' : 'Stationed'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {!isMaint && !isEnRoute && (
                                                <button className="w-full mt-5 bg-transparent border-2 hover:bg-white/5 py-3 rounded-full font-inter text-[12px] font-bold uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2"
                                                    style={{ borderColor: statusColor, color: statusColor }}>
                                                    <Send className="w-4 h-4" /> DISPATCH UNIT
                                                </button>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-12 text-center text-slate-500 font-inter font-bold tracking-widest uppercase">
                                        No fleet units match criteria
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Add Stock Modal */}
            {isSpaceModalOpen && (
                <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0a1130] border border-[#1a2a5e] rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                        <div className="px-8 py-6 border-b border-[#1a2a5e] flex justify-between items-center bg-[#070d2a]">
                            <h2 className="font-bebas text-3xl text-slate-100 tracking-[0.1em] flex items-center gap-4">
                                <Package className="w-7 h-7 text-[#e53935]" />
                                ADD NEW STOCK
                            </h2>
                            <button onClick={() => setIsSpaceModalOpen(false)} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddStock} className="p-8 flex flex-col gap-6">
                            <div>
                                <label className="block text-[11px] font-inter text-slate-400 mb-2 uppercase font-bold tracking-[0.15em]">ITEM NAME</label>
                                <input
                                    required
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-[#070d2a] border border-[#1a2a5e] rounded-xl py-4 px-4 font-inter text-sm font-semibold tracking-wider text-slate-200 transition-all outline-none"
                                    style={{ outline: "none" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#e53935"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                />
                            </div>
                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <label className="block text-[11px] font-inter text-slate-400 mb-2 uppercase font-bold tracking-[0.15em]">QUANTITY</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        className="w-full bg-[#070d2a] border border-[#1a2a5e] rounded-xl py-4 px-4 font-inter text-sm font-semibold tracking-wider text-slate-200 transition-all outline-none"
                                        onFocus={e => e.currentTarget.style.borderColor = "#e53935"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-[11px] font-inter text-slate-400 mb-2 uppercase font-bold tracking-[0.15em]">UNIT</label>
                                    <select
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-full bg-[#070d2a] border border-[#1a2a5e] rounded-xl py-4 px-4 font-inter text-sm font-semibold tracking-wider text-slate-200 transition-all outline-none uppercase"
                                        onFocus={e => e.currentTarget.style.borderColor = "#e53935"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                    >
                                        <option value="kg">KG</option>
                                        <option value="liters">LITERS</option>
                                        <option value="kits">KITS</option>
                                        <option value="units">UNITS</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-inter text-slate-400 mb-2 uppercase font-bold tracking-[0.15em]">LOCATION</label>
                                <input
                                    required
                                    type="text"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    className="w-full bg-[#070d2a] border border-[#1a2a5e] rounded-xl py-4 px-4 font-inter text-sm font-semibold tracking-wider text-slate-200 transition-all outline-none"
                                    onFocus={e => e.currentTarget.style.borderColor = "#e53935"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#1a2a5e"}
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-4 pt-6 border-t border-[#1a2a5e]">
                                <button
                                    type="button"
                                    onClick={() => setIsSpaceModalOpen(false)}
                                    className="px-6 py-3 rounded-full font-inter text-[12px] font-bold tracking-[0.1em] text-slate-300 hover:bg-[#1a2a5e] transition-colors border border-transparent hover:border-slate-700"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="text-white px-8 py-3 rounded-full font-inter text-[12px] font-bold tracking-[0.15em] transition-all disabled:opacity-50"
                                    style={{
                                        background: "#e53935",
                                        boxShadow: "0 0 18px rgba(229,57,53,.4)",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.boxShadow = "0 0 28px rgba(229,57,53,.7)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "#e53935"; e.currentTarget.style.boxShadow = "0 0 18px rgba(229,57,53,.4)"; }}
                                >
                                    {isSubmitting ? 'SAVING...' : 'ADD STOCK'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer toasts={toasts} />
        </div>
    );
}
