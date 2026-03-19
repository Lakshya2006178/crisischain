import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import WorkflowPanel from './components/panels/WorkflowPanel';
import LiveAlertsPanel from './components/panels/LiveAlertsPanel';
import MapPanel from './components/panels/MapPanel';
import CommunicationPanel from './components/panels/CommunicationPanel';
import ResourceTrackingPanel from './components/panels/ResourceTrackingPanel';
import AnalyticsPanel from './components/panels/AnalyticsPanel';
import IncidentActionPanel from './components/panels/IncidentActionPanel';
import { useDashboard } from './context/DashboardContext';

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-semibold text-white animate-in slide-in-from-right-8 fade-in 
          ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function App() {
  const { toasts, isSidebarOpen } = useDashboard();

  return (
    <div className="h-screen w-full bg-[#0f172a] text-slate-100 flex overflow-hidden">
      <Sidebar />
      <TopNavbar />

      {/* Main Content Area */}
      <main className={`flex-1 h-screen overflow-y-auto w-full pt-28 pb-12 px-4 md:px-6 transition-all duration-300
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
      `}>
        {/* Dashboard Grid - 12 Columns */}
        <div className="grid grid-cols-12 gap-4 max-w-[1600px] mx-auto pb-20 md:pb-10">

          {/* Row 1: WorkflowPanel (12) */}
          <div className="col-span-12">
            <WorkflowPanel />
          </div>

          {/* Row 2: Alerts (3), Map (6), Comms (3) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col h-[400px]">
            <LiveAlertsPanel />
          </div>

          <div className="col-span-12 lg:col-span-6 flex flex-col min-h-[400px] lg:h-[400px]">
            <MapPanel />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col h-[400px]">
            <CommunicationPanel />
          </div>

          {/* Row 3: Resource (4), Analytics (4), Incident (4) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col h-[350px] lg:h-[300px]">
            <ResourceTrackingPanel />
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col h-[350px] lg:h-[300px]">
            <AnalyticsPanel />
          </div>

          <div className="col-span-12 md:col-span-12 xl:col-span-4 lg:col-span-4 flex flex-col h-[350px] lg:h-[300px]">
            <IncidentActionPanel />
          </div>

        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
