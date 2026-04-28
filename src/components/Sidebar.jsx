import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Route, Truck, AlertTriangle,
  Shield, Smartphone, Map
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/digital-twin', icon: Activity, label: 'Digital Twin' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/routes', icon: Route, label: 'Route Optimizer' },
      { to: '/fleet', icon: Truck, label: 'Fleet Monitor' },
      { to: '/anomalies', icon: AlertTriangle, label: 'Anomaly Detection', badge: 3 },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { to: '/audit', icon: Shield, label: 'Audit Trail' },
    ],
  },
  {
    label: 'Mobile',
    items: [
      { to: '/driver', icon: Smartphone, label: 'Driver App' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { to: '/roadmap', icon: Map, label: 'Roadmap' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { canAccess } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🛡️</div>
        <div className="sidebar-brand-text">
          <h1>VaxSafe</h1>
          <span>Cold Chain Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map(group => {
          const accessibleItems = group.items.filter(item => canAccess(item.to));
          if (accessibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <div className="sidebar-section-label">{group.label}</div>
              {accessibleItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="sidebar-link-icon" size={18} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-badge">{item.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot" />
          <span>20 sensors online</span>
        </div>
      </div>
    </aside>
  );
}
