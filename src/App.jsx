import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
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
  '/routes': { title: 'Route Optimizer', breadcrumb: 'Operations · Graph Routing' },
  '/fleet': { title: 'Fleet Monitor', breadcrumb: 'Operations · Live Tracking' },
  '/anomalies': { title: 'Anomaly Detection', breadcrumb: 'Operations · AI Alerts' },
  '/audit': { title: 'Audit Trail', breadcrumb: 'Compliance · Audit Log' },
  '/driver': { title: 'Driver App', breadcrumb: 'Mobile · Field View' },
  '/roadmap': { title: 'Project Roadmap', breadcrumb: 'Planning · Phases 0–5' },
};

function ProtectedRoute({ children, path }) {
  const { canAccess } = useAuth();
  if (!canAccess(path)) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: '#1e293b', marginBottom: 8 }}>Access Restricted</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Your role does not have permission to view this page.</p>
      </div>
    );
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const pageInfo = pageTitles[location.pathname] || { title: 'VaxSafe', breadcrumb: '' };

  if (!user) return <Login />;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header title={pageInfo.title} breadcrumb={pageInfo.breadcrumb} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<ProtectedRoute path="/"><Dashboard /></ProtectedRoute>} />
            <Route path="/digital-twin" element={<ProtectedRoute path="/digital-twin"><DigitalTwin /></ProtectedRoute>} />
            <Route path="/routes" element={<ProtectedRoute path="/routes"><RouteOptimizer /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute path="/fleet"><FleetMonitor /></ProtectedRoute>} />
            <Route path="/anomalies" element={<ProtectedRoute path="/anomalies"><AnomalyDetection /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute path="/audit"><AuditTrail /></ProtectedRoute>} />
            <Route path="/driver" element={<ProtectedRoute path="/driver"><DriverApp /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute path="/roadmap"><Roadmap /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', padding: '12px', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.5)' }}>
          🔍 Real: Gemini AI analysis, Dijkstra routing, SHA-256 audit log, live telemetry. 
          🔮 Simulated: full blockchain network (concept). All routing decisions use live trust scores.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SimulationProvider>
          <AppContent />
        </SimulationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
