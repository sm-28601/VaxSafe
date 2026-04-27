import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { routes, routeStatusColors } from '../data/mockRoutes';
import { nodes, getNodeById } from '../data/mockNodes';
import { formatDuration, getTempColor } from '../utils/helpers';
import { Navigation, Zap, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createDotIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-dot" style="background:${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function RouteOptimizer() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [showOptimized, setShowOptimized] = useState(true);

  const optimizedWaypoints = useMemo(() => {
    if (!selectedRoute) return [];
    // Simulate optimized route (slightly different path)
    return selectedRoute.waypoints.map(([lat, lng], i) => {
      const offset = (i % 2 === 0 ? 1 : -1) * 0.15;
      return [lat + offset * 0.3, lng + offset * 0.2];
    });
  }, [selectedRoute]);

  const savings = selectedRoute ? {
    distance: Math.round(selectedRoute.distance * 0.18),
    time: Math.round(selectedRoute.estTime * 0.15),
    risk: Math.round(selectedRoute.riskScore * 40),
    vaccines: Math.round(selectedRoute.vaccines * 0.03),
  } : {};

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Route Optimizer</h2>
        <p>RL-powered routing with time-temperature constraints (CVRVD)</p>
      </div>

      <div className="grid-2-1">
        {/* Map */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <h3>Route Map — {selectedRoute?.name}</h3>
            <div className="tabs">
              <button
                className={`tab-btn ${showOptimized ? 'active' : ''}`}
                onClick={() => setShowOptimized(true)}
              >
                Optimized
              </button>
              <button
                className={`tab-btn ${!showOptimized ? 'active' : ''}`}
                onClick={() => setShowOptimized(false)}
              >
                Legacy
              </button>
            </div>
          </div>
          <div className="map-container" style={{ height: 450 }}>
            <MapContainer
              center={[-1.0, 37.5]}
              zoom={7}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Legacy route (red) */}
              {selectedRoute && (
                <Polyline
                  positions={selectedRoute.waypoints}
                  color="#ef4444"
                  weight={3}
                  opacity={showOptimized ? 0.3 : 0.8}
                  dashArray={showOptimized ? '8 8' : undefined}
                />
              )}

              {/* Optimized route (green) */}
              {showOptimized && selectedRoute && (
                <Polyline
                  positions={optimizedWaypoints}
                  color="#10b981"
                  weight={3}
                  opacity={0.9}
                />
              )}

              {/* Node markers */}
              {selectedRoute?.nodes.map(nodeId => {
                const node = getNodeById(nodeId);
                if (!node) return null;
                return (
                  <Marker
                    key={node.id}
                    position={[node.lat, node.lng]}
                    icon={createDotIcon(getTempColor(node.currentTemp))}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'Inter', fontSize: 12 }}>
                        <strong>{node.name}</strong><br />
                        Temp: {node.currentTemp}°C<br />
                        Status: {node.status}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Route selector & details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Route list */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Routes</h3>
            </div>
            <div className="card-body" style={{ padding: '8px 12px', maxHeight: 300, overflow: 'auto' }}>
              {routes.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoute(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: selectedRoute?.id === r.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                    borderLeft: `3px solid ${routeStatusColors[r.status]}`,
                    marginBottom: 4,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{r.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.distance}km · {formatDuration(r.estTime)}</div>
                  </div>
                  <span className={`badge badge-${r.status === 'active' ? 'success' : r.status === 'at-risk' ? 'warning' : 'danger'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization savings */}
          {selectedRoute && (
            <div className="glass-card animate-in">
              <div className="card-header">
                <h3>Optimization Impact</h3>
                {selectedRoute.optimized && <span className="badge badge-success"><CheckCircle size={10} /> Optimized</span>}
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: <Navigation size={14} />, label: 'Distance Saved', value: `${savings.distance} km`, color: '#6366f1' },
                    { icon: <Clock size={14} />, label: 'Time Saved', value: `${savings.time} min`, color: '#06b6d4' },
                    { icon: <AlertTriangle size={14} />, label: 'Risk Reduction', value: `${savings.risk}%`, color: '#10b981' },
                    { icon: <Zap size={14} />, label: 'Reroute Latency', value: '< 3.2 sec', color: '#f59e0b' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                        {s.icon}
                      </div>
                      <span style={{ flex: 1, fontSize: '0.8rem', color: '#94a3b8' }}>{s.label}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
