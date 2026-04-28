import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import {
    Search, Plus, Package, MapPin, Hospital,
    AlertCircle, CheckCircle2, ChevronRight, Pill,
    Truck, Navigation, Clock, Activity, Send, HeartPulse, Globe, Zap, Filter
} from 'lucide-react';

// Flat Toast Component
function Toast({ message, type }) {
    const bgClasses = {
        error: 'bg-red-500/10 border-red-500/20 text-red-500',
        success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };
    
    return (
        <div className={`px-4 py-3 rounded border text-xs font-semibold flex items-center gap-2 ${bgClasses[type] || bgClasses.info}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            {message}
        </div>
    );
}

function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
            {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
        </div>
    );
}

// Flat MiniMap
const MiniMap = ({ isFull, isNear }) => {
    const colorClass = isFull ? "text-red-500" : isNear ? "text-yellow-500" : "text-emerald-500";
    const bgColor = isFull ? "bg-red-500" : isNear ? "bg-yellow-500" : "bg-emerald-500";
    const strokeHex = isFull ? "#ef4444" : isNear ? "#eab308" : "#10b981";

    return (
        <div className="relative w-full h-24 bg-[#0B1220] rounded-lg overflow-hidden border border-[#1F2937] mb-5 flex items-center justify-center">
            {/* Simple Grid */}
            <svg viewBox="0 0 100 40" className="absolute w-full h-full opacity-30" preserveAspectRatio="none">
                <path d="M0,20 Q15,5 25,20 T50,20 T75,5 T100,20" fill="none" stroke={strokeHex} strokeWidth="1" />
                <path d="M-10,30 Q10,15 25,30 T50,30 T75,15 T110,30" fill="none" stroke={strokeHex} strokeWidth="0.5" />
            </svg>

            {/* Solid Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-3 h-3 rounded-full ${bgColor}`} />
            </div>

            {/* Label Overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#111827] border border-[#1F2937]">
                <span className="text-[10px] font-semibold text-gray-400">Location Data</span>
            </div>
        </div>
    );
};

export default function ResourceInventory() {
    const { toasts, isSidebarOpen, resources: fleetResources, updateResource } = useDashboard();
    const [activeTab, setActiveTab] = useState('supplies');

    // Supplies State (Local Inventory)
    const [supplies, setSupplies] = useState([
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
            setSupplies([...supplies, addedItem]);
            setIsSubmitting(false);
            setIsSpaceModalOpen(false);
            setNewItem({ name: '', quantity: '', unit: 'kg', location: '' });
        }, 600);
    };

    const filteredResources = supplies.filter(res => res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredHospitals = hospitals.filter(hosp => hosp.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || hosp.status.toLowerCase().includes(hospitalSearch.toLowerCase()));
    const filteredFleet = fleetResources.filter(f => f.name.toLowerCase().includes(fleetSearch.toLowerCase()) || f.type.toLowerCase().includes(fleetSearch.toLowerCase()));

    const getFleetIconByBackendType = (type) => {
        switch (type) {
            case 'ambulance': return <HeartPulse className="w-5 h-5" />;
            case 'truck': return <Truck className="w-5 h-5" />;
            case 'drone': return <Navigation className="w-5 h-5" />;
            case 'boat': return <Activity className="w-5 h-5" />;
            default: return <Activity className="w-5 h-5" />;
        }
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
                    
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-teal-500">
                                <Package size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Logistics & Supply</span>
                            </div>
                            <h1 className="font-poppins text-3xl font-bold text-gray-100">
                                RESOURCE MANAGEMENT
                            </h1>
                        </div>
                        
                        {activeTab === 'supplies' && (
                            <button
                                onClick={() => setIsSpaceModalOpen(true)}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Inventory
                            </button>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-6 border-b border-[#1F2937] pb-px">
                        {[
                            { id: 'supplies', label: 'Stock Overview', icon: Package },
                            { id: 'hospitals', label: 'Facility Capacity', icon: Hospital },
                            { id: 'fleet', label: 'Logistics Fleet', icon: Truck },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${isActive ? 'border-teal-500 text-teal-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
                                >
                                    <Icon size={16} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area - Supplies */}
                    {activeTab === 'supplies' && (
                        <div className="grid grid-cols-12 gap-6">

                            {/* Left: Inventory Table */}
                            <div className="col-span-12 lg:col-span-8 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search inventory..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#111827] border border-[#1F2937] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 transition-colors text-white placeholder:text-gray-600"
                                    />
                                </div>

                                <div className="bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#1F2937] text-gray-400 text-xs uppercase tracking-wider bg-[#1F2937]/30">
                                                <th className="px-6 py-4 font-semibold">Item Details</th>
                                                <th className="px-6 py-4 font-semibold">Quantity</th>
                                                <th className="px-6 py-4 font-semibold">Location</th>
                                                <th className="px-6 py-4 font-semibold text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#1F2937]">
                                            {filteredResources.length > 0 ? filteredResources.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded bg-[#1F2937] flex items-center justify-center text-teal-500">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-poppins font-semibold text-gray-200">{item.name}</span>
                                                                <span className="text-xs text-gray-500">ID: {item.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="font-poppins font-bold text-xl text-gray-200">{item.quantity.toLocaleString()}</span>
                                                            <span className="text-xs text-gray-500 uppercase">{item.unit}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                            <MapPin className="w-4 h-4 text-teal-500" />
                                                            <span className="truncate max-w-[150px]">{item.location}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {item.quantity > 500 ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                                                                <CheckCircle2 size={12} /> Adequate
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-xs font-semibold">
                                                                <AlertCircle size={12} /> Low Stock
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                                                        No supplies found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right Panel: Recent Dispatches */}
                            <div className="col-span-12 lg:col-span-4">
                                <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 h-full">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2937]">
                                        <h3 className="font-semibold text-gray-200">Recent Dispatches</h3>
                                        <button className="text-gray-400 hover:text-gray-200"><Filter size={16} /></button>
                                    </div>

                                    <div className="space-y-4">
                                        {dispatches.map(dispatch => (
                                            <div key={dispatch.id} className="p-4 rounded-lg bg-[#0B1220] border border-[#1F2937]">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-poppins font-semibold text-gray-200">{dispatch.item}</span>
                                                    <span className="text-xs font-bold text-gray-400 bg-[#1F2937] px-2 py-0.5 rounded">
                                                        x{dispatch.qty}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                                    <Globe className="w-3 h-3 text-blue-400" /> TO: {dispatch.to}
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#1F2937]">
                                                    <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {dispatch.time}</span>
                                                    <span className={`font-semibold ${dispatch.status === 'In Transit' ? "text-blue-400" : "text-emerald-500"}`}>
                                                        {dispatch.status}
                                                    </span>
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
                        <div>
                            <div className="mb-6 relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search hospitals..."
                                    value={hospitalSearch}
                                    onChange={(e) => setHospitalSearch(e.target.value)}
                                    className="w-full bg-[#111827] border border-[#1F2937] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 transition-colors text-white placeholder:text-gray-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredHospitals.length > 0 ? filteredHospitals.map(hosp => {
                                    const isFull = hosp.status === 'Full';
                                    const isNear = hosp.status === 'Near Capacity';
                                    const statusColor = isFull ? '#ef4444' : isNear ? '#f59e0b' : '#10b981';
                                    const pctFull = Math.round(((hosp.bedsTotal - hosp.bedsAvailable) / hosp.bedsTotal) * 100);

                                    return (
                                        <div key={hosp.id} className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 hover:border-gray-600 transition-colors flex flex-col">
                                            
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-[#1F2937] flex items-center justify-center text-teal-500">
                                                        <Hospital size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-200">{hosp.name}</h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <MapPin size={12} /> {hosp.distance} radius
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isFull ? 'bg-red-500/10 text-red-500' : isNear ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                    {hosp.status}
                                                </span>
                                            </div>

                                            <MiniMap isFull={isFull} isNear={isNear} />

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-[#0B1220] rounded p-4 border border-[#1F2937]">
                                                    <p className="text-xs text-gray-500 font-semibold mb-2">Available Beds</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-poppins font-bold text-2xl" style={{ color: statusColor }}>
                                                            {hosp.bedsAvailable}
                                                        </span>
                                                        <span className="text-xs text-gray-500">/ {hosp.bedsTotal}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-[#1F2937] rounded-full mt-3 overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${pctFull}%`, background: statusColor }} />
                                                    </div>
                                                </div>

                                                <div className="bg-[#0B1220] rounded p-4 border border-[#1F2937]">
                                                    <p className="text-xs text-gray-500 font-semibold mb-2 flex items-center gap-1.5">
                                                        <Zap size={12} className="text-blue-400" /> Med Stock
                                                    </p>
                                                    <div className="space-y-1.5 mt-2">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-400">Critical</span>
                                                            <span className="font-semibold text-gray-200">{hosp.medicines.critical}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-400">General</span>
                                                            <span className="font-semibold text-gray-200">{hosp.medicines.general}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className={`w-full py-2.5 rounded text-sm font-semibold transition-colors mt-auto ${isFull ? 'bg-[#1F2937] text-gray-400 cursor-not-allowed' : 'bg-[#1F2937] hover:bg-[#374151] text-white'}`}>
                                                {isFull ? 'Find Alternatives' : 'Set Routing'}
                                            </button>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-12 text-center text-gray-500 text-sm">
                                        No hospitals found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content Area - Fleet */}
                    {activeTab === 'fleet' && (
                        <div>
                            <div className="mb-6 relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search fleet..."
                                    value={fleetSearch}
                                    onChange={(e) => setFleetSearch(e.target.value)}
                                    className="w-full bg-[#111827] border border-[#1F2937] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 transition-colors text-white placeholder:text-gray-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFleet.length > 0 ? filteredFleet.map(unit => {
                                    const isEnRoute = unit.deployed > 0;
                                    
                                    return (
                                        <div key={unit.id} className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 hover:border-gray-600 transition-colors flex flex-col">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded bg-[#1F2937] flex items-center justify-center text-gray-300">
                                                        {getFleetIconByBackendType(unit.type)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-200">{unit.name}</h3>
                                                        <span className="text-xs text-gray-500 uppercase">{unit.type}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${isEnRoute ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                    {isEnRoute ? 'Deployed' : 'Ready'}
                                                </span>
                                            </div>

                                            <div className="bg-[#0B1220] rounded border border-[#1F2937] p-4 mb-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Total Units</span>
                                                        <span className="font-poppins font-semibold text-xl text-gray-200">{unit.total}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 block mb-1">Available</span>
                                                        <span className="font-poppins font-semibold text-xl text-emerald-500">{unit.available}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-[#1F2937]">
                                                    <span className="text-xs text-gray-500 block mb-1">Deployed</span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-poppins font-semibold text-xl text-blue-400">{unit.deployed}</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${isEnRoute ? 'bg-blue-500' : 'bg-gray-500'}`} />
                                                            <span className="text-xs text-gray-400">{isEnRoute ? 'Active' : 'Idle'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {unit.available > 0 ? (
                                                <button 
                                                    onClick={() => updateResource(unit.id, unit.deployed + 1)}
                                                    className="w-full py-2.5 rounded text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center justify-center gap-2 mt-auto"
                                                >
                                                    <Send size={16} /> Dispatch Unit
                                                </button>
                                            ) : (
                                                <button disabled className="w-full py-2.5 rounded text-sm font-semibold bg-[#1F2937] text-gray-500 cursor-not-allowed mt-auto">
                                                    No Units Available
                                                </button>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-12 text-center text-gray-500 text-sm">
                                        No logistics units found.
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
                    <div className="bg-[#111827] border border-[#1F2937] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                        
                        <div className="px-6 py-5 border-b border-[#1F2937] flex justify-between items-center bg-[#1F2937]/30">
                            <h2 className="font-semibold text-lg text-gray-200">
                                Add Inventory Item
                            </h2>
                            <button onClick={() => setIsSpaceModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleAddStock} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Item Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 text-white placeholder:text-gray-600"
                                    placeholder="e.g. Trauma Kits"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 text-white placeholder:text-gray-600"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Unit</label>
                                    <select
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 text-white appearance-none cursor-pointer"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="liters">liters</option>
                                        <option value="kits">kits</option>
                                        <option value="units">units</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Location</label>
                                <input
                                    required
                                    type="text"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500/50 text-white placeholder:text-gray-600"
                                    placeholder="e.g. Sector 4 Facility"
                                />
                            </div>
                            
                            <div className="pt-6 mt-2 border-t border-[#1F2937] flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSpaceModalOpen(false)}
                                    className="px-4 py-2 rounded text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Item'}
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
