import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon, trend, trendValue, accentColor, delay = 0 }) {
  const trendDir = trend === 'up' ? 'up' : 'down';
  
  return (
    <div
      className={`stat-card animate-in animate-in-delay-${delay}`}
      style={{ '--stat-accent': accentColor }}
    >
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ background: `${accentColor}15`, color: accentColor }}>
          {icon}
        </div>
        {trendValue && (
          <div className={`stat-card-trend ${trendDir}`}>
            {trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
