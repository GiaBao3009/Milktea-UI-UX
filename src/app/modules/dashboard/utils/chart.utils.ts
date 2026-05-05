import type { DashboardChartData } from '../types';
import { getCardColorScheme } from '@app/utils/mapColor.utils';

export const getChartColor = (color: string): string => {
  const colorScheme = getCardColorScheme(color);
  
  const colorMap: Record<string, string> = {
    blue: '#3B82F6',
    green: '#22C55E',
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#EAB308',
    gray: '#6B7280',
    purple: '#A855F7',
  };
  
  return colorMap[color.toLowerCase()] || colorMap.gray;
};
