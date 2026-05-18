export const LeadStatus = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  LOST: 'Lost',
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadSource = {
  WEBSITE: 'Website',
  INSTAGRAM: 'Instagram',
  REFERRAL: 'Referral',
} as const;

export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export type ILead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type IAnalyticsStats = {
  totalLeads: number;
  conversionRate: number;
  statusStats: Array<{ _id: string; count: number }>;
  sourceStats: Array<{ _id: string; count: number }>;
  monthlyGrowth: Array<{ _id: { month: number; year: number }; count: number }>;
}
