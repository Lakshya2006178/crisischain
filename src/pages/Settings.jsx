import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { 
    Settings as SettingsIcon, Users, Building2, Bell, Shield, 
    Server, Cpu, Activity, Edit2, Clock, AlertCircle,
    Lock, Smartphone, LogOut, ChevronDown, Filter, Trash2,
    Zap, Globe
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
                <div className="h-screen w-full bg-[#0B1220] flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h2 className="font-poppins font-bold text-2xl text-gray-100 mb-2">System Error</h2>
                    <p className="text-sm text-gray-500 mb-8">Connection lost. Please refresh to retry.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                        Retry Connection
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

function SettingCard({ title, description, icon: Icon, children, badge }) {
    return (
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 lg:p-8 flex flex-col h-full hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-6 border-b border-[#1F2937] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#1F2937] flex items-center justify-center text-teal-500">
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-poppins font-semibold text-lg text-gray-200">{title}</h3>
                        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                    </div>
                </div>
                {badge && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs font-bold uppercase">{badge}</span>
                )}
            </div>
            
            <div className="flex-1 w-full">
                {children}
            </div>
        </div>
    );
}

function Toggle({ enabled, onChange, label, subLabel }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-[#1F2937] last:border-0" onClick={() => onChange(!enabled)}>
            <div className="flex flex-col cursor-pointer">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                {subLabel && <span className="text-xs text-gray-500 mt-0.5">{subLabel}</span>}
            </div>
            <div className={`w-11 h-6 rounded-full relative flex items-center transition-colors cursor-pointer ${enabled ? 'bg-teal-500' : 'bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
        </div>
    );
}

function TableHeader({ columns }) {
    return (
        <thead>
            <tr className="border-b border-[#1F2937] text-xs text-gray-500 uppercase tracking-wider text-left bg-[#1F2937]/30">
                {columns.map((c, i) => (
                    <th key={i} className="px-4 py-3 font-semibold">{c}</th>
                ))}
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
        </thead>
    );
}

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-xl p-6 shadow-2xl">
                <div className="space-y-3 mb-6">
                    <h3 className="font-poppins font-semibold text-lg text-gray-200">{title}</h3>
                    <p className="text-sm text-gray-400">
                        {message}
                    </p>
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">Confirm</button>
                </div>
            </div>
        </div>
    );
};

// ── MAIN CONTENT ──

function SettingsContent() {
    const { isSidebarOpen, logout } = useDashboard();
    const navigate = useNavigate();
    
    // States
    const [notifs, setNotifs] = useState({ alerts: true, email: false, sms: true });
    const [config, setConfig] = useState({ respTime: '15', threshold: 'Critical', autoDispatch: true });
    const [tfa, setTfa] = useState(false);
    
    // Modal controls
    const [modal, setModal] = useState({ open: false, type: '', data: null });

    const openConfirm = (type, data) => setModal({ open: true, type, data });
    const closeConfirm = () => setModal({ open: false, type: '', data: null });

    const handleLogout = () => {
        logout();
        navigate('/');
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

                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-teal-500">
                                <SettingsIcon size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">System Configuration</span>
                            </div>
                            <h1 className="font-poppins text-3xl font-bold text-gray-100">
                                SETTINGS
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-xs font-bold uppercase">
                           <Activity size={14} /> Status: Operational
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 mb-6">
                        
                        {/* 1. ORGANIZATIONS */}
                        <div className="col-span-12 lg:col-span-8">
                            <SettingCard 
                                title="Organizations" 
                                description="Manage emergency units, hospitals, and logistical partners."
                                icon={Building2} 
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <div className="relative w-full sm:max-w-xs">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input type="text" placeholder="Search organizations..." className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-500/50 transition-colors text-white" />
                                    </div>
                                    <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-semibold transition-colors whitespace-nowrap">
                                        Add Organization
                                    </button>
                                </div>
                                <div className="bg-[#0B1220] rounded-lg border border-[#1F2937] overflow-x-auto">
                                    <table className="w-full min-w-[600px] text-sm">
                                        <TableHeader columns={['Name', 'Type', 'Contact', 'Capacity', 'Status']} />
                                        <tbody className="divide-y divide-[#1F2937]">
                                            {MOCK_ORGS.map((org) => (
                                                <tr key={org.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-4 py-3 font-semibold text-gray-200">{org.name}</td>
                                                    <td className="px-4 py-3 text-gray-400">{org.type}</td>
                                                    <td className="px-4 py-3 text-gray-400">{org.contact}</td>
                                                    <td className="px-4 py-3 text-teal-500">{org.capacity}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${org.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${org.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                            {org.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button className="text-gray-500 hover:text-white transition-colors" title="Edit"><Edit2 size={14} /></button>
                                                            <button 
                                                                onClick={() => openConfirm('delete_org', org.name)} 
                                                                className="text-gray-500 hover:text-red-500 transition-colors" 
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={14} />
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
                        <div className="col-span-12 lg:col-span-4">
                            <SettingCard 
                                title="System Status" 
                                description="Live monitoring of server infrastructure."
                                icon={Server} 
                                badge="Live"
                            >
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-[#1F2937]">
                                        <div>
                                            <span className="block text-xs text-gray-500 mb-1">Global Health</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="font-poppins font-semibold text-gray-200">OPERATIONAL</span>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs">
                                            <span className="block text-gray-500 mb-1">Last Sync</span>
                                            <span className="text-gray-300">Just now</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-400 flex items-center gap-2"><Cpu size={14} /> Server Load</span>
                                                <span className="font-semibold text-gray-200">42%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
                                                <div className="h-full bg-teal-500 rounded-full" style={{ width: '42%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-400 flex items-center gap-2"><Activity size={14} /> Network Speed</span>
                                                <span className="font-semibold text-gray-200">892 Mbps</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2 flex gap-2">
                                        <div className="flex-1 bg-[#0B1220] rounded border border-[#1F2937] p-2 text-center">
                                            <span className="block text-[10px] text-gray-500 uppercase font-semibold">Uptime</span>
                                            <span className="text-sm font-semibold text-gray-300">142 Days</span>
                                        </div>
                                        <div className="flex-1 bg-[#0B1220] rounded border border-[#1F2937] p-2 text-center">
                                            <span className="block text-[10px] text-gray-500 uppercase font-semibold">Health</span>
                                            <span className="text-sm font-semibold text-emerald-500">100%</span>
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 mb-6">
                        
                        {/* 3. USERS & ROLES */}
                        <div className="col-span-12 lg:col-span-7">
                            <SettingCard 
                                title="Users & Roles" 
                                description="Manage system administrators and responders."
                                icon={Users} 
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <div className="relative w-full sm:max-w-xs">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input type="text" placeholder="Search users..." className="w-full bg-[#0B1220] border border-[#1F2937] rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-500/50 transition-colors text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-[#0B1220] border border-[#1F2937] rounded-lg w-full sm:w-auto">
                                         <Filter size={14} className="text-gray-500" />
                                         <select className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer w-full">
                                            <option>All Roles</option>
                                            <option>Admin</option>
                                            <option>Responder</option>
                                         </select>
                                    </div>
                                </div>
                                <div className="bg-[#0B1220] rounded-lg border border-[#1F2937] overflow-x-auto">
                                    <table className="w-full min-w-[500px] text-sm">
                                        <TableHeader columns={['User', 'Role', 'Organization']} />
                                        <tbody className="divide-y divide-[#1F2937]">
                                            {MOCK_USERS.map((user) => (
                                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                           <div className="w-8 h-8 rounded bg-[#1F2937] flex items-center justify-center text-gray-400 font-semibold">{user.name ? user.name[0] : 'U'}</div>
                                                           <div className="flex flex-col">
                                                               <span className="font-semibold text-gray-200">{user.name}</span>
                                                               <span className="text-xs text-gray-500">Active {user.lastLogin}</span>
                                                           </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-400">{user.org}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button className="text-gray-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                                                            <button className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
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
                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                             
                             <SettingCard title="Notifications" icon={Bell}>
                                 <Toggle label="Emergency Alerts" subLabel="Visual alerts on critical events" enabled={notifs.alerts} onChange={v => setNotifs({...notifs, alerts: v})} />
                                 <Toggle label="Email Summaries" subLabel="Daily priority reports" enabled={notifs.email} onChange={v => setNotifs({...notifs, email: v})} />
                                 <Toggle label="SMS Delivery" subLabel="Immediate text delivery" enabled={notifs.sms} onChange={v => setNotifs({...notifs, sms: v})} />
                             </SettingCard>

                             <SettingCard title="Response Config" icon={Zap}>
                                 <div className="grid grid-cols-2 gap-4 mb-4">
                                     <div>
                                         <label className="block text-xs text-gray-400 mb-1">Target Response (min)</label>
                                         <input type="number" value={config.respTime} onChange={e => setConfig({...config, respTime: e.target.value})} className="w-full bg-[#0B1220] border border-[#1F2937] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                                     </div>
                                     <div>
                                         <label className="block text-xs text-gray-400 mb-1">Alert Sensitivity</label>
                                         <select value={config.threshold} onChange={e => setConfig({...config, threshold: e.target.value})} className="w-full bg-[#0B1220] border border-[#1F2937] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 appearance-none">
                                             <option>High Priority</option>
                                             <option>Moderate</option>
                                             <option>All Signals</option>
                                         </select>
                                     </div>
                                 </div>
                                 <Toggle label="Automated Dispatch" subLabel="AI-assisted help for regional events" enabled={config.autoDispatch} onChange={v => setConfig({...config, autoDispatch: v})} />
                             </SettingCard>

                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 mb-10">
                        
                        {/* SECURITY */}
                        <div className="col-span-12 lg:col-span-8">
                            <SettingCard title="Security" icon={Shield}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                                            <Lock size={14} className="text-teal-500" /> Change Password
                                        </h4>
                                        <div className="space-y-3">
                                            <input type="password" placeholder="Current Password" className="w-full bg-[#0B1220] border border-[#1F2937] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                                            <input type="password" placeholder="New Password" className="w-full bg-[#0B1220] border border-[#1F2937] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                                            <button className="w-full py-2.5 rounded bg-[#1F2937] hover:bg-[#374151] text-white text-sm font-semibold transition-colors mt-2">Update Password</button>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                                            <Smartphone size={14} className="text-blue-500" /> Two-Factor Auth
                                        </h4>
                                        <div className="bg-[#0B1220] rounded border border-[#1F2937] p-4">
                                            <p className="text-xs text-gray-400 mb-4 leading-relaxed">Adds an extra layer of security to your account.</p>
                                            <Toggle label="Enable 2FA" enabled={tfa} onChange={setTfa} />
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>

                        {/* LOGOUT */}
                        <div className="col-span-12 lg:col-span-4">
                            <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 h-full flex flex-col justify-end">
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => openConfirm('logout_all', 'Log out of all devices?')}
                                        className="w-full py-2.5 rounded border border-red-500/20 text-red-500 text-sm font-semibold hover:bg-red-500/10 transition-colors"
                                    >
                                       Log out other devices
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full py-2.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                       <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
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
