import { PHASES } from '../utils/constants';
import { CheckCircle, Loader2, Circle, ChevronDown, AlertTriangle, Shield, Target } from 'lucide-react';

const phaseDetails = {
  0: {
    title: 'Foundation',
    description: 'Define MVP scope, assemble core team, secure pilot partner with data-sharing agreement.',
    items: ['Define MVP scope & KPIs (zero-excursion target routes)', 'Assemble core team (ML eng, IoT, back-end, ops)', 'Secure pilot partner (MoH/3PL) & data sharing agreement'],
    gate: 'Signed pilot agreement with data-sharing access',
    tools: 'Miro, Jira, Notion',
    roles: 'Product manager, domain expert, legal',
    risks: [{ risk: 'Pilot partner drops out', mitigation: 'Have 2-3 potential partners in parallel; start with non-binding MoU' }],
  },
  1: {
    title: 'Data & Simulation',
    description: 'Ingest historical data, build digital twin, develop Reliability Score algorithm, train RL routing agent.',
    items: ['Ingest historical logs (temp, location, incidents)', 'Build digital twin of pilot network', 'Develop Reliability Score algorithm (multi-dim)', 'Train RL routing agent (CVRVD with time-temp constraints)', 'Validate simulated performance (spoilage ≥40%, reroute <5s)'],
    gate: 'Digital twin shows ≥40% reduction in temperature excursions',
    tools: 'Python (RLlib, PyTorch), AnyLogic, SimPy',
    roles: 'ML engineer, simulation engineer, data scientist',
    risks: [{ risk: 'Digital twin unrealistic', mitigation: 'Validate with 2 weeks of real historical data; use residual analysis' }],
  },
  2: {
    title: 'Core Engineering',
    description: 'Build edge gateway, cloud backend, anomaly detection, telemetry API, blockchain audit trail, and integrate into working MVP.',
    items: ['Edge gateway h/w selection (RPi / industrial IoT)', 'Cloud backend — RL inference API & digital twin sync', 'Anomaly detection models (static thresholds + LSTM/RF)', 'Real-time telemetry API (MQTT/WebSocket)', 'Blockchain audit trail (Hyperledger / Ethereum)', 'Integrate into MVP — Driver app & Dispatcher dashboard'],
    gate: 'MVP ingests live sensor data, computes trust scores, suggests reroutes',
    tools: 'MQTT (EMQX), PostgreSQL, TimescaleDB, FastAPI, React, Hyperledger',
    roles: 'Back-end dev, front-end dev, IoT/firmware eng, blockchain dev',
    risks: [
      { risk: 'RL agent fails to generalise', mitigation: 'Use domain randomisation; include adversarial disruptions' },
      { risk: 'IoT connectivity gaps', mitigation: 'Implement LoRaWAN backup and store-forward buffer' },
    ],
  },
  3: {
    title: 'Regulatory & Security',
    description: 'Pursue WHO PQS certification, align with FDA 21 CFR Part 11 / EU GDP, penetration testing.',
    items: ['Pursue WHO PQS Equipment Monitoring System certification', 'Align with FDA 21 CFR Part 11 / EU GDP requirements', 'Penetration testing + NIST 800-53 compliance'],
    gate: 'At least one regulatory clearance obtained (national MoH approval)',
    tools: 'NIST SP 800-53 checklists, FDA documentation templates, WHO PQS forms',
    roles: 'Regulatory specialist, security engineer',
    risks: [{ risk: 'Regulatory delay', mitigation: 'Apply for WHO PQS early (6+ months before launch)' }],
  },
  4: {
    title: 'Pilot Deployment',
    description: 'Install edge devices, run A/B test, collect feedback, measure real-world KPIs.',
    items: ['Install edge devices on pilot fleet (50-100 vehicles)', 'Run live A/B test: VaxSafe vs manual/legacy', 'Collect feedback (drivers, dispatchers, tech support)', 'Measure real-world KPIs (excursion reduction, MTTR)', 'Pilot review — business case & ROI calculation'],
    gate: '≥40% reduction in temperature excursions & partner endorses',
    tools: 'Grafana, Segment, physical IoT sensors (Taggle, Tive, ESP32+BME280)',
    roles: 'Field deployment eng, data analyst, pilot PM',
    risks: [{ risk: 'Low adoption by drivers', mitigation: 'Gamification + incentive programme; side-by-side usability tests' }],
  },
  5: {
    title: 'Market Ready & Scaling',
    description: 'Productise SaaS tiers, build self-serve onboarding, launch marketing, expand to new regions.',
    items: ['Productise SaaS tier (pricing models)', 'Build self-serve onboarding portal & API docs', 'Launch marketing (case study, webinars, partner network)', 'Expand to 2-3 additional pilot countries/regions', 'Achieve WHO PQS full certification (6-12 months)'],
    gate: '≥3 paying enterprise customers & WHO PQS certification initiated',
    tools: 'Stripe (billing), ReadMe (API docs), HubSpot (CRM), AWS/GCP',
    roles: 'DevOps, sales lead, customer success',
    risks: [],
  },
};

const timelines = [
  { phase: 0, months: 1.5 },
  { phase: 1, months: 2.5 },
  { phase: 2, months: 3.5 },
  { phase: 3, months: 2.5 },
  { phase: 4, months: 3.5 },
  { phase: 5, months: 4.0 },
];

export default function Roadmap() {
  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Project Roadmap</h2>
        <p>VaxSafe market-ready build flowchart — 6 phases, ~17 months to market</p>
      </div>

      {/* Timeline bar */}
      <div className="glass-card">
        <div className="card-header">
          <h3>Timeline Overview</h3>
          <span className="badge badge-primary">~17 months sequential</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {timelines.map((t, i) => {
              const phase = PHASES[t.phase];
              const widthPct = (t.months / 17.5) * 100;
              return (
                <div
                  key={i}
                  style={{
                    width: `${widthPct}%`,
                    height: 32,
                    borderRadius: 6,
                    background: `${phase.color}25`,
                    border: `1px solid ${phase.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: phase.color,
                    position: 'relative',
                  }}
                  title={`Phase ${phase.id}: ${phase.name} — ${t.months} months`}
                >
                  P{phase.id}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
            <span>Month 0</span>
            <span>Month 6</span>
            <span>Month 12</span>
            <span>Month 17+</span>
          </div>
        </div>
      </div>

      {/* Phase Cards */}
      {PHASES.map((phase, i) => {
        const details = phaseDetails[phase.id];
        const StatusIcon = phase.status === 'completed' ? CheckCircle : phase.status === 'in-progress' ? Loader2 : Circle;
        return (
          <div key={phase.id}>
            <div className="phase-card animate-in" style={{ '--phase-color': phase.color, animationDelay: `${i * 0.08}s` }}>
              <div className="phase-card-header">
                <div>
                  <div className="phase-card-number">Phase {phase.id}</div>
                  <div className="phase-card-title">{details.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge badge-${phase.status === 'completed' ? 'success' : phase.status === 'in-progress' ? 'primary' : 'neutral'}`}>
                    <StatusIcon size={10} style={phase.status === 'in-progress' ? { animation: 'spin 2s linear infinite' } : {}} />
                    {phase.status}
                  </span>
                  <span className="phase-card-weeks">Weeks {phase.weeks}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 16 }}>
                {details.description}
              </p>

              <div className="phase-card-items">
                {details.items.map((item, j) => (
                  <div key={j} className="phase-item">
                    <span className="phase-item-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Gate */}
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Target size={14} color={phase.color} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: phase.color }}>Gate {phase.id} Criterion</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{details.gate}</div>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: '0.72rem', color: '#64748b' }}>
                <div><strong style={{ color: '#94a3b8' }}>Tools:</strong> {details.tools}</div>
                <div><strong style={{ color: '#94a3b8' }}>Roles:</strong> {details.roles}</div>
              </div>

              {/* Risks */}
              {details.risks.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {details.risks.map((r, k) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', fontSize: '0.75rem' }}>
                      <AlertTriangle size={12} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <span style={{ color: '#fbbf24', fontWeight: 600 }}>{r.risk}:</span>{' '}
                        <span style={{ color: '#94a3b8' }}>{r.mitigation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gate connector */}
            {i < PHASES.length - 1 && (
              <div className="gate-connector">
                <div className="gate-badge">
                  <ChevronDown size={16} />
                  Gate {phase.id} {phase.status === 'completed' ? '✓ Passed' : 'Pending'}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Market Ready */}
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16,
        }}>
          <span style={{ fontSize: '1.8rem' }}>🚀</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0' }}>MARKET-READY PRODUCT</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Recurring revenue from ≥3 enterprise customers · Path to 100+ routes/month
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
