import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, Rewind } from 'lucide-react';

export default function HistoricalPlayback({ onTimeChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentHour, setCurrentHour] = useState(24); // 24 = live/now
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  const isLive = currentHour >= 24;

  useEffect(() => {
    if (isPlaying && !isLive) {
      intervalRef.current = setInterval(() => {
        setCurrentHour(prev => {
          const next = prev + 0.5;
          if (next >= 24) {
            setIsPlaying(false);
            onTimeChange?.(24);
            return 24;
          }
          onTimeChange?.(next);
          return next;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, isLive]);

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentHour(val);
    onTimeChange?.(val);
    if (val >= 24) setIsPlaying(false);
  };

  const goLive = () => {
    setCurrentHour(24);
    setIsPlaying(false);
    onTimeChange?.(24);
  };

  const formatTime = (h) => {
    if (h >= 24) return 'LIVE';
    const now = new Date();
    now.setHours(now.getHours() - (24 - h));
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card" style={{ padding: '12px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={14} color="#4f46e5" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Playback</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setCurrentHour(Math.max(0, currentHour - 1))}
            style={btnStyle}
            title="Back 1 hour"
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={() => {
              if (isLive) { setCurrentHour(0); setIsPlaying(true); }
              else setIsPlaying(!isPlaying);
            }}
            style={{ ...btnStyle, background: isPlaying ? '#4f46e5' : '#f1f5f9', color: isPlaying ? '#fff' : '#475569' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            onClick={() => setCurrentHour(Math.min(24, currentHour + 1))}
            style={btnStyle}
            title="Forward 1 hour"
          >
            <SkipForward size={12} />
          </button>
        </div>

        {/* Slider */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>-24h</span>
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={currentHour}
            onChange={handleSliderChange}
            style={{ flex: 1, accentColor: '#4f46e5', height: 4, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Now</span>
        </div>

        {/* Time display */}
        <div style={{
          fontSize: '0.78rem', fontWeight: 700,
          color: isLive ? '#059669' : '#4f46e5',
          background: isLive ? '#f0fdf4' : '#eef2ff',
          padding: '4px 12px', borderRadius: 20,
          minWidth: 60, textAlign: 'center',
        }}>
          {formatTime(currentHour)}
        </div>

        {/* Speed */}
        {!isLive && (
          <button
            onClick={() => setSpeed(s => s >= 4 ? 1 : s * 2)}
            style={{ ...btnStyle, fontSize: '0.68rem', fontWeight: 700, minWidth: 42 }}
          >
            {speed}x
          </button>
        )}

        {/* Go Live */}
        {!isLive && (
          <button
            onClick={goLive}
            style={{
              ...btnStyle,
              background: '#059669', color: '#fff',
              padding: '4px 12px', gap: 4,
              display: 'flex', alignItems: 'center',
            }}
          >
            <Rewind size={10} /> Live
          </button>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  width: 28, height: 28, borderRadius: 8,
  border: '1px solid #e2e8f0', background: '#f8fafc',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#475569',
  transition: 'all 0.15s ease',
  fontSize: '0.72rem',
};
