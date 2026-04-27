import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

export default function ReliabilityRadar({ dimensions, score, grade }) {
  const data = dimensions.map(d => ({
    subject: d.label,
    value: d.displayValue,
    fullMark: 100,
  }));

  return (
    <div className="glass-card">
      <div className="card-header">
        <h3>Reliability Score</h3>
        <div className="flex items-center gap-3">
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444',
          }}>
            {score}
          </span>
          <span className={`badge ${score >= 85 ? 'badge-success' : score >= 70 ? 'badge-warning' : 'badge-danger'}`}>
            Grade {grade}
          </span>
        </div>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 8, fill: '#64748b' }}
              axisLine={false}
            />
            <Radar
              name="Reliability"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
