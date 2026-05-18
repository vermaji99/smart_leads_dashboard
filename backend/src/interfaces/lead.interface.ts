import { LeadStatus, LeadSource } from '../constants/enums';
import { Types } from 'mongoose';

export interface ILeadFilter {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  assignedTo?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
}

export interface ILeadSort {
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ILeadPagination {
  page: number;
  limit: number;
}
