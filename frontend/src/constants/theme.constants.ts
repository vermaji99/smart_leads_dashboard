import { LeadStatus } from '../types/lead.types';

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'blue',
  [LeadStatus.CONTACTED]: 'amber',
  [LeadStatus.QUALIFIED]: 'green',
  [LeadStatus.LOST]: 'red',
};

export const STATUS_BG_CLASSES: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [LeadStatus.CONTACTED]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  [LeadStatus.QUALIFIED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [LeadStatus.LOST]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const CHART_COLORS = ['#0ea5e9', '#f59e0b', '#22c55e', '#ef4444'];
