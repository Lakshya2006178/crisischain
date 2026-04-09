import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SZ } from '../DashboardMain';
import {
    Search, Plus, Package, MapPin, Database, Hospital,
    AlertCircle, CheckCircle2, ChevronRight, Pill,
    Truck, Navigation, Clock, Activity, Send, HeartPulse, Wrench, Shield, Globe, Zap
} from 'lucide-react';

function Toast({ message, type }) {
    const bg = type === 'error' ? 'rgba(239, 68, 68, 0.1)' : type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 240, 255, 0.1)';
    const border = type === 'error' ? 'rgba(239, 68, 68, 0.2)' : type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 240, 255, 0.2)';
    const textColor = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#00F0FF';
    
    return (
      <div className="font-mono px-6 py-4 backdrop-blur-3xl border text-[10px] font-bold tracking-[0.2em] uppercase"
           style={{background: bg, borderColor: border, color: textColor}}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: textColor}} />
          {message}
        </div>
      </div>
    );
}

function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
            {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
        </div>
    );
}

// MiniMap visual for Hospital cards
const MiniMap = ({ isFull, isNear }) => {
    const colorClass = isFull ? "text-red-500 border-red-500" : isNear ? "text-yellow-500 border-yellow-500" : "text-[#00FFCC] border-[#00FFCC]";
    const bgColor = isFull ? "bg-red-500" : isNear ? "bg-yellow-500" : "bg-[#00FFCC]";
    const pulseColor = isFull ? "border-red-500" : isNear ? "border-yellow-500" : "border-[#00FFCC]";
    const strokeHex = isFull ? "#ef4444" : isNear ? "#eab308" : "#00FFCC";

    return (
        <div className="relative w-full h-24 bg-black/40 rounded-xl overflow-hidden border border-white/5 mb-5 flex items-center justify-center">
            {/* Map Grid/Topography Mock */}
            <svg viewBox="0 0 100 40" className="absolute w-full h-full opacity-20" preserveAspectRatio="none">
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
            </div>

            {/* Label Overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/5">
                <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-white/40 uppercase">
                    Location Data
                </span>
            </div>
        </div>
    );
};

export default function ResourceInventory() {
    const { toasts, isSidebarOpen } = useDashboard();
    const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const [activeTab, setActiveTab] = useState('hospitals');

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
        <div className="flex h-screen w-full overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
            
            {/* ── AMBIENT MESH BACKGROUND ── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div 
                  className="absolute w-[1000px] h-[1000px] rounded-full blur-[200px] opacity-[0.05] bg-blue-600 transition-transform duration-1000 ease-out"
                  style={{ transform: `translate(${mousePos.x - 500}px, ${mousePos.y - 500}px)` }}
                />
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[180px] opacity-[0.03] bg-cyan-500 animate-pulse" />
                <div className="absolute inset-0 opacity-[0.02] contrast-150 brightness-150 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            <Sidebar />
            <TopNavbar />

            <main
                className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-500 relative z-10 custom-scrollbar"
                style={{
                    marginLeft: ml,
                    marginTop: SZ.navbarH,
                    height: `calc(100vh - ${SZ.navbarH}px)`,
                }}
            >
                <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">

                    {/* Header Section */}
                    <div className="mb-12 animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-[#00FFCC]/40" />
                            <span className="text-[10px] font-mono tracking-[0.6em] text-[#00FFCC] uppercase">Resource_Inventory_Summary</span>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                           <h1 className="font-outfit text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
                             RESOURCE<br />
                             <span className="bg-gradient-to-r from-[#00FFCC] via-white to-white/40 bg-clip-text text-transparent italic">HUB</span>
                           </h1>
                           
                           {activeTab === 'supplies' && (
                                <button
                                    onClick={() => setIsSpaceModalOpen(true)}
                                    className="px-10 py-5 bg-[#00FFCC] text-black font-outfit font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-4 shadow-[0_0_40px_rgba(0,255,204,0.15)]"
                                >
                                    <Plus className="w-6 h-6" /> Add Stock
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { id: 'supplies', label: 'STOCK_OVERVIEW', icon: Package },
                            { id: 'hospitals', label: 'FACILITY_CAPACITY', icon: Hospital },
                            { id: 'fleet', label: 'LOGISTICS_FLEET', icon: Truck },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-10 py-4 font-mono font-bold text-[10px] tracking-[0.3em] transition-all whitespace-nowrap flex items-center gap-4 border border-white/5 backdrop-blur-3xl uppercase ${isActive ? 'bg-[#00FFCC] text-black border-transparent' : 'bg-white/5 text-white/40 hover:text-white hover:border-white/10'}`}
                                >
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area - Supplies */}
                    {activeTab === 'supplies' && (
                        <div className="grid grid-cols-12 gap-8 animate-slide-up">

                            {/* Left: Inventory Table */}
                            <div className="col-span-12 lg:col-span-8 space-y-6">
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH_INVENTORY..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/20 transition-all text-white placeholder:text-white/10 uppercase"
                                    />
                                </div>

                                <div className="bg-white/5 border border-white/5 backdrop-blur-3xl overflow-hidden overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-white/5 font-mono text-white/20 text-[10px] tracking-[0.4em] uppercase">
                                                <th className="px-8 py-6 font-normal">ITEM_NAME / ID</th>
                                                <th className="px-8 py-6 font-normal">QUANTITY</th>
                                                <th className="px-8 py-6 font-normal">LOCATION</th>
                                                <th className="px-8 py-6 font-normal text-right">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredResources.length > 0 ? filteredResources.map((item) => (
                                                <tr key={item.id} className="border-b border-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group">
                                                    <td className="px-8 py-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#00FFCC] group-hover:border-[#00FFCC]/40 transition-all">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col leading-tight">
                                                                <span className="font-outfit font-black text-lg text-white uppercase tracking-tight">{item.name}</span>
                                                                <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest mt-1">ID: {item.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 font-mono">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-outfit font-black text-3xl text-white tracking-tighter">{item.quantity.toLocaleString()}</span>
                                                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest opacity-60">
                                                                {item.unit}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8">
                                                        <div className="flex items-center gap-3 text-white/40">
                                                            <MapPin className="w-4 h-4 text-[#00FFCC]" />
                                                            <span className="font-mono text-[11px] uppercase tracking-widest truncate max-w-[180px]">{item.location}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 text-right">
                                                        {item.quantity > 500 ? (
                                                            <span className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                                                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" /> Adequate
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                                                                <AlertCircle className="w-3.5 h-3.5" /> Low Stock
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-8 py-20 text-center text-white/10 font-mono text-[11px] tracking-[0.5em] uppercase">
                                                        No supplies found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right Panel: Recent Dispatches */}
                            <div className="col-span-12 lg:col-span-4">
                                <div className="bg-white/5 border border-white/5 backdrop-blur-3xl p-10 h-full">
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-2 h-2 bg-[#00FFCC] rounded-full animate-pulse shadow-[0_0_10px_#00FFCC]" />
                                        <h3 className="font-outfit font-black text-2xl tracking-tighter text-white uppercase">Live Dispatches</h3>
                                    </div>

                                    <div className="space-y-8">
                                        {dispatches.map(dispatch => (
                                            <div key={dispatch.id} className="relative pl-10 border-l border-white/5 last:border-transparent">
                                                <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full border border-red-500/40 bg-red-600/20 shadow-[0_0_8px_rgba(239,57,53,0.4)]" />
                                                <div className="bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all p-6 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-outfit font-black text-lg text-white uppercase tracking-tight leading-none">{dispatch.item}</span>
                                                        <span className="font-mono text-xs font-black text-red-500 tracking-wider">
                                                            x{dispatch.qty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                                        <Globe className="w-3.5 h-3.5 text-blue-400" /> TO: {dispatch.to}
                                                    </div>
                                                    <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-[0.3em] font-bold mt-4 pt-4 border-t border-white/[0.02]">
                                                        <span className="text-white/20 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {dispatch.time}</span>
                                                        <span className={dispatch.status === 'In Transit' ? "text-blue-400" : "text-white/10"}>
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
                        <div className="animate-slide-up">
                            <div className="mb-10 relative max-w-xl group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH_HOSPITALS..."
                                    value={hospitalSearch}
                                    onChange={(e) => setHospitalSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/20 transition-all text-white placeholder:text-white/10 uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredHospitals.length > 0 ? filteredHospitals.map(hosp => {
                                    const isFull = hosp.status === 'Full';
                                    const isNear = hosp.status === 'Near Capacity';
                                    const statusColor = isFull ? '#ef4444' : isNear ? '#f59e0b' : '#00FFCC';
                                    const pctFull = Math.round(((hosp.bedsTotal - hosp.bedsAvailable) / hosp.bedsTotal) * 100);

                                    return (
                                        <div key={hosp.id} className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 hover:border-[#00FFCC]/20 transition-all relative overflow-hidden group">
                                            
                                            {/* Pulsing state ring */}
                                            <div className="absolute top-[-40px] right-[-40px] w-32 h-32 border border-white/[0.02] rounded-full group-hover:scale-110 transition-transform" />

                                            <MiniMap isFull={isFull} isNear={isNear} />

                                            <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-2">
                                                <span className="px-4 py-1.5 bg-black/60 backdrop-blur border text-[9px] font-mono font-black uppercase tracking-[0.2em]"
                                                    style={{ borderColor: `${statusColor}40`, color: statusColor }}>
                                                    {hosp.status}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-6 mb-10 pr-24 relative z-10">
                                                <div className="w-14 h-14 bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center text-[#00FFCC] group-hover:border-[#00FFCC]/40 transition-all">
                                                    <Hospital className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-2xl font-outfit font-black text-white uppercase tracking-tight leading-none">{hosp.name}</h3>
                                                    <p className="text-[10px] font-mono font-bold text-white/20 flex items-center gap-2 mt-2 tracking-widest uppercase italic">
                                                        <MapPin className="w-3.5 h-3.5 text-red-500" /> {hosp.distance} RADIUS
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                                                <div className="bg-white/[0.03] p-6 border border-white/5">
                                                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 font-bold">Available Beds</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-outfit font-black text-4xl leading-none tracking-tighter" style={{ color: statusColor }}>
                                                            {hosp.bedsAvailable}
                                                        </span>
                                                        <span className="text-sm font-outfit font-black text-white/10">/ {hosp.bedsTotal}</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-white/5 mt-4 overflow-hidden">
                                                        <div className="h-full transition-all duration-1000" style={{ width: `${pctFull}%`, background: statusColor }} />
                                                    </div>
                                                </div>

                                                <div className="bg-white/[0.03] p-6 border border-white/5">
                                                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 font-bold flex items-center gap-3">
                                                        <Zap className="w-3.5 h-3.5 text-blue-400" /> EMERGENCY_STOCK
                                                    </p>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest">CRITICAL</span>
                                                            <span className="font-outfit font-black text-lg text-white leading-none">{hosp.medicines.critical}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest">GENERAL</span>
                                                            <span className="font-outfit font-black text-lg text-white leading-none">{hosp.medicines.general}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className={`w-full py-5 font-outfit font-black text-xs uppercase tracking-[0.3em] transition-all group-hover:scale-[1.02] ${isFull ? 'bg-white/5 border border-red-500/20 text-red-500' : 'bg-[#00FFCC] text-black shadow-[0_0_30px_rgba(0,255,204,0.1)]'}`}>
                                                {isFull ? 'Find Alternatives' : 'Set Routing'}
                                            </button>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-20 text-center text-white/10 font-mono tracking-[0.5em] uppercase text-sm">
                                        No hospitals found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content Area - Fleet */}
                    {activeTab === 'fleet' && (
                        <div className="animate-slide-up">
                            <div className="mb-10 relative max-w-xl group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#00FFCC] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search fleet..."
                                    value={fleetSearch}
                                    onChange={(e) => setFleetSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 px-16 py-6 font-mono text-sm tracking-widest focus:outline-none focus:border-[#00FFCC]/20 transition-all text-white placeholder:text-white/10 uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredFleet.length > 0 ? filteredFleet.map(unit => {
                                    const isEnRoute = unit.status === 'En Route' || unit.status === 'Deployed';
                                    const isMaint = unit.status === 'Maintenance';
                                    const statusColor = isEnRoute ? '#3b82f6' : isMaint ? '#ef4444' : '#10b981';

                                    return (
                                        <div key={unit.id} className="bg-white/5 border border-white/5 backdrop-blur-3xl p-8 hover:border-white/20 transition-all group">
                                            <div className="flex items-start justify-between mb-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white/5 border flex items-center justify-center transition-all group-hover:border-white/20"
                                                        style={{ borderColor: `${statusColor}40`, color: statusColor }}>
                                                        {isMaint ? <Wrench className="w-6 h-6" /> : getFleetIcon(unit.type)}
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="font-outfit font-black text-2xl tracking-tighter text-white uppercase leading-none">{unit.unit}</h3>
                                                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/20">{unit.type}</span>
                                                    </div>
                                                </div>
                                                <span className="px-4 py-1.5 bg-black/60 border text-[9px] font-mono font-black uppercase tracking-[0.2em]"
                                                    style={{ borderColor: `${statusColor}60`, color: statusColor }}>
                                                    {unit.status}
                                                </span>
                                            </div>

                                            <div className="space-y-6 p-8 bg-white/[0.02] border border-white/5" style={{ minHeight: 160 }}>
                                                <div>
                                                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mb-3 font-bold flex items-center gap-3">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Current Location
                                                    </p>
                                                    <p className="font-mono text-sm font-black tracking-widest text-white uppercase">{unit.location}</p>
                                                </div>

                                                <div className="pt-6 border-t border-white/[0.03] flex justify-between items-end">
                                                    <div className="flex flex-col gap-2">
                                                       <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] font-bold">Status</span>
                                                       <div className="flex items-center gap-2">
                                                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                                          <span className="text-[10px] font-mono text-blue-500 uppercase font-black">{isEnRoute ? 'Moving' : 'Idle'}</span>
                                                       </div>
                                                    </div>
                                                    {isEnRoute ? (
                                                       <div className="flex flex-col items-end gap-1">
                                                          <span className="text-[9px] font-mono text-white/20 uppercase font-bold pr-1">ETA</span>
                                                          <span className="font-outfit font-black text-3xl tracking-tighter text-blue-400 leading-none">{unit.eta}</span>
                                                       </div>
                                                    ) : (
                                                       <span className="font-mono text-[10px] text-white/20 font-bold uppercase tracking-widest italic">{isMaint ? 'Maintenance' : 'Available'}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {!isMaint && !isEnRoute && (
                                                <button className="w-full mt-8 bg-white/5 border border-white/10 hover:border-[#00FFCC] hover:text-[#00FFCC] py-5 font-outfit font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4">
                                                    <Send className="w-4 h-4" /> Dispatch Unit
                                                </button>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-20 text-center text-white/10 font-mono tracking-[0.5em] uppercase text-sm">
                                        FLEET_SIG_NOT_FOUND // SCANNING...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Add Stock Modal */}
            {isSpaceModalOpen && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8 animate-fade-in">
                    <div className="bg-[#08080A] border border-white/5 w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden relative">
                        <div className="absolute inset-0 bg-[#00FFCC]/5 blur-3xl pointer-events-none" />
                        
                        <div className="relative px-12 py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-[#00FFCC] uppercase tracking-[0.5em]">Inventory_Provisioning</span>
                                <h2 className="font-outfit text-4xl font-black text-white tracking-tighter uppercase leading-none">
                                  NEW_STOCK_INTAKE
                                </h2>
                            </div>
                            <button onClick={() => setIsSpaceModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all text-3xl">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleAddStock} className="relative p-12 space-y-8 bg-black/40">
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">ITEM_IDENTIFIER*</label>
                                <input
                                    required
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 focus:border-[#00FFCC]/40 px-6 py-5 font-mono text-sm tracking-widest focus:outline-none transition-all text-white placeholder:text-white/10 uppercase"
                                    placeholder="ENTRY_VALUE"
                                />
                            </div>
                            <div className="flex gap-8">
                                <div className="flex-1 space-y-3">
                                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">QUANTUM_VALUE*</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 focus:border-[#00FFCC]/40 px-6 py-5 font-mono text-sm tracking-widest focus:outline-none transition-all text-white placeholder:text-white/10"
                                        placeholder="000"
                                    />
                                </div>
                                <div className="w-[40%] space-y-3">
                                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">UNIT_MEASURE*</label>
                                    <select
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 focus:border-[#00FFCC]/40 px-6 py-5 font-mono text-sm tracking-widest focus:outline-none transition-all text-white appearance-none cursor-pointer uppercase"
                                    >
                                        <option value="kg" className="bg-[#08080A]">KG</option>
                                        <option value="liters" className="bg-[#08080A]">LITERS</option>
                                        <option value="kits" className="bg-[#08080A]">KITS</option>
                                        <option value="units" className="bg-[#08080A]">UNITS</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">LOCALITY_COORDINATES*</label>
                                <input
                                    required
                                    type="text"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 focus:border-[#00FFCC]/40 px-6 py-5 font-mono text-sm tracking-widest focus:outline-none transition-all text-white placeholder:text-white/10 uppercase"
                                    placeholder="SECTOR_REF"
                                />
                            </div>
                            <div className="pt-8 border-t border-white/5 flex justify-end gap-6">
                                <button
                                    type="button"
                                    onClick={() => setIsSpaceModalOpen(false)}
                                    className="px-10 py-4 font-mono text-[10px] tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase"
                                >
                                    ABORT
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#00FFCC] text-black px-12 py-4 font-outfit font-black text-xs tracking-[0.2em] transition-all hover:brightness-110 disabled:opacity-50 uppercase shadow-[0_0_30px_rgba(0,255,204,0.1)]"
                                >
                                    {isSubmitting ? 'PROVISIONING...' : 'AUTHORIZE_STOCK'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer toasts={toasts} />
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.2); }
                .stroke-text {
                  -webkit-text-stroke: 1px rgba(255,255,255,0.2);
                  text-stroke: 1px rgba(255,255,255,0.2);
                  color: transparent;
                }
            `}} />
        </div>
    );
}
