import { UserRole, LeadStatus, LeadSource } from '../constants/enums';

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPaginationMeta;
  errors?: any[];
}
