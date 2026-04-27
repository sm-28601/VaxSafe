import { useState, useMemo } from 'react';
import { Shield, Hash, Clock, FileText, ExternalLink, CheckCircle, Copy } from 'lucide-react';

// Generate mock blockchain records
function generateBlocks(count = 25) {
  const actions = [
    'Temperature Recorded', 'Route Started', 'Delivery Confirmed', 'Reroute Triggered',
    'Sensor Calibrated', 'Cold Storage Opened', 'Vaccine Batch Verified', 'Equipment Inspection',
    'Excursion Flagged', 'Chain of Custody Transfer',
  ];
  const vehicles = Array.from({ length: 10 }, (_, i) => `VX-${String(i + 1).padStart(3, '0')}`);
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const ts = new Date(now - i * 900000); // every 15 min
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const prevHash = i < count - 1 ? Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('') : '0'.repeat(64);
    return {
      id: count - i,
      hash,
      prevHash,
      timestamp: ts.toISOString(),
      action: actions[Math.floor(Math.random() * actions.length)],
      vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
      data: {
        temp: (2 + Math.random() * 6).toFixed(1),
        lat: (-1.2 + Math.random() * 2).toFixed(4),
        lng: (35 + Math.random() * 5).toFixed(4),
      },
      verified: Math.random() > 0.05,
      nonce: Math.floor(Math.random() * 100000),
    };
  });
}

export default function AuditTrail() {
  const [blocks] = useState(() => generateBlocks(30));
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const selected = selectedBlock !== null ? blocks.find(b => b.id === selectedBlock) : null;

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Audit Trail</h2>
        <p>Immutable blockchain-verified chain of custody records (Hyperledger)</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Blocks', value: blocks.length, color: '#6366f1', icon: <Hash size={16} /> },
          { label: 'Verified', value: blocks.filter(b => b.verified).length, color: '#10b981', icon: <CheckCircle size={16} /> },
          { label: 'Chain Healthy', value: '100%', color: '#06b6d4', icon: <Shield size={16} /> },
          { label: 'Last Block', value: '2 min ago', color: '#f59e0b', icon: <Clock size={16} /> },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-accent': s.color }}>
            <div className="stat-card-top">
              <div className="stat-card-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            </div>
            <div className="stat-card-value" style={{ fontSize: '1.4rem' }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={selected ? 'grid-2' : ''}>
        {/* Block chain */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Block Explorer</h3>
            <span className="badge badge-success"><span className="badge-dot" /> Chain Active</span>
          </div>
          <div className="card-body" style={{ maxHeight: 550, overflow: 'auto' }}>
            {blocks.map((block, i) => (
              <div key={block.id}>
                <div
                  className="block-card"
                  onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                  style={{
                    cursor: 'pointer',
                    background: selectedBlock === block.id ? 'rgba(99,102,241,0.08)' : undefined,
                    borderColor: selectedBlock === block.id ? 'rgba(99,102,241,0.3)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>Block #{block.id}</span>
                      {block.verified && <CheckCircle size={12} color="#10b981" />}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{block.action}</span>
                    <span className="badge badge-neutral">{block.vehicle}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="block-hash">{block.hash.slice(0, 16)}...{block.hash.slice(-8)}</span>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                      onClick={(e) => { e.stopPropagation(); copyHash(block.hash); }}
                    >
                      <Copy size={10} color={copiedHash === block.hash ? '#10b981' : '#64748b'} />
                    </button>
                  </div>
                </div>
                {i < blocks.length - 1 && <div className="block-chain-line" />}
              </div>
            ))}
          </div>
        </div>

        {/* Block detail */}
        {selected && (
          <div className="glass-card animate-in">
            <div className="card-header">
              <h3>Block #{selected.id} Details</h3>
              <span className={`badge ${selected.verified ? 'badge-success' : 'badge-danger'}`}>
                {selected.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Action', selected.action],
                ['Vehicle', selected.vehicle],
                ['Timestamp', new Date(selected.timestamp).toLocaleString()],
                ['Nonce', selected.nonce],
                ['Temperature', `${selected.data.temp}°C`],
                ['Latitude', selected.data.lat],
                ['Longitude', selected.data.lng],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Block Hash</div>
                <div className="block-hash" style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 8, fontSize: '0.65rem' }}>
                  {selected.hash}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Previous Hash</div>
                <div className="block-hash" style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 8, fontSize: '0.65rem' }}>
                  {selected.prevHash}
                </div>
              </div>

              <button className="btn btn-primary" style={{ marginTop: 8 }}>
                <FileText size={14} /> Export Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
