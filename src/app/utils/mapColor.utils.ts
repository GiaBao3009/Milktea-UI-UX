/**
 * Centralized status color management utility
 * This ensures consistent color mapping across the entire application
 */

export type BadgeColor = 'red' | 'gray' | 'blue' | 'green' | 'orange' | 'purple' | 'yellow';

export interface ColorPreset {
  label: string;
  hex: string;
  badgeColor: BadgeColor;
  bgClass: string;
  textClass: string;
}

export interface PrioPreset {
  label: string;
  hex: string;
  badgeColor: BadgeColor;
  bgClass: string;
  textClass: string;
}

// Single source of truth for all color configurations
export const PRIORITY_PRESETS: PrioPreset[] = [
  {
    label: "blue",
    hex: "#3b82f6",
    badgeColor: "blue",
    bgClass: "!bg-blue-100",
    textClass: "!text-blue-700"
  },
  {
    label: "green",
    hex: "#22c55e",
    badgeColor: "green",
    bgClass: "!bg-green-100",
    textClass: "!text-green-700"
  },
  {
    label: "orange",
    hex: "#f97316",
    badgeColor: "orange",
    bgClass: "!bg-orange-100",
    textClass: "!text-orange-700"
  },
  {
    label: "red",
    hex: "#ef4444",
    badgeColor: "red",
    bgClass: "!bg-red-100",
    textClass: "!text-red-700"
  },
  {
    label: "gray",
    hex: "#6b7280",
    badgeColor: "gray",
    bgClass: "!bg-gray-100",
    textClass: "!text-gray-700"
  },
];

// Single source of truth for all color configurations
export const COLOR_PRESETS: ColorPreset[] = [
  {
    label: "blue",
    hex: "#3b82f6",
    badgeColor: "blue",
    bgClass: "!bg-blue-500",
    textClass: "!text-blue-950"
  },
  {
    label: "green",
    hex: "#22c55e",
    badgeColor: "green",
    bgClass: "!bg-green-500",
    textClass: "!text-green-950"
  },
  {
    label: "orange",
    hex: "#f97316",
    badgeColor: "orange",
    bgClass: "!bg-orange-500",
    textClass: "!text-orange-950"
  },
  {
    label: "red",
    hex: "#ef4444",
    badgeColor: "red",
    bgClass: "!bg-red-500",
    textClass: "!text-red-950"
  },
  {
    label: "gray",
    hex: "#6b7280",
    badgeColor: "gray",
    bgClass: "!bg-gray-500",
    textClass: "!text-gray-950"
  },
];

/**
 * Convert color label to hex color
 * @param label - Color label from API (e.g., "blue", "red")
 * @returns Hex color code (e.g., "#DBEAFE")
 */
export const labelToHex = (label: string): string => {
  const preset = COLOR_PRESETS.find(p => p.label.toLowerCase() === label.toLowerCase());
  return preset?.hex || '#F3F4F6'; // Default to gray
};

/**
 * Convert color label to Badge component color prop
 * @param label - Color label from API (e.g., "blue", "red")
 * @returns Badge color type
 */
export const labelToBadgeColor = (label: string): BadgeColor => {
  const preset = COLOR_PRESETS.find(p => p.label.toLowerCase() === label.toLowerCase());
  return preset?.badgeColor || 'gray'; // Default to gray
};

/**
 * Get Tailwind CSS classes for a color label
 * @param label - Color label from API
 * @returns Combined bg and text classes
 */
export const labelToTailwindClasses = (label: string): string => {
  if (!label) return "bg-gray-100 text-gray-800";
  const preset = COLOR_PRESETS.find(p => p.label.toLowerCase() === label.toLowerCase());
  return preset ? `${preset.bgClass} ${preset.textClass}` : "bg-gray-100 text-gray-800";
};

/**
 * Get Tailwind CSS classes for status badge (same as preview button)
 * @param label - Color label from API (e.g., "blue", "green")
 * @returns Combined bg and text classes matching configuration
 */
export const getStatusBadgeClasses = (label: string): string => {
  const preset = COLOR_PRESETS.find(p => p.label.toLowerCase() === label.toLowerCase());
  return preset ? `${preset.bgClass} ${preset.textClass}` : "bg-gray-500 text-gray-950";
};

/**
 * Convert hex color to Badge color (for backward compatibility)
 * @param hexColor - Hex color code
 * @returns Badge color type
 */
export const hexToBadgeColor = (hexColor: string): BadgeColor => {
  const hex = hexColor.toLowerCase();
  if (hex.includes('dbeafe') || hex.includes('#3b82f6')) return 'blue';
  if (hex.includes('dcfce7') || hex.includes('#22c55e')) return 'green';
  if (hex.includes('ffedd5') || hex.includes('#f97316')) return 'orange';
  if (hex.includes('fee2e2') || hex.includes('#ef4444')) return 'red';
  return 'gray';
};

/**
 * Card color scheme interface for dashboard cards
 */
export interface CardColorScheme {
  bg: string;
  text: string;
  iconBg: string;
}

/**
 * Dashboard card color schemes with dark mode support
 */
export const CARD_COLOR_SCHEMES: Record<string, CardColorScheme> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    text: 'text-blue-700 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/10',
    text: 'text-green-700 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/10',
    text: 'text-red-700 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    text: 'text-orange-700 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-900/10',
    text: 'text-gray-700 dark:text-gray-400',
    iconBg: 'bg-gray-100 dark:bg-gray-900/30',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    text: 'text-purple-700 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/10',
    text: 'text-yellow-700 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
};

/**
 * Get card color scheme by color label
 * @param color - Color label (e.g., 'blue', 'red')
 * @returns Card color scheme object
 */
export const getCardColorScheme = (color: string): CardColorScheme => {
  return CARD_COLOR_SCHEMES[color?.toLowerCase()] || CARD_COLOR_SCHEMES.gray;
};

