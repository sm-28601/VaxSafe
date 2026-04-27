import { useState, useMemo } from 'react';
import { useSensorStream } from '../hooks/useSensorStream';
import { getTempColor, formatTemp } from '../utils/helpers';
import { nodes, getNodeById } from '../data/mockNodes';
import {
  Thermometer, MapPin, CheckCircle, AlertTriangle, Phone,
  Navigation, Package, Clock
} from 'lucide-react';

export default function DriverApp() {
  const { vehicles } = useSensorStream();
  const driver = vehicles[0]; // Current driver's vehicle
  const temp = driver?.currentTemp || driver?.baseTemp || 4.5;
  const color = getTempColor(temp);
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Pre-trip inspection completed', done: true },
    { id: 2, label: 'Cold chain sealed and verified', done: true },
    { id: 3, label: 'Sensor calibration confirmed', done: true },
    { id: 4, label: 'Departure from Nairobi Central', done: true },
    { id: 5, label: 'Nakuru Transit delivery', done: false },
    { id: 6, label: 'Eldoret Hub delivery', done: false },
    { id: 7, label: 'Kitale Health Center delivery', done: false },
    { id: 8, label: 'Return trip confirmed', done: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const routeStops = [
    { name: 'Nairobi Central Depot', status: 'completed', time: '06:30 AM', temp: '4.2°C' },
    { name: 'Nakuru Transit Point', status: 'completed', time: '08:45 AM', temp: '4.5°C' },
    { name: 'Eldoret Regional Hub', status: 'current', time: 'ETA 11:00 AM', temp: '—' },
    { name: 'Kitale Health Center', status: 'upcoming', time: 'ETA 01:15 PM', temp: '—' },
  ];

  return (
    <div className="driver-layout dashboard-grid">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h2>🛡️ VaxSafe Driver</h2>
        <p>Route R03 — Nairobi → Eldoret Northern</p>
      </div>

      {/* Temperature Status */}
      <div className="driver-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Thermometer size={24} color={color} />
          <span style={{ fontSize: '2.5rem', fontWeight: 900, color, letterSpacing: '-0.02em' }}>
            {formatTemp(temp)}
          </span>
        </div>
        
        {/* Temp bar */}
        <div style={{ marginBottom: 8 }}>
          <div className="driver-temp-bar">
            <div
              className="driver-temp-fill"
              style={{
                width: `${Math.min(100, (temp / 12) * 100)}%`,
                background: color,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.65rem', color: '#64748b' }}>
            <span>0°C</span>
            <span style={{ color: '#10b981' }}>Safe: 2–8°C</span>
            <span>12°C</span>
          </div>
        </div>

        <span className={`badge ${temp >= 2 && temp <= 8 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.8rem', padding: '5px 16px' }}>
          {temp >= 2 && temp <= 8 ? '✓ Temperature Safe' : '⚠ Temperature Warning'}
        </span>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { icon: <Package size={16} />, label: 'Vaccines', value: '920 doses', color: '#6366f1' },
          { icon: <Navigation size={16} />, label: 'Progress', value: '62%', color: '#06b6d4' },
          { icon: <Clock size={16} />, label: 'ETA Next', value: '1h 15m', color: '#10b981' },
          { icon: <AlertTriangle size={16} />, label: 'Alerts', value: '0', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="driver-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Route Stops */}
      <div className="driver-card">
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>
          <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />
          Route Progress
        </div>
        
        {routeStops.map((stop, i) => (
          <div key={i}>
            <div className="driver-route-step">
              <div
                className={`driver-route-dot ${stop.status === 'completed' ? 'completed' : ''}`}
                style={{
                  borderColor: stop.status === 'current' ? '#f59e0b' : stop.status === 'completed' ? '#6366f1' : '#64748b',
                  background: stop.status === 'completed' ? '#6366f1' : stop.status === 'current' ? '#f59e0b' : 'transparent',
                  boxShadow: stop.status === 'current' ? '0 0 8px rgba(245,158,11,0.5)' : 'none',
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: stop.status === 'upcoming' ? '#64748b' : '#e2e8f0' }}>
                  {stop.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', gap: 12, marginTop: 2 }}>
                  <span>{stop.time}</span>
                  <span>{stop.temp}</span>
                </div>
              </div>
              {stop.status === 'completed' && <CheckCircle size={16} color="#10b981" />}
              {stop.status === 'current' && <Navigation size={16} color="#f59e0b" />}
            </div>
            {i < routeStops.length - 1 && <div className="driver-route-line" />}
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="driver-card">
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>
          Delivery Checklist
        </div>
        {checklist.map(item => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              border: `2px solid ${item.done ? '#10b981' : '#64748b'}`,
              background: item.done ? '#10b981' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}>
              {item.done && <CheckCircle size={12} color="white" />}
            </div>
            <span style={{
              fontSize: '0.82rem',
              color: item.done ? '#64748b' : '#e2e8f0',
              textDecoration: item.done ? 'line-through' : 'none',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Emergency Button */}
      <button
        className="btn"
        style={{
          width: '100%', padding: '14px', justifyContent: 'center',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white', borderRadius: 16, fontSize: '0.95rem', fontWeight: 700,
        }}
      >
        <Phone size={18} /> Emergency Alert
      </button>
    </div>
  );
}
