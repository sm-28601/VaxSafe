// VaxSafe Design Tokens & Constants

export const COLORS = {
  // Primary palette
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // Accent
  accent: '#06b6d4',
  accentLight: '#22d3ee',
  accentDark: '#0891b2',
  
  // Status
  success: '#10b981',
  successLight: '#34d399',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  danger: '#ef4444',
  dangerLight: '#f87171',
  info: '#3b82f6',
  infoLight: '#60a5fa',
  
  // Backgrounds
  bgPrimary: '#0f0f23',
  bgSecondary: '#1a1a3e',
  bgCard: 'rgba(26, 26, 62, 0.7)',
  bgGlass: 'rgba(255, 255, 255, 0.05)',
  bgGlassHover: 'rgba(255, 255, 255, 0.08)',
  
  // Text
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  gradientAccent: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  gradientSuccess: 'linear-gradient(135deg, #10b981, #06b6d4)',
  gradientDanger: 'linear-gradient(135deg, #ef4444, #f59e0b)',
  gradientDark: 'linear-gradient(180deg, #0f0f23, #1a1a3e)',
};

export const TEMP = {
  min: 2,
  max: 8,
  warningLow: 2.5,
  warningHigh: 7.0,
  criticalLow: 1.0,
  criticalHigh: 9.0,
  unit: '°C',
  safeRange: '2–8°C',
};

export const RELIABILITY_DIMENSIONS = [
  { key: 'temperature', label: 'Temperature Control', weight: 0.25 },
  { key: 'timing', label: 'On-Time Delivery', weight: 0.20 },
  { key: 'equipment', label: 'Equipment Health', weight: 0.20 },
  { key: 'connectivity', label: 'Sensor Connectivity', weight: 0.15 },
  { key: 'compliance', label: 'Compliance Rate', weight: 0.10 },
  { key: 'response', label: 'Incident Response', weight: 0.10 },
];

export const PHASES = [
  { id: 0, name: 'Foundation', weeks: '1–6', status: 'completed', color: '#10b981' },
  { id: 1, name: 'Data & Simulation', weeks: '7–16', status: 'completed', color: '#06b6d4' },
  { id: 2, name: 'Core Engineering', weeks: '17–30', status: 'in-progress', color: '#6366f1' },
  { id: 3, name: 'Regulatory & Security', weeks: '31–40', status: 'upcoming', color: '#8b5cf6' },
  { id: 4, name: 'Pilot Deployment', weeks: '41–54', status: 'upcoming', color: '#f59e0b' },
  { id: 5, name: 'Market Ready', weeks: '55–70+', status: 'upcoming', color: '#ef4444' },
];

export const REFRESH_INTERVAL = 3000; // ms between sensor updates
