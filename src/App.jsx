import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardMain from './DashboardMain';
import ResourceInventory from './pages/ResourceInventory';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ReportIncident from './pages/ReportIncident';
import { DashboardProvider } from './context/DashboardContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Dashboard routes — fresh DashboardProvider on every mount */}
        <Route path="/dashboard" element={<DashboardProvider><DashboardMain /></DashboardProvider>} />
        <Route path="/resources" element={<DashboardProvider><ResourceInventory /></DashboardProvider>} />
        {/* Auth & utility pages */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/report"   element={<ReportIncident />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
