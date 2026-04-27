import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import { getTempColor } from '../utils/helpers';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="value" style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1)}°C
        </div>
      ))}
    </div>
  );
}

export default function SensorChart({ data, title, height = 250, showArea = false }) {
  if (!data || data.length === 0) return null;

  // Determine which vehicles are in data
  const keys = Object.keys(data[0] || {}).filter(k => k !== 'time' && k !== 'label');
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="glass-card">
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="card-body">
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 12]}
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={2} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={8} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={5} stroke="#10b981" strokeDasharray="2 4" strokeOpacity={0.3} />
            {keys.map((key, i) =>
              showArea ? (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  name={key}
                />
              ) : (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  name={key}
                />
              )
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
