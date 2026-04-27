import { useMemo } from 'react';
import { RELIABILITY_DIMENSIONS } from '../utils/constants';

// Compute multi-dimensional reliability score for a node or vehicle
export function useReliabilityScore(entity) {
  return useMemo(() => {
    if (!entity) return { score: 0, dimensions: [], grade: 'F' };

    // Simulate dimension scores based on entity properties
    const baseReliability = entity.reliability || 0.85;
    
    const dimensions = RELIABILITY_DIMENSIONS.map(dim => {
      let value;
      switch (dim.key) {
        case 'temperature':
          value = baseReliability * (0.9 + Math.random() * 0.1);
          break;
        case 'timing':
          value = baseReliability * (0.85 + Math.random() * 0.15);
          break;
        case 'equipment':
          value = baseReliability * (0.88 + Math.random() * 0.12);
          break;
        case 'connectivity':
          value = (entity.signalStrength || 80) / 100;
          break;
        case 'compliance':
          value = baseReliability * (0.92 + Math.random() * 0.08);
          break;
        case 'response':
          value = baseReliability * (0.8 + Math.random() * 0.2);
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
  }, [entity]);
}
