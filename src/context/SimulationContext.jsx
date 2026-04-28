import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { findOptimalRoute } from '../utils/graphRouter';
import { generateVehicles, generateTempReading, TEMP_THRESHOLDS } from '../data/mockSensors';
import { routes as initialRoutes } from '../data/mockRoutes';
import { nodes as initialNodes } from '../data/mockNodes';
import { generateHistoricalAlerts, generateKPIs } from '../data/mockAlerts';
import { REFRESH_INTERVAL } from '../utils/constants';

const SimulationContext = createContext();

export function useSimulation() {
  return useContext(SimulationContext);
}

export function SimulationProvider({ children }) {
  const [vehicles, setVehicles] = useState(() => generateVehicles());
  const [routes, setRoutes] = useState(initialRoutes);
  const [nodes, setNodes] = useState(initialNodes);
  const [alerts, setAlerts] = useState(() => generateHistoricalAlerts(30));
  const [kpis, setKpis] = useState(() => generateKPIs());
  const [history, setHistory] = useState({});
  const [auditEvents, setAuditEvents] = useState([]);
  const tickRef = useRef(0);
  
  const latestRoutes = useRef(routes);
  const latestNodes = useRef(nodes);

  useEffect(() => {
    latestRoutes.current = routes;
    latestNodes.current = nodes;
  }, [routes, nodes]);

  // Expose a way to force a reroute manually
  const overrideRoute = (routeId) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        return { ...r, optimized: true, status: 'active', riskScore: r.riskScore * 0.5 };
      }
      return r;
    }));
    // Resolve any alerts related to this route's vehicles
    setAlerts(prev => prev.map(a => {
      const vehicle = vehicles.find(v => v.name === a.vehicle);
      if (vehicle && vehicle.route === routeId && !a.resolved) {
        return { ...a, resolved: true, resolvedAt: new Date().toISOString() };
      }
      return a;
    }));
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a
    ));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      tickRef.current += 1;
      const now = new Date().toISOString();
      
      setVehicles(prevVehicles => {
        let newAlerts = [];
        let newAuditEvents = [];
        let modifiedRoutes = new Set();
        let reroutedVehicles = [];
        
        const updatedVehicles = prevVehicles.map(v => {
          const newTemp = generateTempReading(v.baseTemp, tickRef.current);
          const isCritical = newTemp > TEMP_THRESHOLDS.criticalHigh || newTemp < TEMP_THRESHOLDS.criticalLow;
          const isWarning = newTemp > TEMP_THRESHOLDS.warningHigh || newTemp < TEMP_THRESHOLDS.warningLow;
          
          let newStatus = 'normal';
          if (isCritical) newStatus = 'critical';
          else if (isWarning) newStatus = 'warning';

          // Alert Generation Logic
          if (isCritical || isWarning) {
            // Check if there is already an active alert for this vehicle
            setAlerts(currentAlerts => {
              const hasActiveAlert = currentAlerts.some(a => a.vehicle === v.name && !a.resolved && a.type.includes('temp'));
              if (!hasActiveAlert) {
                const type = isCritical ? 'temp_excursion' : 'temp_warning';
                const newAlert = {
                  id: `ALT-LIVE-${Date.now()}-${v.id}`,
                  type,
                  label: isCritical ? 'Temperature Excursion' : 'Temperature Warning',
                  severity: isCritical ? 'critical' : 'warning',
                  icon: isCritical ? '🌡️' : '⚠️',
                  vehicle: v.name,
                  location: `Route ${v.route}`,
                  timestamp: now,
                  resolved: false,
                  resolvedAt: null,
                  tempReading: newTemp.toFixed(1),
                  details: isCritical 
                    ? `Temperature (${newTemp.toFixed(1)}°C) exceeded safe range. Immediate action required.` 
                    : `Temperature (${newTemp.toFixed(1)}°C) approaching critical threshold.`,
                  detectionMethod: 'Real-time Stream',
                };
                newAlerts.push(newAlert);
                
                newAuditEvents.push({
                  action: isCritical ? 'Critical Excursion Flagged' : 'Temperature Warning',
                  vehicle: v.name,
                  data: { temp: newTemp.toFixed(1), location: v.route }
                });
                
                if (isCritical) {
                  modifiedRoutes.add({ id: v.route, status: 'critical' });
                  
                  // Auto-reroute logic
                  const currentRoute = latestRoutes.current.find(r => r.id === v.route);
                  if (currentRoute && currentRoute.nodes && currentRoute.nodes.length > 0) {
                    const startNode = currentRoute.nodes[0];
                    const endNode = currentRoute.nodes[currentRoute.nodes.length - 1];
                    const newPath = findOptimalRoute(startNode, endNode, latestNodes.current, latestRoutes.current);
                    
                    if (newPath.length > 0) {
                      newAuditEvents.push({
                        action: 'Auto-Reroute Triggered',
                        vehicle: v.name,
                        data: { oldRoute: v.route, newPath: newPath.join(' -> ') }
                      });
                      
                      // Resolve alert automatically due to auto-reroute
                      newAlert.resolved = true;
                      newAlert.resolvedAt = now;
                    }
                  }
                } else if (isWarning) {
                  modifiedRoutes.add({ id: v.route, status: 'at-risk' });
                }
              }
              return currentAlerts;
            });
          }

          return {
            ...v,
            currentTemp: newTemp,
            status: newStatus,
            lastUpdate: now,
            progress: Math.min(100, v.progress + 0.1), // slower progress
          };
        });

        // Apply new alerts
        if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev]);
          // Update KPIs
          setKpis(prev => ({
            ...prev,
            excursionsToday: prev.excursionsToday + newAlerts.filter(a => a.severity === 'critical').length
          }));
        }

        if (newAuditEvents.length > 0) {
          setAuditEvents(prev => [...prev, ...newAuditEvents]);
        }

        // Update Routes
        if (modifiedRoutes.size > 0) {
          setRoutes(prev => {
            const newRoutes = [...prev];
            modifiedRoutes.forEach(mod => {
              const rIndex = newRoutes.findIndex(r => r.id === mod.id);
              if (rIndex !== -1 && newRoutes[rIndex].status !== 'critical') {
                 // only upgrade severity, don't downgrade a critical to at-risk automatically here
                 if (mod.status === 'critical' || newRoutes[rIndex].status === 'active') {
                   newRoutes[rIndex] = { ...newRoutes[rIndex], status: mod.status };
                 }
              }
            });
            return newRoutes;
          });
        }

        return updatedVehicles;
      });
      
      // Update history
      setHistory(prev => {
        const next = { ...prev };
        setVehicles(currentVehicles => {
           currentVehicles.forEach(v => {
            const existing = next[v.id] || [];
            const newReading = { time: now, temp: v.currentTemp };
            next[v.id] = [...existing.slice(-29), newReading]; // keep last 30
          });
          return currentVehicles;
        });
        return next;
      });

      // Update nodes reliability
      setNodes(prevNodes => prevNodes.map(n => {
        const drift = (Math.random() - 0.5) * 0.15;
        const newTemp = Math.max(n.tempRange[0] - 0.5, Math.min(n.tempRange[1] + 1.5, n.currentTemp + drift));
        const isCritical = newTemp > TEMP_THRESHOLDS.criticalHigh || newTemp < TEMP_THRESHOLDS.criticalLow;
        const isWarning = newTemp > TEMP_THRESHOLDS.warningHigh || newTemp < TEMP_THRESHOLDS.warningLow;
        
        let newStatus = 'operational';
        if (isCritical) newStatus = 'critical';
        else if (isWarning) newStatus = 'warning';
        
        let newReliability = n.reliability;
        if (isCritical) newReliability = Math.max(0.1, n.reliability - 0.02);
        else if (newStatus === 'operational') newReliability = Math.min(0.99, n.reliability + 0.01);
        
        return { 
          ...n, 
          currentTemp: Number(newTemp.toFixed(1)), 
          status: newStatus, 
          reliability: Number(newReliability.toFixed(2)) 
        };
      }));

    }, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const value = {
    vehicles,
    routes,
    nodes,
    alerts,
    kpis,
    history,
    auditEvents,
    overrideRoute,
    resolveAlert
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
