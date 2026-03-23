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

// ── Shared size constants — keep in sync across Sidebar / TopNavbar / DashboardMain ──
export const SZ = {
  sidebarClosed: 72,   // px  w-[72px]
  sidebarOpen:   260,  // px  w-[260px]
  navbarH:       68,   // px  h-[68px]
};

function Toast({ message, type }) {
  const bg = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2563eb';
  return (
    <div className="font-inter px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white"
         style={{background: bg, border:'1px solid rgba(255,255,255,.12)'}}>
      {message}
    </div>
  );
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
    </div>
  );
}

export default function DashboardMain() {
  const { toasts, isSidebarOpen } = useDashboard();
  const ml = isSidebarOpen ? SZ.sidebarOpen : SZ.sidebarClosed;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{background:'#060d1a'}}>
      <Sidebar />
      <TopNavbar />

      {/* ── Scrollable content ─────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300"
        style={{
          marginLeft: ml,
          marginTop: SZ.navbarH,
          height: `calc(100vh - ${SZ.navbarH}px)`,
        }}
      >
        {/* 4-row layout — max 2 cards per row */}
        <div className="grid grid-cols-12 gap-5 p-5">

          {/* ── Row 1: Workflow strip ─────── full width */}
          <div className="col-span-12">
            <WorkflowPanel />
          </div>

          {/* ── Row 2: Live Alerts (4) | Map (8) */}
          <div className="col-span-12 lg:col-span-4" style={{minHeight: 420}}>
            <LiveAlertsPanel />
          </div>
          <div className="col-span-12 lg:col-span-8" style={{minHeight: 420}}>
            <MapPanel />
          </div>

          {/* ── Row 3: Comms (5) | Resources (7) */}
          <div className="col-span-12 lg:col-span-5" style={{minHeight: 320}}>
            <CommunicationPanel />
          </div>
          <div className="col-span-12 lg:col-span-7" style={{minHeight: 320}}>
            <ResourceTrackingPanel />
          </div>

          {/* ── Row 4: Analytics (7) | Actions (5) */}
          <div className="col-span-12 lg:col-span-7" style={{minHeight: 300}}>
            <AnalyticsPanel />
          </div>
          <div className="col-span-12 lg:col-span-5" style={{minHeight: 300}}>
            <IncidentActionPanel />
          </div>

        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
