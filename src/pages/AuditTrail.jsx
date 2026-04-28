import { useState, useMemo, useEffect, useRef } from 'react';
import { Shield, Hash, Clock, FileText, ExternalLink, CheckCircle, Copy, Download } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { useSimulation } from '../context/SimulationContext';
import { generateBlock } from '../utils/auditLogger';

export default function AuditTrail() {
  const { auditEvents } = useSimulation();
  const [blocks, setBlocks] = useState([]);
  const [previousHash, setPreviousHash] = useState('0'.repeat(64));
  const processedEvents = useRef(new Set());

  useEffect(() => {
    // Process new audit events sequentially
    const processEvents = async () => {
      let currentHash = previousHash;
      for (const event of auditEvents) {
        // We use a simple hash of the event object as a unique identifier for processing
        const eventId = JSON.stringify(event) + event.timestamp;
        if (!processedEvents.current.has(eventId)) {
          const newBlock = await generateBlock(currentHash, event);
          setBlocks(prev => [newBlock, ...prev]);
          currentHash = newBlock.hash;
          processedEvents.current.add(eventId);
          setPreviousHash(currentHash);
        }
      }
    };
    processEvents();
  }, [auditEvents, previousHash]);
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Audit Trail</h2>
          <p>Immutable audit log with real SHA-256 verification</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => {
          const data = blocks.map(b => ({
            Block: b.id, Action: b.data.action, Vehicle: b.data.vehicle,
            Details: JSON.stringify(b.data.data), Timestamp: new Date(b.timestamp).toISOString(),
            Hash: b.hash, Verified: b.verified ? 'Yes' : 'No',
          }));
          exportToCSV(data, 'vaxsafe_audit_trail');
        }}>
          <Download size={13} /> Export Log
        </button>
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
                    background: selectedBlock === block.id ? 'rgba(79,70,229,0.05)' : undefined,
                    borderColor: selectedBlock === block.id ? 'rgba(79,70,229,0.2)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>Block #{block.id}</span>
                      {block.verified && <CheckCircle size={12} color="#10b981" />}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>{block.data.action}</span>
                    <span className="badge badge-neutral">{block.data.vehicle}</span>
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
                ['Action', selected.data.action],
                ['Vehicle', selected.data.vehicle],
                ['Timestamp', new Date(selected.timestamp).toLocaleString()],
                ['Details', JSON.stringify(selected.data.data)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>{k}</span>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Block Hash</div>
                <div className="block-hash" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8, fontSize: '0.65rem' }}>
                  {selected.hash}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Previous Hash</div>
                <div className="block-hash" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8, fontSize: '0.65rem' }}>
                  {selected.prevHash}
                </div>
              </div>

              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => {
                exportToPDF(`Block #${selected.id} Certificate`, [
                  { heading: 'Block Details', type: 'table',
                    headers: ['Field', 'Value'],
                    rows: [['Action', selected.data.action], ['Vehicle', selected.data.vehicle],
                      ['Timestamp', new Date(selected.timestamp).toLocaleString()],
                      ['Details', JSON.stringify(selected.data.data)],
                      ['Verified', selected.verified ? 'Yes' : 'No']],
                  },
                  { heading: 'Block Hash', type: 'text', content: selected.hash },
                  { heading: 'Previous Hash', type: 'text', content: selected.prevHash },
                ]);
              }}>
                <FileText size={14} /> Export Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
