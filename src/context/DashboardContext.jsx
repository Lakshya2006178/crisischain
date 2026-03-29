import { createContext, useContext, useState, useEffect } from 'react';
import { AlertCircle, Waves, Wind, Flame, HeartPulse, Truck, Users, MessageSquare, AlertTriangle, ClipboardCheck, Siren, HeartHandshake } from 'lucide-react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    // --- STATE INITIALIZATION ---
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'Cyclone', location: 'Coastal Sector 4', time: '2 mins ago', critical: true, iconName: 'Wind' },
        { id: 2, type: 'Flood Warning', location: 'River Valley Area', time: '14 mins ago', critical: true, iconName: 'Waves' },
        { id: 3, type: 'Wildfire', location: 'Northern Ridge', time: '1 hr ago', critical: false, iconName: 'Flame' },
        { id: 4, type: 'Structural Collapse', location: 'Downtown Block B', time: '3 hrs ago', critical: false, iconName: 'AlertCircle' },
    ]);

    const [actions, setActions] = useState([
        { id: 1, title: 'Evacuate Sector 4', priority: 'High', source: 'Weather API', time: 'Just now' },
        { id: 2, title: 'Deploy Bravo Team', priority: 'High', source: 'Ground Cmd', time: '5m ago' },
        { id: 3, title: 'Activate Reserve Gens', priority: 'Medium', source: 'Sensors', time: '12m ago' },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, sender: 'Alpha Team', text: 'Arrived at Downtown Block B. Assessing structural damage.', time: '10:42 AM', status: 'Active' },
        { id: 2, sender: 'HQ Command', text: 'Evacuation orders issued for Coastal Sector 4. Proceed immediately.', time: '10:40 AM', status: 'Critical' },
        { id: 3, sender: 'Medevac Unit 3', text: 'Transporting 5 casualties to City Central Hospital. ETA 15 mins.', time: '10:35 AM', status: 'Active' },
        { id: 4, sender: 'Sensor Grid Area 51', text: 'Water levels rising by 2 feet/hour near River Valley.', time: '10:30 AM', status: 'Warning' },
    ]);

    const [resources, setResources] = useState([
        { id: 1, name: 'Ambulances', iconName: 'HeartPulse', count: 24, total: 30, color: 'text-red-500', bg: 'bg-red-500' },
        { id: 2, name: 'Fire Trucks', iconName: 'Flame', count: 18, total: 20, color: 'text-orange-500', bg: 'bg-orange-500' },
        { id: 3, name: 'Rescue Teams', iconName: 'Users', count: 12, total: 15, color: 'text-blue-500', bg: 'bg-blue-500' },
        { id: 4, name: 'Supply Trucks', iconName: 'Truck', count: 8, total: 10, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    ]);

    const [workflowId, setWorkflowId] = useState(2); // 1 to 4
    const [toasts, setToasts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const acknowledgeAction = (id) => {
        setActions(prev => prev.filter(a => a.id !== id));
        addMessage('System', `Action item acknowledged and cleared.`, 'Resolved');
        addToast('Action Acknowledged', 'success');
    };

    const escalateAction = (actionId) => {
        const action = actions.find(a => a.id === actionId);
        if (action) {
            setActions(prev => prev.filter(a => a.id !== actionId));
            addAlert(action.title, 'Escalated from pending.', true, 'AlertCircle');
            addMessage('Commander', `ESCALATED: ${action.title}. Immediate action required.`, 'Critical');
            addToast('Action Escalated to Critical', 'error');
        }
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

    const addAlert = (type, location, critical, iconName = 'AlertCircle') => {
        const newAlert = {
            id: Date.now(),
            type,
            location,
            time: 'Just now',
            critical,
            iconName
        };
        setAlerts(prev => [newAlert, ...prev]);
    };

    const advanceWorkflow = () => {
        if (workflowId < 4) {
            setWorkflowId(workflowId + 1);
            addToast('Workflow Timeline Advanced', 'success');
        }
    };

    const getIcon = (name) => {
        const icons = { AlertCircle, Waves, Wind, Flame, HeartPulse, Truck, Users };
        return icons[name] || AlertCircle;
    };

    // --- SIMULATION (Fake live incoming data) ---
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly update resource counts down or up slightly
            setResources(prev => prev.map(res => {
                // 10% chance to change a resource
                if (Math.random() > 0.9) {
                    let change = Math.random() > 0.5 ? 1 : -1;
                    let newCount = res.count + change;
                    if (newCount < 0) newCount = 0;
                    if (newCount > res.total) newCount = res.total;
                    return { ...res, count: newCount };
                }
                return res;
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardContext.Provider value={{
            alerts, actions, messages, resources, workflowId, toasts,
            isSidebarOpen, isMobileMenuOpen, toggleSidebar, closeSidebar, toggleMobileMenu,
            acknowledgeAction, escalateAction, addMessage, addAlert, advanceWorkflow,
            getIcon, searchQuery, setSearchQuery, addToast
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    return useContext(DashboardContext);
}
