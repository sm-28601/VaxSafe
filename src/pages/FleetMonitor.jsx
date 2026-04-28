import { useState, useMemo } from 'react';
import { useSensorStream } from '../hooks/useSensorStream';
import { getTempColor, getTempStatus, formatTemp, timeAgo } from '../utils/helpers';
import { routes } from '../data/mockRoutes';
import TempGauge from '../components/TempGauge';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, CartesianGrid
} from 'recharts';
import { Truck, Thermometer, Battery, Wifi, MapPin, X } from 'lucide-react';

export default function FleetMonitor() {
  const { vehicles } = useSensorStream();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return vehicles;
    return vehicles.filter(v => {
      const temp = v.currentTemp || v.baseTemp;
      const status = getTempStatus(temp);
      return status === filter;
    });
  }, [vehicles, filter]);

  const selected = selectedVehicle ? vehicles.find(v => v.id === selectedVehicle) : null;

  // Generate temp history for selected vehicle
  const selectedHistory = useMemo(() => {
    if (!selected) return [];
    return Array.from({ length: 30 }, (_, i) => ({
      time: `${30 - i}m`,
      temp: selected.baseTemp + (Math.random() - 0.5) * 1.2 + Math.sin(i * 0.15) * 0.4,
    }));
  }, [selected]);

  const statusCounts = {
    all: vehicles.length,
    normal: vehicles.filter(v => getTempStatus(v.currentTemp || v.baseTemp) === 'normal').length,
    warning: vehicles.filter(v => getTempStatus(v.currentTemp || v.baseTemp) === 'warning').length,
    critical: vehicles.filter(v => getTempStatus(v.currentTemp || v.baseTemp) === 'critical').length,
  };

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Fleet Monitor</h2>
        <p>Real-time tracking of all vehicles in the cold chain network</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-3">
        <div className="tabs">
          {['all', 'normal', 'warning', 'critical'].map(f => (
            <button
              key={f}
              className={`tab-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
            </button>
          ))}
        </div>
      </div>

      <div className={selected ? 'grid-2-1' : ''}>
        {/* Vehicle Table */}
        <div className="glass-card">
          <div className="card-body" style={{ padding: 0, overflow: 'auto', maxHeight: 600 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Route</th>
                  <th>Temperature</th>
                  <th>Status</th>
                  <th>Battery</th>
                  <th>Signal</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const temp = v.currentTemp || v.baseTemp;
                  const status = getTempStatus(temp);
                  const color = getTempColor(temp);
                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVehicle(selectedVehicle === v.id ? null : v.id)}
                      style={{
                        cursor: 'pointer',
                        background: selectedVehicle === v.id ? 'rgba(79,70,229,0.05)' : undefined,
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Truck size={14} color={color} />
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{v.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{v.driver}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{v.route}</td>
                      <td>
                        <span style={{ fontWeight: 700, color }}>{formatTemp(temp)}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${status === 'normal' ? 'success' : status === 'warning' ? 'warning' : 'danger'}`}>
                          <span className="badge-dot" /> {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Battery size={12} color={v.batteryLevel > 30 ? '#10b981' : '#ef4444'} />
                          <span style={{ fontSize: '0.8rem' }}>{v.batteryLevel}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Wifi size={12} color={v.signalStrength > 50 ? '#06b6d4' : '#f59e0b'} />
                          <span style={{ fontSize: '0.8rem' }}>{v.signalStrength}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ width: `${v.progress}%`, height: '100%', borderRadius: 3, background: '#6366f1', transition: 'width 0.5s ease' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="glass-card animate-in">
            <div className="card-header">
              <h3>{selected.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVehicle(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TempGauge temp={selected.currentTemp || selected.baseTemp} label="Current" size={120} />
              
              {/* Mini chart */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Temperature History</div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={selectedHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 12]} tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={2} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.3} />
                    <ReferenceLine y={8} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.3} />
                    <Line type="monotone" dataKey="temp" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Driver', selected.driver],
                  ['Route', selected.route],
                  ['Vaccines', `${selected.vaccineCount} doses`],
                  ['Battery', `${selected.batteryLevel}%`],
                  ['Signal', `${selected.signalStrength}%`],
                  ['Progress', `${Math.round(selected.progress)}%`],
                  ['Last Update', timeAgo(selected.lastUpdate)],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#94a3b8' }}>{k}</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
