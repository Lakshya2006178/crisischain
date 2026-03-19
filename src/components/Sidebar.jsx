import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { LayoutDashboard, AlertTriangle, Activity, Database, Settings } from 'lucide-react';

const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
    { id: 'resources', icon: Database, label: 'Resources' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('dashboard');
    const { addToast, isSidebarOpen, isMobileMenuOpen } = useDashboard();

    const handleNavClick = (item) => {
        setActiveItem(item.id);
        addToast(`Navigating to ${item.label}`, 'info');
    };

    return (
        <aside className={`fixed left-0 top-0 h-screen flex-col py-6 bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300
      ${isSidebarOpen ? 'w-64 px-4' : 'w-20 px-2 items-center'}
      ${isMobileMenuOpen ? 'flex translate-x-0' : 'hidden md:flex md:translate-x-0'} 
    `}>
            <div className={`flex items-center gap-3 mb-10 ${isSidebarOpen ? 'px-2' : 'justify-center w-full'}`}>
                <div className="text-red-500 border border-red-500/30 p-2 rounded-xl bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] whitespace-nowrap overflow-hidden">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                </div>
                {isSidebarOpen && (
                    <h2 className="text-xl font-bold tracking-wider text-slate-100 uppercase overflow-hidden whitespace-nowrap animate-fade-in">
                        Crisis<span className="text-red-500">Chain</span>
                    </h2>
                )}
            </div>

            <nav className="flex-1 w-full flex flex-col gap-2 mt-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={`relative flex items-center transition-all duration-300 group font-semibold text-sm rounded-xl
                ${isSidebarOpen ? 'w-full px-3 py-3 gap-3' : 'w-12 h-12 justify-center mx-auto'}
                ${isActive
                                    ? 'bg-gray-800 text-white shadow-lg border border-gray-700'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                }`}
                            title={item.label}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                            {isSidebarOpen && (
                                <span className="whitespace-nowrap animate-fade-in">{item.label}</span>
                            )}

                            {isActive && (
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full shadow-[0_0_8px_rgba(239,68,68,0.6)] ${isSidebarOpen ? '' : 'left-0'}`} />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className={`mt-auto ${isSidebarOpen ? 'px-2' : 'w-full flex justify-center'}`}>
                <button
                    onClick={() => addToast('Opening Account Settings', 'info')}
                    className={`flex items-center transition-all rounded-xl hover:bg-gray-800
             ${isSidebarOpen ? 'w-full gap-3 p-3 text-slate-400 hover:text-slate-200' : 'p-2 justify-center'}
          `}
                >
                    <img src="https://ui-avatars.com/api/?name=Cmd+Center&background=1e293b&color=ef4444" alt="user" className="w-10 h-10 rounded-full border border-slate-700 flex-shrink-0" />
                    {isSidebarOpen && (
                        <div className="flex flex-col items-start overflow-hidden animate-fade-in">
                            <span className="text-sm font-semibold text-slate-200 truncate truncate w-full text-left">Commander</span>
                            <span className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span> Online
                            </span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}
