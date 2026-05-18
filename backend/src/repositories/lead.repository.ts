import { LeadStatus, LeadSource } from '../constants/enums';
import Lead, { ILead } from '../models/Lead';
import { ILeadFilter, ILeadSort, ILeadPagination } from '../interfaces/lead.interface';
import { UserRole } from '../constants/enums';
import { IUser } from '../models/User';

class LeadRepository {
  async findAll(filter: ILeadFilter, sort: ILeadSort, pagination: ILeadPagination, user: IUser) {
    const query: any = {};

    // RBAC: Sales users can only see leads assigned to them or created by them
    if (user.role === UserRole.SALES) {
      query.$or = [
        { assignedTo: user._id },
        { createdBy: user._id }
      ];
    }

    if (filter.status) query.status = filter.status;
    if (filter.source) query.source = filter.source;
    if (filter.assignedTo) query.assignedTo = filter.assignedTo;
    
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
        { company: { $regex: filter.search, $options: 'i' } },
      ];
    }

    if (filter.startDate && filter.endDate) {
      query.createdAt = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate),
      };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    
    const sortField = sort.sortBy || 'createdAt';
    const sortOrder = sort.order === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sortOptions as any)
        .skip(skip)
        .limit(pagination.limit)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean(),
      Lead.countDocuments(query)
    ]);

    return { leads, total };
  }

  async findById(id: string) {
    return Lead.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();
  }

  async create(data: Partial<ILead>) {
    return Lead.create(data);
  }

  async update(id: string, data: Partial<ILead>) {
    return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return Lead.findByIdAndDelete(id);
  }

  async countByStatus(user: IUser) {
    const match: any = {};
    if (user.role === UserRole.SALES) {
      match.$or = [{ assignedTo: user._id }, { createdBy: user._id }];
    }
    return Lead.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
  }
}

export default new LeadRepository();
