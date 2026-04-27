import { getTempColor } from '../utils/helpers';

export default function TempGauge({ temp, label, size = 140 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  // Map temp 0–12 to 0–100%
  const pct = Math.min(1, Math.max(0, temp / 12));
  const offset = circumference * (1 - pct);
  const color = getTempColor(temp);

  return (
    <div className="temp-gauge" style={{ width: size, height: size }}>
      <svg
        className="temp-gauge-ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="temp-gauge-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="temp-gauge-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="temp-gauge-center">
        <div className="temp-gauge-value" style={{ color }}>{temp.toFixed(1)}°C</div>
        <div className="temp-gauge-label">{label || 'Temperature'}</div>
      </div>
    </div>
  );
}
