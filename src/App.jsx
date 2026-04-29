import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from './context/DashboardContext';

// Standard Imports for Instant Transitions
import LandingPage from './pages/LandingPage';
import DashboardMain from './DashboardMain';
import ResourceInventory from './pages/ResourceInventory';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ReportIncident from './pages/ReportIncident';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';

function SuspenseFallback() {
  return (
    <div className="h-screen w-screen bg-[#08080A] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-t-2 border-[#00FFCC] rounded-full animate-spin" />
      <span className="font-mono text-[9px] text-[#00FFCC] animate-pulse uppercase tracking-[0.4em]">SYNCING_CORTEX...</span>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useDashboard();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminProtectedRoute({ children }) {
  const { user } = useDashboard();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { user } = useDashboard();
  if (user) {
    return <Navigate to={user.role === 'admin' ? "/dashboard" : "/alerts"} replace />;
  }
  return children;
}

function AppContent() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/admin"    element={<GuestRoute><AdminLogin /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><SignUpPage /></GuestRoute>} />
        
        <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<AdminProtectedRoute><DashboardMain /></AdminProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourceInventory /></ProtectedRoute>} />
        <Route path="/report"   element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/alerts"    element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        {/* <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </Router>
  );
}

export default App;
