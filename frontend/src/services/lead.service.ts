import api from '../services/api';
import type { ILead } from '../types/leads.types';
import type { IApiResponse } from '../types/api.types';

export interface ILeadParams {
  search?: string;
  status?: string;
  source?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  export?: string;
}

export const leadService = {
  getLeads: async (params: ILeadParams): Promise<IApiResponse<ILead[]>> => {
    const { data } = await api.get('/leads', { params });
    return data;
  },

  getLeadById: async (id: string): Promise<IApiResponse<ILead>> => {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },

  createLead: async (leadData: Partial<ILead>): Promise<IApiResponse<ILead>> => {
    const { data } = await api.post('/leads', leadData);
    return data;
  },

  updateLead: async (id: string, leadData: Partial<ILead>): Promise<IApiResponse<ILead>> => {
    const { data } = await api.put(`/leads/${id}`, leadData);
    return data;
  },

  deleteLead: async (id: string): Promise<IApiResponse<void>> => {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },

  exportLeads: async (params: Partial<ILeadParams>): Promise<Blob> => {
    const { data } = await api.get('/leads', {
      params: { ...params, export: 'true' },
      responseType: 'blob',
    });
    return data;
  },
};
