import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';

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

function SuspenseFallback() {
  return (
    <div className="h-screen w-screen bg-[#08080A] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-t-2 border-[#00FFCC] rounded-full animate-spin" />
      <span className="font-mono text-[9px] text-[#00FFCC] animate-pulse uppercase tracking-[0.4em]">SYNCING_CORTEX...</span>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardProvider><DashboardMain /></DashboardProvider>} />
          <Route path="/resources" element={<DashboardProvider><ResourceInventory /></DashboardProvider>} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/report"   element={<ReportIncident />} />
          <Route path="/analytics" element={<DashboardProvider><Analytics /></DashboardProvider>} />
          <Route path="/alerts"    element={<DashboardProvider><Alerts /></DashboardProvider>} />
          <Route path="/settings"  element={<DashboardProvider><Settings /></DashboardProvider>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
