import { useMemo } from 'react';
import { RELIABILITY_DIMENSIONS } from '../utils/constants';

// Compute multi-dimensional reliability score for a node or vehicle
export function useReliabilityScore(entity) {
  return useMemo(() => {
    if (!entity) return { score: 0, dimensions: [], grade: 'F' };

    // Real logic based on entity state
    const baseReliability = entity.reliability || 0.85;
    const temp = entity.currentTemp !== undefined ? entity.currentTemp : 5.0;
    const isCritical = entity.status === 'critical';
    const isWarning = entity.status === 'warning';
    
    // Temp penalty: max 1.0 at 5.0C. Drops off towards 2C and 8C
    const tempDeviation = Math.abs(temp - 5.0);
    const tempScore = Math.max(0, 1 - (tempDeviation / 5));

    const dimensions = RELIABILITY_DIMENSIONS.map(dim => {
      let value;
      switch (dim.key) {
        case 'temperature':
          value = entity.currentTemp !== undefined ? tempScore : baseReliability;
          break;
        case 'timing':
          value = isCritical ? 0.6 : isWarning ? 0.8 : baseReliability * 0.95;
          break;
        case 'equipment':
          value = (entity.batteryLevel || 85) / 100;
          break;
        case 'connectivity':
          value = (entity.signalStrength || 85) / 100;
          break;
        case 'compliance':
          value = isCritical ? 0.5 : isWarning ? 0.75 : baseReliability * 0.98;
          break;
        case 'response':
          value = isCritical ? 0.7 : baseReliability;
          break;
        default:
          value = baseReliability;
      }
      return {
        ...dim,
        value: Math.min(1, Math.max(0, value)),
        displayValue: Math.round(Math.min(1, Math.max(0, value)) * 100),
      };
    });

    const weightedScore = dimensions.reduce((sum, d) => sum + d.value * d.weight, 0);
    const score = Math.round(weightedScore * 100);
    
    let grade;
    if (score >= 95) grade = 'A+';
    else if (score >= 90) grade = 'A';
    else if (score >= 85) grade = 'B+';
    else if (score >= 80) grade = 'B';
    else if (score >= 75) grade = 'C+';
    else if (score >= 70) grade = 'C';
    else grade = 'D';

    return { score, dimensions, grade };
  }, [entity, entity?.currentTemp, entity?.status, entity?.batteryLevel, entity?.signalStrength]);
}
