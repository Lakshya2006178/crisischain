import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, Waves, Wind, Flame, HeartPulse, Truck, Users, MessageSquare, AlertTriangle, ClipboardCheck, Siren, HeartHandshake, Droplets, Shield, Radiation, Activity, MapPin } from 'lucide-react';
import * as api from '../api/index.js';
import { supabase } from '../lib/supabaseClient';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    // --- STATE INITIALIZATION ---
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [resources, setResources] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, avgResponseTime: 0 });
    const [trends, setTrends] = useState([]);

    // Removed mock logic for visuals
    const [actions, setActions] = useState([]);
    const [messages, setMessages] = useState([]);

    const [workflowId, setWorkflowId] = useState(2);
    const [toasts, setToasts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const pollingRef = useRef(null);

    // --- HELPERS ---
    const getIconName = (type) => {
        if (type === 'fire') return 'Flame';
        if (type === 'flood') return 'Droplets';
        if (type === 'medical') return 'HeartPulse';
        if (type === 'accident') return 'AlertTriangle';
        return 'AlertCircle';
    };

    const getIconByName = (name) => {
        if (name.includes('Fire')) return 'Flame';
        if (name.includes('Ambulance')) return 'HeartPulse';
        if (name.includes('Boat')) return 'Droplets';
        if (name.includes('Drone')) return 'Zap';
        return 'Activity';
    };

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    // --- FETCH DATA ---
    const refreshData = useCallback(async () => {
        try {
            const [statsRes, alertsRes, resourcesRes] = await Promise.all([
                api.fetchStats(),
                api.fetchAlerts(),
                api.fetchResources(),
            ]);
            setStats(statsRes.data);
            setAlerts(alertsRes.data);
            setResources(resourcesRes.data);
        } catch (err) {
            console.warn('refreshData error:', err.message);
        }
    }, []);

    // --- START / STOP POLLING (Realtime replaced) ---
    const startPolling = useCallback(() => {
        // Now handled by realtime subscription
    }, []);

    const stopPolling = useCallback(() => {
    }, []);

    // --- REALTIME ---
    useEffect(() => {
        if (!user) return;
        const channel = supabase.channel('public:incidents')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, (payload) => {
                refreshData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, refreshData]);

    // --- ON APP LOAD: restore session ---
    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem('crisischain_token');
            if (!token) {
                setIsAuthLoading(false);
                return;
            }
            try {
                const res = await api.fetchMe();
                setUser(res.data);
                refreshData();
            } catch (e) {
                console.error("Session restoration failed:", e.message);
                localStorage.removeItem('crisischain_token');
                localStorage.removeItem('crisischain_user');
                setUser(null);
            } finally {
                setIsAuthLoading(false);
            }
        };

        restoreSession();
    }, [refreshData]);

    // --- AUTH ---
    const login = async (email, password) => {
        const res = await api.login({ email, password });
        const { token, user: userData } = res.data;
        localStorage.setItem('crisischain_token', token);
        localStorage.setItem('crisischain_user', JSON.stringify(userData));
        setUser(userData);
        addToast('Session Initialized: Welcome Back', 'success');
        await refreshData();
        return userData;
    };

    const signup = async (name, email, password, role) => {
        const res = await api.register({ name, email, password, role });
        const { token, user: userData } = res.data;
        localStorage.setItem('crisischain_token', token);
        localStorage.setItem('crisischain_user', JSON.stringify(userData));
        setUser(userData);
        addToast('Registration Successful', 'success');
        await refreshData();
        return userData;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('crisischain_token');
        localStorage.removeItem('crisischain_user');
        setUser(null);
        setAlerts([]);
        setResources([]);
        setStats({ total: 0, active: 0, resolved: 0, avgResponseTime: 0 });
        addToast('Session Terminated', 'info');
    };

    // --- ALERT ACTIONS ---
    const addAlert = async (alertData) => {
        try {
            await api.createAlert(alertData);
            await refreshData();
            addToast(`Emergency Logged: ${alertData.type}`, 'error');
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to create alert';
            addToast(msg, 'error');
            throw new Error(msg);
        }
    };

    const updateAlertStatus = async (id, status) => {
        try {
            await api.updateAlertStatus(id, status);
            await refreshData();
            addToast(`Alert updated to: ${status}`, 'success');
        } catch (err) {
            addToast('Failed to update alert status', 'error');
            throw err;
        }
    };

    // Alias for backward compat with components using updateStatus
    const updateStatus = updateAlertStatus;

    // --- RESOURCE ACTIONS ---
    const updateResource = async (id, deployed) => {
        try {
            await api.updateResource(id, deployed);
            await refreshData();
            addToast('Resource updated', 'success');
        } catch (err) {
            addToast('Failed to update resource', 'error');
            throw err;
        }
    };

    // --- ACTIONS ---
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar  = () => setIsSidebarOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    const addMessage = (sender, text, status = 'Active') => {
        const newMsg = {
            id: Date.now(),
            sender,
            text,
            time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
            status
        };
        setMessages(prev => [newMsg, ...prev]);
    };

    const advanceWorkflow = () => {
        if (workflowId < 4) {
            setWorkflowId(workflowId + 1);
            addToast('Workflow Timeline Advanced', 'success');
        }
    };

    const getIcon = (name) => {
        const icons = {
            AlertCircle, Waves, Wind, Flame, HeartPulse, Truck, Users,
            Droplets, Shield, Radiation, Activity, MapPin, AlertTriangle, Siren, HeartHandshake, ClipboardCheck
        };
        return icons[name] || AlertCircle;
    };

    return (
        <DashboardContext.Provider value={{
            user, isAuthLoading, alerts, actions, messages, resources, stats, workflowId, toasts,
            isSidebarOpen, isMobileMenuOpen, toggleSidebar, closeSidebar, toggleMobileMenu,
            login, signup, logout, addMessage, addAlert, updateStatus, updateAlertStatus, updateResource,
            advanceWorkflow, getIcon, searchQuery, setSearchQuery, addToast, refreshData
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    return useContext(DashboardContext);
}
