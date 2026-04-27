import { useState } from 'react';
import { Search, Bell, Settings, Wifi } from 'lucide-react';

export default function Header({ title, breadcrumb }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <div className="header-title">{title || 'Dashboard'}</div>
          {breadcrumb && <div className="header-breadcrumb">{breadcrumb}</div>}
        </div>
      </div>

      <div className="header-right">
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

        <button className="header-btn" title="Connection">
          <Wifi size={16} />
        </button>

        <button className="header-btn" title="Settings">
          <Settings size={16} />
        </button>

        <div className="header-user">
          <div className="header-avatar">OP</div>
          <span className="header-user-name">Operator</span>
        </div>
      </div>
    </header>
  );
}
