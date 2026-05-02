import { createContext, useContext, useState, useEffect } from 'react';
import { AlertCircle, Waves, Wind, Flame, HeartPulse, Truck, Users, MessageSquare, AlertTriangle, ClipboardCheck, Siren, HeartHandshake, Droplets, Shield, Radiation, Activity, MapPin } from 'lucide-react';
import * as api from '../api/index.js';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    // --- STATE INITIALIZATION ---
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [userLocation, setUserLocation] = useState(
        JSON.parse(localStorage.getItem('userLocation')) || null
    );

    // Silently request GPS; store in state + localStorage
    const captureLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const loc = { lat: coords.latitude, lng: coords.longitude };
                setUserLocation(loc);
                localStorage.setItem('userLocation', JSON.stringify(loc));
            },
            () => {} // silent fail — user may deny, that's fine
        );
    };

    // If already logged in on page load, re-capture location
    useEffect(() => {
        if (user) captureLocation();
    }, []);
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'fire', location: 'San Francisco, CA', severity: 'high', description: 'Structural fire reported in Sector 4.', time: '2m ago', iconName: 'Flame', critical: true, status: 'Active' },
        { id: 2, type: 'flood', location: 'Miami, FL', severity: 'medium', description: 'Rising water levels in coastal areas.', time: '10m ago', iconName: 'Droplets', critical: false, status: 'Pending' },
        { id: 3, type: 'medical', location: 'Austin, TX', severity: 'high', description: 'Mass casualty exercise / hospital influx.', time: 'Just now', iconName: 'HeartPulse', critical: true, status: 'Dispatched' },
    ]);
    const [resources, setResources] = useState([
        { id: 1, name: 'Bravo Team (Fire)', type: 'Emergency', status: 'Available', deployed: false, iconName: 'Flame' },
        { id: 2, name: 'Medic-4 Unit', type: 'Medical', status: 'En Route', deployed: true, iconName: 'HeartPulse' },
        { id: 3, name: 'Logistics Drone', type: 'Support', status: 'Available', deployed: false, iconName: 'Activity' },
    ]);
    const [stats, setStats] = useState({ total: 124, active: 12, resolved: 112, avgResponseTime: 4.2 });
    const [trends, setTrends] = useState([]);
    
    // Mock logic for visuals that aren't fully in backend yet
    const [actions, setActions] = useState([
        { id: 1, title: 'Evacuate Sector 4', priority: 'High', source: 'Weather API', time: 'Just now' },
        { id: 2, title: 'Deploy Bravo Team', priority: 'High', source: 'Ground Cmd', time: '5m ago' },
        { id: 3, title: 'Activate Reserve Gens', priority: 'Medium', source: 'Sensors', time: '12m ago' },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, sender: 'HQ Command', text: 'System Online. Establishing secure comms uplink.', time: '10:40 AM', status: 'Active' },
    ]);

    const [workflowId, setWorkflowId] = useState(2); 
    const [toasts, setToasts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- FETCH DATA (MAPPED TO MOCK FOR NOW) ---
    const refreshData = async () => {
        // Skipping real API calls as requested to bypass backend dependency
        // In a real app, this would be: await api.fetchAlerts()...
    };

    useEffect(() => {
        // No-op for now to keep the UI stable without server connection
    }, []);

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

    const login = async (formData, isAdmin = false) => {
        try {
            const { data } = await api.login(formData);
            if (isAdmin && data.user.role !== 'admin') {
                throw new Error("Admin access denied.");
            }
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            setUser(data.user);
            captureLocation(); // Capture GPS at login
            addToast('Session Initialized: Welcome Back', 'success');
            return data.user;
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Login failed';
            addToast(msg, 'error');
            throw error;
        }
    };

    const signup = async (formData) => {
        try {
            const { data } = await api.register(formData);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            setUser(data.user);
            captureLocation(); // Capture GPS on registration
            addToast('Registration Successful', 'success');
            return data.user;
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Signup failed';
            addToast(msg, 'error');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userLocation');
        document.cookie.split(";").forEach((c) => { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        setUser(null);
        setUserLocation(null);
        addToast('Session Terminated', 'info');
    };

    // --- ACTIONS ---
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar  = () => setIsSidebarOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const addAlert = async (alertData) => {
        const newAlert = {
            ...alertData,
            id: Date.now(),
            time: 'Just now',
            iconName: getIconName(alertData.type),
            critical: alertData.severity === 'high' || alertData.severity === 'critical',
            status: 'Active'
        };
        setAlerts(prev => [newAlert, ...prev]);
        setStats(prev => ({ ...prev, total: prev.total + 1, active: prev.active + 1 }));
        addToast(`Emergency Logged Locally: ${alertData.type}`, newAlert.critical ? 'error' : 'info');
        return newAlert;
    };

    const updateStatus = async (id, status) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        addToast(`Alert status updated to ${status} (Local)`, 'success');
    };

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
            user, alerts, actions, messages, resources, stats, workflowId, toasts,
            isSidebarOpen, isMobileMenuOpen, toggleSidebar, closeSidebar, toggleMobileMenu,
            login, signup, logout, addMessage, addAlert, updateStatus, advanceWorkflow,
            getIcon, searchQuery, setSearchQuery, addToast, refreshData,
            userLocation, captureLocation
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    return useContext(DashboardContext);
}
