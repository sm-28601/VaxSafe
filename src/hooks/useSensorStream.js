import { useState, useEffect, useRef } from 'react';
import { generateVehicles, generateTempReading, generateFleetSnapshot } from '../data/mockSensors';
import { REFRESH_INTERVAL } from '../utils/constants';

// Hook that provides real-time simulated sensor data streams
export function useSensorStream(interval = REFRESH_INTERVAL) {
  const [vehicles, setVehicles] = useState(() => generateVehicles());
  const [history, setHistory] = useState({});
  const tickRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      tickRef.current += 1;
      
      setVehicles(prev => {
        const updated = prev.map(v => ({
          ...v,
          currentTemp: generateTempReading(v.baseTemp, tickRef.current),
          lastUpdate: new Date().toISOString(),
          progress: Math.min(100, v.progress + Math.random() * 0.5),
        }));
        return updated;
      });
      
      setHistory(prev => {
        const next = { ...prev };
        vehicles.forEach(v => {
          const existing = next[v.id] || [];
          const newReading = {
            time: new Date().toISOString(),
            temp: generateTempReading(v.baseTemp, tickRef.current),
          };
          next[v.id] = [...existing.slice(-59), newReading]; // keep last 60
        });
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { vehicles, history };
}
