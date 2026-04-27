import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import RouteOptimizer from './pages/RouteOptimizer';
import FleetMonitor from './pages/FleetMonitor';
import AnomalyDetection from './pages/AnomalyDetection';
import AuditTrail from './pages/AuditTrail';
import DriverApp from './pages/DriverApp';
import Roadmap from './pages/Roadmap';

const pageTitles = {
  '/': { title: 'Command Center', breadcrumb: 'Dashboard · Overview' },
  '/digital-twin': { title: 'Digital Twin', breadcrumb: 'Simulation · Network' },
  '/routes': { title: 'Route Optimizer', breadcrumb: 'Operations · RL Routing' },
  '/fleet': { title: 'Fleet Monitor', breadcrumb: 'Operations · Live Tracking' },
  '/anomalies': { title: 'Anomaly Detection', breadcrumb: 'Operations · AI Alerts' },
  '/audit': { title: 'Audit Trail', breadcrumb: 'Compliance · Blockchain' },
  '/driver': { title: 'Driver App', breadcrumb: 'Mobile · Field View' },
  '/roadmap': { title: 'Project Roadmap', breadcrumb: 'Planning · Phases 0–5' },
};

function AppContent() {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: 'VaxSafe', breadcrumb: '' };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header title={pageInfo.title} breadcrumb={pageInfo.breadcrumb} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/routes" element={<RouteOptimizer />} />
            <Route path="/fleet" element={<FleetMonitor />} />
            <Route path="/anomalies" element={<AnomalyDetection />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/driver" element={<DriverApp />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
