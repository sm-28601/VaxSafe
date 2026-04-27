import { timeAgo } from '../utils/helpers';

export default function AnomalyTimeline({ alerts, maxItems = 8 }) {
  const items = alerts.slice(0, maxItems);

  const severityStyle = {
    critical: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171' },
    warning: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
    info: { bg: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' },
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h3>Recent Alerts</h3>
        <span className="badge badge-danger">{alerts.filter(a => !a.resolved).length} active</span>
      </div>
      <div className="card-body" style={{ padding: '8px 20px' }}>
        <div className="timeline">
          {items.map((alert, i) => {
            const style = severityStyle[alert.severity] || severityStyle.info;
            return (
              <div key={alert.id} className="timeline-item">
                <div
                  className="timeline-icon"
                  style={{ background: style.bg, color: style.color }}
                >
                  {alert.icon}
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{alert.label}</div>
                  <div className="timeline-desc">
                    {alert.vehicle} · {alert.location}
                    {alert.tempReading && ` · ${alert.tempReading}°C`}
                  </div>
                </div>
                <div className="timeline-time">
                  {timeAgo(alert.timestamp)}
                  {alert.resolved && (
                    <div style={{ color: '#10b981', fontSize: '0.6rem', marginTop: 2 }}>
                      ✓ Resolved
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
