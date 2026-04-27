// Simulated IoT sensor data generators for real-time temperature streams

const vehicleNames = [
  'VX-001', 'VX-002', 'VX-003', 'VX-004', 'VX-005',
  'VX-006', 'VX-007', 'VX-008', 'VX-009', 'VX-010',
  'VX-011', 'VX-012', 'VX-013', 'VX-014', 'VX-015',
  'VX-016', 'VX-017', 'VX-018', 'VX-019', 'VX-020',
];

const routeAssignments = [
  'R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10',
  'R01', 'R02', 'R03', 'R06', 'R07', 'R08', 'R09', 'R04', 'R05', 'R10',
];

function generateBaseTemp(vehicleIndex) {
  // Most vehicles stay safe; a few drift
  const riskVehicles = [3, 10, 17, 19]; // indices of vehicles with higher risk
  if (riskVehicles.includes(vehicleIndex)) {
    return 5.5 + Math.random() * 2; // warmer baseline
  }
  return 3 + Math.random() * 2; // safe range 3-5°C
}

export function generateVehicles() {
  return vehicleNames.map((name, idx) => ({
    id: `V${String(idx + 1).padStart(3, '0')}`,
    name,
    route: routeAssignments[idx],
    driver: `Driver ${idx + 1}`,
    baseTemp: generateBaseTemp(idx),
    status: idx === 3 || idx === 19 ? 'warning' : idx === 10 ? 'critical' : 'normal',
    lastUpdate: new Date().toISOString(),
    batteryLevel: Math.floor(70 + Math.random() * 30),
    signalStrength: Math.floor(60 + Math.random() * 40),
    vaccineCount: Math.floor(200 + Math.random() * 800),
    progress: Math.floor(Math.random() * 100), // % route completion
  }));
}

// Generate a realistic temperature reading with optional drift/anomaly
export function generateTempReading(baseTemp, tick, anomalyChance = 0.03) {
  const noise = (Math.random() - 0.5) * 0.4;
  const dailyCycle = Math.sin(tick * 0.02) * 0.3; // slow ambient cycle
  const isAnomaly = Math.random() < anomalyChance;
  
  if (isAnomaly) {
    // Sudden spike or drop
    const spike = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);
    return Math.round((baseTemp + noise + dailyCycle + spike) * 10) / 10;
  }
  
  return Math.round((baseTemp + noise + dailyCycle) * 10) / 10;
}

// Generate historical temperature data (last N minutes)
export function generateTempHistory(baseTemp, points = 60) {
  const history = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    history.push({
      time: new Date(now - i * 60000).toISOString(),
      temp: generateTempReading(baseTemp, i, 0.02),
      label: `${i}m ago`,
    });
  }
  return history;
}

// Generate fleet-wide temperature snapshot
export function generateFleetSnapshot(vehicles) {
  return vehicles.map(v => ({
    ...v,
    currentTemp: generateTempReading(v.baseTemp, Date.now() / 60000),
    lastUpdate: new Date().toISOString(),
  }));
}

// Temperature thresholds
export const TEMP_THRESHOLDS = {
  min: 2,
  max: 8,
  warningLow: 2.5,
  warningHigh: 7.0,
  criticalLow: 1.0,
  criticalHigh: 9.0,
};

export function getTempStatus(temp) {
  if (temp < TEMP_THRESHOLDS.criticalLow || temp > TEMP_THRESHOLDS.criticalHigh) return 'critical';
  if (temp < TEMP_THRESHOLDS.warningLow || temp > TEMP_THRESHOLDS.warningHigh) return 'warning';
  return 'normal';
}
