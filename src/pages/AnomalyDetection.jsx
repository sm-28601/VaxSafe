import { useState, useMemo } from 'react';
import { severityColors } from '../data/mockAlerts';
import { useSimulation } from '../context/SimulationContext';
import { timeAgo, formatDate } from '../utils/helpers';
import AIAssistant from '../components/AIAssistant';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Filter, Search } from 'lucide-react';

export default function AnomalyDetection() {
  const { alerts, resolveAlert } = useSimulation();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    let list = alerts;
    if (filter !== 'all') list = list.filter(a => a.severity === filter);
    if (searchTerm) list = list.filter(a =>
      a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return list;
  }, [alerts, filter, searchTerm]);

  // Anomaly trend (hourly counts for last 24h)
  const trendData = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => {
      const hourStart = now - (24 - i) * 3600000;
      const hourEnd = hourStart + 3600000;
      const count = alerts.filter(a => {
        const t = new Date(a.timestamp).getTime();
        return t >= hourStart && t < hourEnd;
      }).length;
      return { hour: `${24 - i}h`, count, predicted: count + Math.round((Math.random() - 0.3) * 2) };
    });
  }, [alerts]);

  // Detection method distribution
  const methodDist = useMemo(() => {
    const counts = {};
    alerts.forEach(a => { counts[a.detectionMethod] = (counts[a.detectionMethod] || 0) + 1; });
    const colors = { 'Static Threshold': '#6366f1', 'ML Prediction': '#06b6d4', 'Pattern Recognition': '#10b981', 'Manual Report': '#f59e0b' };
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: colors[name] || '#8b5cf6' }));
  }, [alerts]);

  // Severity breakdown
  const severityDist = useMemo(() => {
    const counts = { critical: 0, warning: 0, info: 0 };
    alerts.forEach(a => { counts[a.severity] = (counts[a.severity] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: severityColors[name] }));
  }, [alerts]);

  const activeCount = alerts.filter(a => !a.resolved).length;
  const resolvedCount = alerts.filter(a => a.resolved).length;
  const avgResolution = '23 min';

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Anomaly Detection</h2>
        <p>AI-powered anomaly detection with trend-based early warning & static thresholds</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Alerts (7d)', value: alerts.length, color: '#6366f1', icon: <AlertTriangle size={16} /> },
          { label: 'Active', value: activeCount, color: '#ef4444', icon: <Clock size={16} /> },
          { label: 'Resolved', value: resolvedCount, color: '#10b981', icon: <CheckCircle size={16} /> },
          { label: 'Avg Resolution', value: avgResolution, color: '#06b6d4', icon: <Clock size={16} /> },
          { label: 'False Positive Rate', value: '4.2%', color: '#f59e0b', icon: <Filter size={16} /> },
        ].map((s, i) => (
          <div key={i} className="stat-card animate-in" style={{ '--stat-accent': s.color }}>
            <div className="stat-card-top">
              <div className="stat-card-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            </div>
            <div className="stat-card-value" style={{ fontSize: '1.4rem' }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2">
        {/* Trend */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Anomaly Trend (24h) — Actual vs Predicted</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 4" name="Predicted" />
                <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Method distribution */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Detection Methods</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="45%" height={200}>
              <PieChart>
                <Pie data={methodDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {methodDist.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {methodDist.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.fill, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.78rem', color: '#64748b' }}>{m.name}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div className="glass-card">
        <div className="card-header">
          <h3>Alert Log</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="header-search" style={{ minWidth: 160 }}>
              <Search size={12} />
              <input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#1e293b', fontSize: '0.78rem', width: '100%' }}
              />
            </div>
            <div className="tabs">
              {['all', 'critical', 'warning', 'info'].map(f => (
                <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0, maxHeight: 400, overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Alert</th>
                <th>Vehicle</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Detection</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 30).map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{a.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.82rem' }}>{a.label}</div>
                        {a.tempReading && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{a.tempReading}°C</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{a.vehicle}</td>
                  <td style={{ fontSize: '0.8rem' }}>{a.location}</td>
                  <td>
                    <span className={`badge badge-${a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'info'}`}>
                      {a.severity}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{a.detectionMethod}</span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{timeAgo(a.timestamp)}</td>
                  <td>
                    {a.resolved ? (
                      <span className="badge badge-success"><CheckCircle size={10} /> Resolved</span>
                    ) : (
                      <button 
                        className="badge badge-danger" 
                        style={{ cursor: 'pointer', border: 'none', background: '#fef2f2', color: '#ef4444' }}
                        onClick={() => resolveAlert(a.id)}
                        title="Click to resolve"
                      >
                        Active (Resolve)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <AIAssistant activeAlerts={alerts.filter(a => !a.resolved)} />
    </div>
  );
}
