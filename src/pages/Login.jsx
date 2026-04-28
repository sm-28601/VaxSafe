import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Truck, Radio, ArrowRight, Lock } from 'lucide-react';

const roles = [
  { id: 'admin', label: 'Administrator', desc: 'Full access to all modules', icon: <Shield size={24} />, color: '#4f46e5' },
  { id: 'dispatcher', label: 'Dispatcher', desc: 'Operations, routing & fleet', icon: <Radio size={24} />, color: '#0891b2' },
  { id: 'driver', label: 'Driver', desc: 'Mobile view & delivery', icon: <Truck size={24} />, color: '#059669' },
];

export default function Login() {
  const { login } = useAuth();
  const [selected, setSelected] = useState('admin');
  const [animating, setAnimating] = useState(false);

  const handleLogin = () => {
    setAnimating(true);
    setTimeout(() => login(selected), 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fb 0%, #eef2ff 50%, #f0fdfa 100%)',
      fontFamily: 'var(--font)',
      padding: 24,
    }}>
      <div
        className={animating ? 'animate-in' : ''}
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          borderRadius: 24,
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          padding: '40px 36px',
          opacity: animating ? 0 : 1,
          transform: animating ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.5s ease',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28,
            boxShadow: '0 8px 24px rgba(79,70,229,0.2)',
          }}>
            🛡️
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            VaxSafe
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 4 }}>
            Cold Chain Intelligence Platform
          </p>
        </div>

        {/* Role selection */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            <Lock size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Select Role
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roles.map(role => (
              <div
                key={role.id}
                onClick={() => setSelected(role.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 14,
                  cursor: 'pointer',
                  border: `2px solid ${selected === role.id ? role.color : '#e2e8f0'}`,
                  background: selected === role.id ? `${role.color}06` : '#ffffff',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${role.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: role.color,
                }}>
                  {role.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{role.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{role.desc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${selected === role.id ? role.color : '#cbd5e1'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected === role.id && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: role.color }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
            color: 'white', border: 'none', borderRadius: 14,
            fontSize: '0.95rem', fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Sign In <ArrowRight size={16} />
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#cbd5e1', marginTop: 20 }}>
          Demo authentication · No real credentials required
        </p>
      </div>
    </div>
  );
}
