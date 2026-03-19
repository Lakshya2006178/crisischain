import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Search, Bell, User, ChevronDown, Menu } from 'lucide-react';

export default function TopNavbar() {
    const [time, setTime] = useState(new Date());
    const { addToast, isSidebarOpen, toggleSidebar, toggleMobileMenu } = useDashboard();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            addToast(`Searching for: ${e.target.value}`, 'info');
            e.target.value = '';
        }
    };

    return (
        <header className={`fixed top-0 right-0 h-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 z-40 transition-all duration-300
      ${isSidebarOpen ? 'left-0 md:left-64' : 'left-0 md:left-20'}
    `}>

            {/* Brand & Title */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {/* Mobile Hamburger */}
                <button className="md:hidden p-2 text-slate-400 hover:text-slate-200" onClick={toggleMobileMenu}>
                    <Menu className="w-6 h-6" />
                </button>
                {/* Desktop Hamburger */}
                <button className="hidden md:block p-2 text-slate-400 hover:text-slate-200 transition-colors" onClick={toggleSidebar}>
                    <Menu className="w-6 h-6" />
                </button>

                <h1 className="text-xl md:text-2xl font-bold tracking-wider text-slate-100 uppercase hidden xl:block">
                    Crisis<span className="text-red-500">Chain</span>
                </h1>
                <div className="hidden xl:block h-6 w-px bg-slate-700 mx-2"></div>
                <span className="text-slate-400 text-xs md:text-sm font-medium tracking-widest uppercase hidden lg:block">
                    Command Center
                </span>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-xl mx-2 md:mx-8 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                    type="text"
                    onKeyDown={handleSearch}
                    placeholder="Search incidents..."
                    className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-full py-2 pl-9 md:pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-6">

                {/* Live Clock */}
                <div className="flex flex-col items-end mr-2 md:mr-4">
                    <span className="text-sm md:text-lg font-mono font-bold text-slate-200 tracking-wider">
                        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <span className="text-[10px] md:text-xs text-red-500 ml-1 animate-pulse hidden sm:inline-block">UTC</span>
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-500 font-medium hidden sm:block">
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Notifications */}
                <button
                    onClick={() => addToast('Checking notifications...', 'info')}
                    className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 rounded-full hover:bg-slate-700"
                >
                    <Bell className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] animate-ping"></span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <button
                    onClick={() => addToast('Opening User Profile Settings', 'info')}
                    className="flex items-center gap-2 md:gap-3 hover:bg-slate-800 p-1 md:p-1.5 md:pr-3 rounded-full border border-slate-800 hover:border-slate-700 transition-all"
                >
                    <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-slate-800 text-red-400 border border-slate-700">
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="flex-col items-start hidden sm:flex">
                        <span className="text-xs md:text-sm font-semibold text-slate-200">Commander</span>
                        <span className="text-[10px] md:text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                        </span>
                    </div>
                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-slate-500 hidden sm:block" />
                </button>

            </div>
        </header>
    );
}
