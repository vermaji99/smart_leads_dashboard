import leadRepository from '../repositories/lead.repository';
import { ILeadFilter, ILeadSort, ILeadPagination } from '../interfaces/lead.interface';
import { IUser } from '../models/User';
import { UserRole, LeadStatus } from '../constants/enums';
import ApiError from '../utils/ApiError';
import { Parser } from 'json2csv';

class LeadService {
  async getAllLeads(filter: ILeadFilter, sort: ILeadSort, pagination: ILeadPagination, user: IUser) {
    return leadRepository.findAll(filter, sort, pagination, user);
  }

  async getLeadById(id: string, user: IUser) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    // RBAC check
    if (user.role === UserRole.SALES) {
      const isAssigned = lead.assignedTo?._id?.toString() === user._id.toString();
      const isCreator = lead.createdBy?._id?.toString() === user._id.toString();
      if (!isAssigned && isCreator) {
        throw new ApiError(403, 'You do not have permission to view this lead');
      }
    }

    return lead;
  }

  async createLead(data: any, user: IUser) {
    const leadData = {
      ...data,
      createdBy: user._id,
      assignedTo: data.assignedTo || user._id,
    };
    return leadRepository.create(leadData);
  }

  async updateLead(id: string, data: any, user: IUser) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    // RBAC: Sales users can only update leads assigned to them or created by them
    if (user.role === UserRole.SALES) {
      const isAssigned = lead.assignedTo?._id?.toString() === user._id.toString();
      const isCreator = lead.createdBy?._id?.toString() === user._id.toString();
      if (!isAssigned && !isCreator) {
        throw new ApiError(403, 'You do not have permission to update this lead');
      }

      // RBAC: Sales user cannot mark lead as Lost
      if (data.status === LeadStatus.LOST && lead.status !== LeadStatus.LOST) {
        throw new ApiError(403, 'Only administrators can mark a lead as Lost');
      }
    }

    return leadRepository.update(id, data);
  }

  async deleteLead(id: string, user: IUser) {
    // Only Admin can delete
    if (user.role !== UserRole.ADMIN) {
      throw new ApiError(403, 'Only administrators can delete leads');
    }

    const lead = await leadRepository.findById(id);
    if (!lead) throw new ApiError(404, 'Lead not found');

    return leadRepository.delete(id);
  }

  async exportLeads(filter: ILeadFilter, user: IUser) {
    const { leads } = await leadRepository.findAll(filter, { sortBy: 'createdAt', order: 'desc' }, { page: 1, limit: 10000 }, user);
    
    const fields = ['name', 'email', 'phone', 'company', 'status', 'source', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    return parser.parse(leads);
  }
}

export default new LeadService();
