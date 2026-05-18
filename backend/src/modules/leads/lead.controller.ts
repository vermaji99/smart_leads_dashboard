import { Response } from 'express';
import leadService from '../../services/lead.service';
import { AuthRequest } from '../../interfaces/auth.interface';
import asyncHandler from '../../utils/asyncHandler';
import ApiResponse from '../../utils/ApiResponse';
import { LeadStatus, LeadSource } from '../../constants/enums';

import { IUser } from '../../models/User';

class LeadController {
  getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user as IUser;
    const { 
      status, 
      source, 
      search, 
      sortBy, 
      order, 
      page = 1, 
      limit = 10, 
      export: isExport,
      assignedTo,
      startDate,
      endDate 
    } = req.query as any;

    const filter = {
      status: status as LeadStatus,
      source: source as LeadSource,
      search: typeof search === 'string' ? search : '',
      assignedTo: typeof assignedTo === 'string' ? assignedTo : '',
      startDate: typeof startDate === 'string' ? startDate : '',
      endDate: typeof endDate === 'string' ? endDate : ''
    };

    const sort = {
      sortBy: typeof sortBy === 'string' ? sortBy : 'createdAt',
      order: (order as 'asc' | 'desc') || 'desc'
    };

    const pagination = {
      page: parseInt(typeof page === 'string' ? page : '1'),
      limit: parseInt(typeof limit === 'string' ? limit : '10')
    };

    if (isExport === 'true') {
      const csv = await leadService.exportLeads(filter, user);
      res.header('Content-Type', 'text/csv');
      res.attachment('leads.csv');
      return res.send(csv);
    }

    const { leads, total } = await leadService.getAllLeads(filter, sort, pagination, user);

    return res.status(200).json(
      new ApiResponse(
        200,
        leads,
        'Leads fetched successfully',
        {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit),
          hasNextPage: pagination.page < Math.ceil(total / pagination.limit),
          hasPrevPage: pagination.page > 1,
        }
      )
    );
  });

  getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lead = await leadService.getLeadById(req.params.id, req.user as IUser);
    return res.status(200).json(new ApiResponse(200, lead, 'Lead fetched successfully'));
  });

  createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lead = await leadService.createLead(req.body, req.user as IUser);
    return res.status(201).json(new ApiResponse(201, lead, 'Lead created successfully'));
  });

  updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lead = await leadService.updateLead(req.params.id, req.body, req.user as IUser);
    return res.status(200).json(new ApiResponse(200, lead, 'Lead updated successfully'));
  });

  deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
    await leadService.deleteLead(req.params.id, req.user as IUser);
    return res.status(200).json(new ApiResponse(200, {}, 'Lead deleted successfully'));
  });
}

export default new LeadController();
