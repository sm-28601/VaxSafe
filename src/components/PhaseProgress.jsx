import { PHASES } from '../utils/constants';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export default function PhaseProgress() {
  return (
    <div className="glass-card">
      <div className="card-header">
        <h3>Project Phases</h3>
        <span className="badge badge-primary">Phase 2 Active</span>
      </div>
      <div className="card-body">
        <div className="phase-progress" style={{ marginBottom: 20 }}>
          {PHASES.map(p => (
            <div
              key={p.id}
              className={`phase-step ${p.status === 'completed' ? 'completed' : p.status === 'in-progress' ? 'current' : ''}`}
              title={p.name}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PHASES.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 0',
                opacity: p.status === 'upcoming' ? 0.5 : 1,
              }}
            >
              {p.status === 'completed' ? (
                <CheckCircle2 size={16} color="#10b981" />
              ) : p.status === 'in-progress' ? (
                <Loader2 size={16} color="#6366f1" style={{ animation: 'spin 2s linear infinite' }} />
              ) : (
                <Circle size={16} color="#64748b" />
              )}
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: p.status === 'upcoming' ? '#64748b' : '#e2e8f0' }}>
                Phase {p.id}: {p.name}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#64748b' }}>
                Weeks {p.weeks}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
