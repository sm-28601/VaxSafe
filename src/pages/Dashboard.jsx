import { useState, useEffect, useMemo } from 'react';
import { Thermometer, Truck, Route, AlertTriangle, Shield, Zap, Clock, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import SensorChart from '../components/SensorChart';
import ReliabilityRadar from '../components/ReliabilityRadar';
import AnomalyTimeline from '../components/AnomalyTimeline';
import PhaseProgress from '../components/PhaseProgress';
import { useSensorStream } from '../hooks/useSensorStream';
import { useReliabilityScore } from '../hooks/useReliabilityScore';
import { generateHistoricalAlerts, generateKPIs } from '../data/mockAlerts';
import { routes } from '../data/mockRoutes';
import { formatNumber, formatCurrency, formatDuration } from '../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function Dashboard() {
  const { vehicles } = useSensorStream();
  const [alerts] = useState(() => generateHistoricalAlerts(50));
  const [kpis, setKpis] = useState(() => generateKPIs());

  // Refresh KPIs periodically
  useEffect(() => {
    const t = setInterval(() => setKpis(generateKPIs()), 10000);
    return () => clearInterval(t);
  }, []);

  // Build chart data from vehicles
  const chartData = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => {
      const entry = { time: `${30 - i}m` };
      vehicles.slice(0, 5).forEach(v => {
        const noise = (Math.random() - 0.5) * 0.6;
        entry[v.name] = Math.round((v.baseTemp + noise + Math.sin(i * 0.1) * 0.3) * 10) / 10;
      });
      return entry;
    });
  }, [vehicles]);

  // Route comparison data
  const routeComparison = routes.map(r => ({
    name: r.id,
    legacy: r.distance,
    optimized: r.optimized ? Math.round(r.distance * 0.82) : r.distance,
    risk: Math.round(r.riskScore * 100),
  }));

  // Reliability for the fleet aggregate
  const fleetEntity = { reliability: parseFloat(kpis.fleetReliability), signalStrength: 85 };
  const { score, dimensions, grade } = useReliabilityScore(fleetEntity);

  return (
    <div className="dashboard-grid">
      <div className="page-header">
        <h2>Command Center</h2>
        <p>Real-time vaccine cold chain monitoring & intelligence</p>
      </div>

      {/* KPI Row */}
      <div className="stats-row">
        <StatCard
          label="Active Routes"
          value={kpis.activeRoutes}
          icon={<Route size={18} />}
          accentColor="#6366f1"
          trend="up" trendValue="+2"
          delay={1}
        />
        <StatCard
          label="Excursions Today"
          value={kpis.excursionsToday}
          icon={<Thermometer size={18} />}
          accentColor="#ef4444"
          trend="down" trendValue="-42%"
          delay={2}
        />
        <StatCard
          label="Fleet Reliability"
          value={`${(kpis.fleetReliability * 100).toFixed(0)}%`}
          icon={<Shield size={18} />}
          accentColor="#10b981"
          trend="up" trendValue="+3.1%"
          delay={3}
        />
        <StatCard
          label="Reroutes Triggered"
          value={kpis.reroutesTriggered}
          icon={<Zap size={18} />}
          accentColor="#f59e0b"
          delay={4}
        />
        <StatCard
          label="Vaccines Protected"
          value={formatNumber(kpis.vaccinesProtected)}
          icon={<Truck size={18} />}
          accentColor="#06b6d4"
          trend="up" trendValue="+12%"
          delay={5}
        />
        <StatCard
          label="Spoilage Reduction"
          value={`${kpis.spoilageReduction}%`}
          icon={<AlertTriangle size={18} />}
          accentColor="#8b5cf6"
          trend="up" trendValue="↑ target"
          delay={6}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2">
        <SensorChart
          data={chartData}
          title="Live Temperature Streams (Top 5 Vehicles)"
          height={260}
          showArea
        />
        <ReliabilityRadar dimensions={dimensions} score={score} grade={grade} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid-2">
        {/* Route efficiency comparison */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Route Distance: Legacy vs Optimized</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={routeComparison} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                  }}
                />
                <Bar dataKey="legacy" fill="#64748b" radius={[4, 4, 0, 0]} name="Legacy (km)" />
                <Bar dataKey="optimized" fill="#6366f1" radius={[4, 4, 0, 0]} name="Optimized (km)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Timeline */}
        <AnomalyTimeline alerts={alerts} maxItems={6} />
      </div>

      {/* Bottom row */}
      <div className="grid-2">
        <PhaseProgress />

        {/* Quick stats */}
        <div className="glass-card">
          <div className="card-header">
            <h3>Performance Metrics</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Avg Delivery Time', value: formatDuration(kpis.avgDeliveryTime), icon: <Clock size={16} />, color: '#06b6d4' },
                { label: 'On-Time Rate', value: `${kpis.onTimeRate}%`, icon: <Zap size={16} />, color: '#10b981' },
                { label: 'Sensor Uptime', value: `${kpis.sensorUptime}%`, icon: <Shield size={16} />, color: '#8b5cf6' },
                { label: 'Cost Savings (monthly)', value: formatCurrency(kpis.costSavings), icon: <DollarSign size={16} />, color: '#f59e0b' },
                { label: 'Weekly Excursions', value: kpis.excursionsWeek, icon: <AlertTriangle size={16} />, color: '#ef4444' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${m.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                    {m.icon}
                  </div>
                  <span style={{ flex: 1, fontSize: '0.82rem', color: '#64748b' }}>{m.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
