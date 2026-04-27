// Historical anomaly events and alert generators

const alertTypes = [
  { type: 'temp_excursion', label: 'Temperature Excursion', severity: 'critical', icon: '🌡️' },
  { type: 'temp_warning', label: 'Temperature Warning', severity: 'warning', icon: '⚠️' },
  { type: 'route_deviation', label: 'Route Deviation', severity: 'warning', icon: '🗺️' },
  { type: 'sensor_offline', label: 'Sensor Offline', severity: 'critical', icon: '📡' },
  { type: 'battery_low', label: 'Low Battery', severity: 'info', icon: '🔋' },
  { type: 'door_open', label: 'Door Open Alert', severity: 'warning', icon: '🚪' },
  { type: 'reroute_triggered', label: 'Reroute Triggered', severity: 'info', icon: '🔄' },
  { type: 'delivery_delayed', label: 'Delivery Delayed', severity: 'warning', icon: '⏰' },
  { type: 'equipment_failure', label: 'Equipment Failure', severity: 'critical', icon: '🔧' },
  { type: 'spoilage_risk', label: 'Spoilage Risk Detected', severity: 'critical', icon: '💉' },
];

const vehicles = Array.from({ length: 20 }, (_, i) => `VX-${String(i + 1).padStart(3, '0')}`);
const locations = [
  'Nairobi Central', 'Mombasa Coastal Road', 'Kisumu Bypass', 'Eldoret Highway',
  'Garissa Desert Route', 'Nakuru Transit Hub', 'Thika Road', 'Malindi Coastal',
  'Lamu Ferry Point', 'Wajir Remote Stretch', 'Nyeri Mountain Road', 'Embu Junction',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateHistoricalAlerts(count = 100) {
  const alerts = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const alertDef = randomFrom(alertTypes);
    const hoursAgo = Math.random() * 168; // last 7 days
    const timestamp = new Date(now - hoursAgo * 3600000);
    
    alerts.push({
      id: `ALT-${String(i + 1).padStart(4, '0')}`,
      ...alertDef,
      vehicle: randomFrom(vehicles),
      location: randomFrom(locations),
      timestamp: timestamp.toISOString(),
      resolved: Math.random() > 0.25,
      resolvedAt: Math.random() > 0.25 ? new Date(timestamp.getTime() + Math.random() * 3600000).toISOString() : null,
      tempReading: alertDef.type.includes('temp') ? (2 + Math.random() * 8).toFixed(1) : null,
      details: getAlertDetails(alertDef.type),
      detectionMethod: randomFrom(['Static Threshold', 'ML Prediction', 'Pattern Recognition', 'Manual Report']),
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getAlertDetails(type) {
  const details = {
    temp_excursion: 'Temperature exceeded safe range (2-8°C). Immediate action required to prevent vaccine spoilage.',
    temp_warning: 'Temperature approaching critical threshold. Monitor closely and consider rerouting.',
    route_deviation: 'Vehicle deviated from planned route. GPS tracking shows unexpected detour.',
    sensor_offline: 'IoT sensor stopped transmitting data. Last known reading within normal range.',
    battery_low: 'Sensor battery below 15%. Schedule replacement at next transit point.',
    door_open: 'Cold storage door opened for extended period (>5 min). Temperature may be affected.',
    reroute_triggered: 'RL agent triggered automatic reroute due to predicted temperature excursion on original path.',
    delivery_delayed: 'Estimated delivery time exceeded by >30 minutes. Downstream facilities notified.',
    equipment_failure: 'Refrigeration unit malfunction detected. Backup cooling activated.',
    spoilage_risk: 'ML model predicts >60% probability of vaccine spoilage if current conditions persist.',
  };
  return details[type] || 'Alert triggered by monitoring system.';
}

export function generateLiveAlert() {
  const alertDef = randomFrom(alertTypes);
  return {
    id: `ALT-LIVE-${Date.now()}`,
    ...alertDef,
    vehicle: randomFrom(vehicles),
    location: randomFrom(locations),
    timestamp: new Date().toISOString(),
    resolved: false,
    resolvedAt: null,
    tempReading: alertDef.type.includes('temp') ? (2 + Math.random() * 8).toFixed(1) : null,
    details: getAlertDetails(alertDef.type),
    detectionMethod: randomFrom(['Static Threshold', 'ML Prediction', 'Pattern Recognition']),
  };
}

// KPI Metrics for dashboard
export function generateKPIs() {
  return {
    activeRoutes: 10,
    activeVehicles: 18,
    excursionsToday: Math.floor(Math.random() * 3) + 1,
    excursionsWeek: Math.floor(Math.random() * 12) + 5,
    vaccinesProtected: 62400,
    fleetReliability: (0.88 + Math.random() * 0.08).toFixed(2),
    reroutesTriggered: Math.floor(Math.random() * 5) + 2,
    avgDeliveryTime: Math.floor(300 + Math.random() * 60),
    spoilageReduction: (42 + Math.random() * 8).toFixed(1),
    costSavings: Math.floor(12000 + Math.random() * 5000),
    onTimeRate: (91 + Math.random() * 6).toFixed(1),
    sensorUptime: (97.2 + Math.random() * 2).toFixed(1),
  };
}

// Severity color mapping
export const severityColors = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};
