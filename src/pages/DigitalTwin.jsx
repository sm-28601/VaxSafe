import { useState, useMemo } from 'react';
import { nodeTypes } from '../data/mockNodes';
import { useSimulation } from '../context/SimulationContext';
import { Play, Pause, FastForward, Zap, Info } from 'lucide-react';
import TempGauge from '../components/TempGauge';

export default function DigitalTwin() {
  const { nodes, routes } = useSimulation();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  // Map nodes to canvas positions (normalize lat/lng to pixel space)
  const canvasNodes = useMemo(() => {
    const lats = nodes.map(n => n.lat);
    const lngs = nodes.map(n => n.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const padX = 80, padY = 60;
    const W = 900, H = 500;

    return nodes.map(n => ({
      ...n,
      x: padX + ((n.lng - minLng) / (maxLng - minLng)) * (W - 2 * padX),
      y: padY + ((maxLat - n.lat) / (maxLat - minLat)) * (H - 2 * padY),
    }));
  }, [nodes]);

  // Build edges from routes
  const edges = useMemo(() => {
    const edgeList = [];
    routes.forEach(r => {
      for (let i = 0; i < r.nodes.length - 1; i++) {
        const from = canvasNodes.find(n => n.id === r.nodes[i]);
        const to = canvasNodes.find(n => n.id === r.nodes[i + 1]);
        if (from && to) {
          edgeList.push({ from, to, routeId: r.id, status: r.status });
        }
      }
    });
    return edgeList;
  }, [canvasNodes, routes]);

  const selected = selectedNode ? canvasNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Digital Twin</h2>
        <p>Interactive simulation of the vaccine cold chain network</p>
      </div>

      {/* Controls */}
      <div className="glass-card">
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSpeed(s => s === 4 ? 1 : s * 2)}>
            <FastForward size={14} /> {speed}x Speed
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const riskNode = nodes.find(n => n.status === 'critical');
            if (riskNode) setSelectedNode(riskNode.id);
          }}>
            <Zap size={14} /> Inject Disruption
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, fontSize: '0.75rem', color: '#64748b' }}>
            {Object.entries(nodeTypes).map(([key, val]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: val.color }} />
                {val.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={selected ? 'grid-2-1' : ''} style={{ minHeight: 500 }}>
        {/* Network Canvas */}
        <div className="twin-canvas">
          <svg width="100%" height="100%" viewBox="0 0 900 500" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Edges */}
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.from.x} y1={e.from.y}
                x2={e.to.x} y2={e.to.y}
                stroke={e.status === 'critical' ? '#ef4444' : e.status === 'at-risk' ? '#f59e0b' : '#cbd5e1'}
                strokeWidth={e.status === 'active' ? 1.5 : 2}
                strokeDasharray={e.status === 'critical' ? '4 4' : 'none'}
              />
            ))}
            
            {/* Animated particles on active edges */}
            {isPlaying && edges.filter(e => e.status === 'active').map((e, i) => {
              const dx = e.to.x - e.from.x;
              const dy = e.to.y - e.from.y;
              return (
                <circle key={`p-${i}`} r={3} fill="#06b6d4" opacity={0.8}>
                  <animateMotion
                    dur={`${4 / speed}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.3}s`}
                    path={`M${e.from.x},${e.from.y} L${e.to.x},${e.to.y}`}
                  />
                </circle>
              );
            })}
          </svg>

          {/* Nodes */}
          {canvasNodes.map(n => {
            const typeInfo = nodeTypes[n.type];
            const isSelected = selectedNode === n.id;
            return (
              <div
                key={n.id}
                className="twin-node"
                style={{
                  left: n.x - 22,
                  top: n.y - 22,
                  zIndex: isSelected ? 20 : 1,
                }}
                onClick={() => setSelectedNode(isSelected ? null : n.id)}
              >
                <div
                  className="twin-node-circle"
                  style={{
                    borderColor: isSelected ? '#fff' : typeInfo.color,
                    background: isSelected ? typeInfo.color : n.status === 'critical' ? '#ef4444' : n.status === 'warning' ? '#f59e0b' : '#ffffff',
                    boxShadow: isSelected ? `0 0 20px ${typeInfo.color}50` : 'none',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {typeInfo.icon}
                </div>
                <div className="twin-node-label" style={{ color: isSelected ? '#fff' : '#94a3b8' }}>
                  {n.name.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="glass-card animate-in">
            <div className="card-header">
              <h3>{selected.name}</h3>
              <span className={`badge badge-${selected.status === 'operational' ? 'success' : selected.status === 'warning' ? 'warning' : 'danger'}`}>
                <span className="badge-dot" /> {selected.status}
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TempGauge temp={selected.currentTemp} label={selected.name.split(' ')[0]} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Type', nodeTypes[selected.type].label],
                  ['Equipment', selected.equipment],
                  ['Capacity', `${selected.capacity.toLocaleString()} doses`],
                  ['Reliability', `${(selected.reliability * 100).toFixed(0)}%`],
                  ['Safe Range', `${selected.tempRange[0]}–${selected.tempRange[1]}°C`],
                  ['Current Temp', `${selected.currentTemp}°C`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
                    <span style={{ color: '#94a3b8' }}>{label}</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Network Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Nodes', value: nodes.length, color: '#6366f1' },
          { label: 'Active Routes', value: routes.filter(r => r.status === 'active').length, color: '#10b981' },
          { label: 'At-Risk', value: nodes.filter(n => n.status === 'warning').length, color: '#f59e0b' },
          { label: 'Critical', value: nodes.filter(n => n.status === 'critical').length, color: '#ef4444' },
          { label: 'Total Capacity', value: `${(nodes.reduce((s, n) => s + n.capacity, 0) / 1000).toFixed(0)}K`, color: '#06b6d4' },
        ].map((s, i) => (
          <div key={i} className="stat-card animate-in" style={{ '--stat-accent': s.color }}>
            <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
