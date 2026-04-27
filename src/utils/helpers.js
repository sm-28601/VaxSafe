// Utility helpers for formatting, calculations, and data transforms

export function formatTemp(temp) {
  return `${temp.toFixed(1)}°C`;
}

export function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function getTempColor(temp) {
  if (temp < 1.0 || temp > 9.0) return '#ef4444'; // critical
  if (temp < 2.5 || temp > 7.0) return '#f59e0b'; // warning
  return '#10b981'; // safe
}

export function getTempStatus(temp) {
  if (temp < 1.0 || temp > 9.0) return 'critical';
  if (temp < 2.5 || temp > 7.0) return 'warning';
  return 'normal';
}

export function getStatusColor(status) {
  const map = {
    normal: '#10b981',
    operational: '#10b981',
    active: '#10b981',
    completed: '#10b981',
    warning: '#f59e0b',
    'at-risk': '#f59e0b',
    'in-progress': '#6366f1',
    critical: '#ef4444',
    upcoming: '#64748b',
    offline: '#64748b',
  };
  return map[status] || '#94a3b8';
}

export function calculateReliabilityScore(dimensions) {
  const weights = [0.25, 0.20, 0.20, 0.15, 0.10, 0.10];
  return dimensions.reduce((sum, val, i) => sum + val * weights[i], 0);
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
