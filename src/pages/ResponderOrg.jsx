import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { SZ } from '../DashboardMain';
import {
    Truck, Wrench, Users, ClipboardList, Plus, Trash2,
    CheckCircle2, AlertCircle, Clock, MapPin, Search, X
} from 'lucide-react';

const STORAGE_KEY = 'responder_org_data';

const DEFAULT_DATA = {
    fleet: [
        { id: 1, name: 'Fire Engine Alpha', reg: 'KA-05-F-0012', type: 'Fire Engine', status: 'Available', lastService: '2026-03-10' },
        { id: 2, name: 'Rescue Van 01',     reg: 'KA-05-F-0034', type: 'Rescue Van',  status: 'Deployed',  lastService: '2026-02-20' },
    ],
    equipment: [
        { id: 1, name: 'CO2 Extinguisher', qty: 12, condition: 'Good',     location: 'Bay A', nextInspection: '2026-06-01' },
        { id: 2, name: 'SCBA Set',          qty: 6,  condition: 'Good',     location: 'Bay B', nextInspection: '2026-07-15' },
        { id: 3, name: 'Hydraulic Cutter',  qty: 2,  condition: 'Moderate', location: 'Bay A', nextInspection: '2026-05-20' },
    ],
    personnel: [
        { id: 1, name: 'Suresh Kumar',   rank: 'Station Officer', shift: 'Morning', status: 'On Duty' },
        { id: 2, name: 'Ravi Prabhu',    rank: 'Sub-Officer',     shift: 'Morning', status: 'On Duty' },
        { id: 3, name: 'Mohan Das',      rank: 'Fireman',         shift: 'Night',   status: 'Off Duty' },
    ],
    incidents: [
        { id: 1, type: 'Building Fire', location: 'Hampankatta', date: '2026-04-28', status: 'Resolved', units: 2 },
        { id: 2, type: 'Road Accident', location: 'Kadri',       date: '2026-04-22', status: 'Resolved', units: 1 },
    ],
};

const TABS = [
    { id: 'fleet',     label: 'FLEET',     icon: Truck },
    { id: 'equipment', label: 'EQUIPMENT', icon: Wrench },
    { id: 'personnel', label: 'PERSONNEL', icon: Users },
    { id: 'incidents', label: 'INCIDENTS', icon: ClipboardList },
];

const STATUS_COLOR = {
    Available: '#00FFCC', Deployed: '#3b82f6', 'Off Duty': '#f59e0b',
    'On Duty': '#00FFCC', Resolved: '#10b981', Active: '#ef4444',
    Good: '#00FFCC', Moderate: '#f59e0b', Poor: '#ef4444',
};

function Badge({ label }) {
    const color = STATUS_COLOR[label] || '#ffffff40';
    return (
        <span className="px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest border"
            style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
            {label}
        </span>
    );
}

function Modal({ title, fields, onSave, onClose }) {
    const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.key, f.default || ''])));
    return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
            <div className="bg-[#08080A] border border-white/10 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                    <span className="font-outfit font-black text-xl text-white uppercase tracking-tight">{title}</span>
                    <button onClick={onClose}><X className="w-5 h-5 text-white/30 hover:text-white" /></button>
                </div>
                <div className="p-8 space-y-5">
                    {fields.map(f => (
                        <div key={f.key} className="space-y-2">
                            <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{f.label}</label>
                            {f.options ? (
                                <select value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00FFCC]/40 appearance-none">
                                    {f.options.map(o => <option key={o} value={o} className="bg-[#08080A]">{o}</option>)}
                                </select>
                            ) : (
                                <input type={f.type || 'text'} value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00FFCC]/40" />
                            )}
                        </div>
                    ))}
                    <div className="flex gap-4 pt-4">
                        <button onClick={onClose} className="flex-1 py-3 border border-white/10 font-mono text-xs text-white/40 hover:text-white uppercase tracking-widest">Cancel</button>
                        <button onClick={() => onSave(form)} className="flex-1 py-3 bg-[#00FFCC] text-black font-outfit font-black text-xs uppercase tracking-widest hover:brightness-110">Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResponderOrg() {
    const { isSidebarOpen } = useDashboard();
    const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;
    const [activeTab, setActiveTab] = useState('fleet');
    const [search, setSearch] = useState('');
    const [data, setData] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA; }
        catch { return DEFAULT_DATA; }
    });
    const [modal, setModal] = useState(null);

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

    const addItem = (tab, item) => {
        setData(prev => ({ ...prev, [tab]: [...prev[tab], { ...item, id: Date.now(), qty: Number(item.qty || 1) }] }));
        setModal(null);
    };
    const removeItem = (tab, id) => setData(prev => ({ ...prev, [tab]: prev[tab].filter(i => i.id !== id) }));

    const MODAL_FIELDS = {
        fleet: [
            { key: 'name', label: 'Vehicle Name' },
            { key: 'reg', label: 'Registration No.' },
            { key: 'type', label: 'Type', options: ['Fire Engine', 'Rescue Van', 'Ambulance', 'Command Vehicle', 'Patrol Boat', 'Helicopter'] },
            { key: 'status', label: 'Status', options: ['Available', 'Deployed', 'Maintenance'] },
            { key: 'lastService', label: 'Last Service Date', type: 'date' },
        ],
        equipment: [
            { key: 'name', label: 'Equipment Name' },
            { key: 'qty', label: 'Quantity', type: 'number', default: '1' },
            { key: 'condition', label: 'Condition', options: ['Good', 'Moderate', 'Poor'] },
            { key: 'location', label: 'Storage Location' },
            { key: 'nextInspection', label: 'Next Inspection', type: 'date' },
        ],
        personnel: [
            { key: 'name', label: 'Full Name' },
            { key: 'rank', label: 'Rank / Designation' },
            { key: 'shift', label: 'Shift', options: ['Morning', 'Afternoon', 'Night'] },
            { key: 'status', label: 'Status', options: ['On Duty', 'Off Duty', 'Leave'] },
        ],
        incidents: [
            { key: 'type', label: 'Incident Type', options: ['Building Fire', 'Road Accident', 'Flood', 'Rescue', 'Hazmat', 'Medical'] },
            { key: 'location', label: 'Location' },
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'status', label: 'Status', options: ['Active', 'Resolved'] },
            { key: 'units', label: 'Units Deployed', type: 'number', default: '1' },
        ],
    };

    const filtered = {
        fleet: data.fleet.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.type.toLowerCase().includes(search.toLowerCase())),
        equipment: data.equipment.filter(i => i.name.toLowerCase().includes(search.toLowerCase())),
        personnel: data.personnel.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.rank.toLowerCase().includes(search.toLowerCase())),
        incidents: data.incidents.filter(i => i.type.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase())),
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#08080A] text-[#E5E5E7] font-inter">
            <Sidebar />
            <TopNavbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10"
                style={{ marginLeft: ml, marginTop: SZ.navbarH, height: `calc(100vh - ${SZ.navbarH}px)` }}>
                <div className="p-8 lg:p-12 max-w-[1400px] mx-auto">

                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-[#00FFCC]/40" />
                            <span className="text-[10px] font-mono tracking-[0.6em] text-[#00FFCC] uppercase">Responder_Org_Management</span>
                        </div>
                        <h1 className="font-outfit text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
                            ORG<br />
                            <span className="bg-gradient-to-r from-[#00FFCC] via-white to-white/40 bg-clip-text text-transparent italic">COMMAND</span>
                        </h1>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Vehicles', value: data.fleet.length, sub: `${data.fleet.filter(f => f.status === 'Available').length} available` },
                            { label: 'Equipment', value: data.equipment.reduce((a, e) => a + Number(e.qty), 0), sub: 'total items' },
                            { label: 'Personnel', value: data.personnel.length, sub: `${data.personnel.filter(p => p.status === 'On Duty').length} on duty` },
                            { label: 'Incidents', value: data.incidents.length, sub: `${data.incidents.filter(i => i.status === 'Active').length} active` },
                        ].map(s => (
                            <div key={s.label} className="bg-white/5 border border-white/5 p-6">
                                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">{s.label}</p>
                                <p className="font-outfit font-black text-4xl text-white tracking-tighter">{s.value}</p>
                                <p className="text-[9px] font-mono text-[#00FFCC]/60 mt-1 uppercase tracking-widest">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tab Bar + Search + Add */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <div className="flex gap-2 flex-wrap">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <button key={id} onClick={() => { setActiveTab(id); setSearch(''); }}
                                    className={`flex items-center gap-3 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === id ? 'bg-[#00FFCC] text-black border-transparent' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10'}`}>
                                    <Icon className="w-4 h-4" />{label}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 flex gap-4 min-w-[200px]">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                                    className="w-full bg-white/5 border border-white/5 pl-10 pr-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00FFCC]/30 uppercase placeholder:text-white/10" />
                            </div>
                            <button onClick={() => setModal(activeTab)}
                                className="flex items-center gap-2 px-6 py-3 bg-[#00FFCC] text-black font-outfit font-black text-xs uppercase tracking-widest hover:brightness-110">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </div>

                    {/* ── FLEET TAB ── */}
                    {activeTab === 'fleet' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.fleet.map(v => (
                                <div key={v.id} className="bg-white/5 border border-white/5 p-6 hover:border-[#00FFCC]/20 transition-all group relative">
                                    <button onClick={() => removeItem('fleet', v.id)} className="absolute top-4 right-4 text-white/10 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center text-[#00FFCC]">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-outfit font-black text-lg text-white uppercase tracking-tight">{v.name}</h3>
                                            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{v.reg}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono text-white/30 uppercase">{v.type}</span>
                                        <Badge label={v.status} />
                                    </div>
                                    <p className="text-[9px] font-mono text-white/20 mt-3 uppercase tracking-widest">Last service: {v.lastService}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── EQUIPMENT TAB ── */}
                    {activeTab === 'equipment' && (
                        <div className="bg-white/5 border border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 font-mono text-[9px] text-white/20 uppercase tracking-widest">
                                        {['Equipment', 'Qty', 'Condition', 'Location', 'Next Inspection', ''].map(h => (
                                            <th key={h} className="px-6 py-5 font-normal">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.equipment.map(e => (
                                        <tr key={e.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all">
                                            <td className="px-6 py-5 font-outfit font-black text-white uppercase">{e.name}</td>
                                            <td className="px-6 py-5 font-outfit font-black text-2xl text-[#00FFCC]">{e.qty}</td>
                                            <td className="px-6 py-5"><Badge label={e.condition} /></td>
                                            <td className="px-6 py-5 font-mono text-xs text-white/40 uppercase"><MapPin className="w-3 h-3 inline mr-1 text-[#00FFCC]" />{e.location}</td>
                                            <td className="px-6 py-5 font-mono text-xs text-white/30">{e.nextInspection}</td>
                                            <td className="px-6 py-5"><button onClick={() => removeItem('equipment', e.id)}><Trash2 className="w-4 h-4 text-white/10 hover:text-red-500 transition-colors" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── PERSONNEL TAB ── */}
                    {activeTab === 'personnel' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.personnel.map(p => (
                                <div key={p.id} className="bg-white/5 border border-white/5 p-6 hover:border-white/10 transition-all relative group">
                                    <button onClick={() => removeItem('personnel', p.id)} className="absolute top-4 right-4 text-white/10 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center font-outfit font-black text-xl text-white">
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-outfit font-black text-base text-white uppercase">{p.name}</h3>
                                            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{p.rank}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono text-white/20 uppercase"><Clock className="w-3 h-3 inline mr-1" />{p.shift} shift</span>
                                        <Badge label={p.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── INCIDENTS TAB ── */}
                    {activeTab === 'incidents' && (
                        <div className="space-y-4">
                            {filtered.incidents.map(i => (
                                <div key={i.id} className="bg-white/5 border border-white/5 p-6 flex items-center justify-between hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-2 h-10 ${i.status === 'Active' ? 'bg-red-500' : 'bg-[#00FFCC]/30'}`} />
                                        <div>
                                            <h3 className="font-outfit font-black text-lg text-white uppercase">{i.type}</h3>
                                            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1"><MapPin className="w-3 h-3 inline mr-1 text-red-500" />{i.location} — {i.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[9px] font-mono text-white/20 uppercase">{i.units} unit{i.units > 1 ? 's' : ''} deployed</span>
                                        <Badge label={i.status} />
                                        <button onClick={() => removeItem('incidents', i.id)}><Trash2 className="w-4 h-4 text-white/10 hover:text-red-500 transition-colors" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {modal && (
                <Modal title={`Add ${modal}`} fields={MODAL_FIELDS[modal]}
                    onSave={form => addItem(modal, form)} onClose={() => setModal(null)} />
            )}
        </div>
    );
}
