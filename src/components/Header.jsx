import { useState } from 'react';
import { Search, Bell, Settings, Wifi, WifiOff, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function Header({ title, breadcrumb }) {
  const [searchValue, setSearchValue] = useState('');
  const { user, logout, ROLE_LABELS } = useAuth();
  const isOnline = useOnlineStatus();

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <div className="header-title">{title || 'Dashboard'}</div>
          {breadcrumb && <div className="header-breadcrumb">{breadcrumb}</div>}
        </div>
      </div>

      <div className="header-right">
        {/* Offline indicator */}
        {!isOnline && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 20,
            background: '#fef2f2', border: '1px solid #fecaca',
            fontSize: '0.72rem', fontWeight: 600, color: '#dc2626',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }}>
            <WifiOff size={12} />
            Offline
          </div>
        )}

        <div className="header-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search routes, vehicles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <button className="header-btn" title="Notifications">
          <Bell size={16} />
          <span className="notification-dot" />
        </button>

        <button className="header-btn" title={isOnline ? 'Connected' : 'Offline'}>
          {isOnline ? <Wifi size={16} color="#059669" /> : <WifiOff size={16} color="#dc2626" />}
        </button>

        <button className="header-btn" title="Settings">
          <Settings size={16} />
        </button>

        {user && (
          <div className="header-user" style={{ gap: 8 }}>
            <div className="header-avatar">{user.avatar}</div>
            <div style={{ lineHeight: 1.3 }}>
              <div className="header-user-name">{user.name}</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 500 }}>
                {ROLE_LABELS[user.role]}
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              style={{
                marginLeft: 4, padding: 4, borderRadius: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94a3b8', transition: 'color 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#dc2626'}
              onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
