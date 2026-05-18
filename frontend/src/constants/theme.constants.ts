import { LeadStatus } from '../types/leads.types';

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: '#3B82F6', // Blue-500
  [LeadStatus.CONTACTED]: '#F59E0B', // Amber-500
  [LeadStatus.QUALIFIED]: '#10B981', // Emerald-500
  [LeadStatus.LOST]: '#EF4444', // Red-500
};

export const THEME_COLORS = {
  light: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  dark: {
    background: '#0B1120',
    surface: '#111827',
    card: '#1F2937',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
  }
} as const;

export const STATUS_BG_CLASSES: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  [LeadStatus.CONTACTED]: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  [LeadStatus.QUALIFIED]: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  [LeadStatus.LOST]: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

export const CHART_CONFIG = {
  light: {
    text: '#64748B',
    grid: '#E2E8F0',
    tooltip: {
      bg: '#FFFFFF',
      border: '#E2E8F0',
      text: '#1E293B'
    }
  },
  dark: {
    text: '#94A3B8',
    grid: '#334155',
    tooltip: {
      bg: '#1F2937',
      border: '#374151',
      text: '#F9FAFB'
    }
  }
} as const;
