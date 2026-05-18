"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lead_1 = __importDefault(require("../models/Lead"));
const enums_1 = require("../constants/enums");
class LeadRepository {
    async findAll(filter, sort, pagination, user) {
        const query = {};
        // RBAC: Sales users can only see leads assigned to them or created by them
        if (user.role === enums_1.UserRole.SALES) {
            query.$or = [
                { assignedTo: user._id },
                { createdBy: user._id }
            ];
        }
        if (filter.status)
            query.status = filter.status;
        if (filter.source)
            query.source = filter.source;
        if (filter.assignedTo)
            query.assignedTo = filter.assignedTo;
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
            Lead_1.default.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(pagination.limit)
                .populate('createdBy', 'name email')
                .populate('assignedTo', 'name email')
                .lean(),
            Lead_1.default.countDocuments(query)
        ]);
        return { leads, total };
    }
    async findById(id) {
        return Lead_1.default.findById(id)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .lean();
    }
    async create(data) {
        return Lead_1.default.create(data);
    }
    async update(id, data) {
        return Lead_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async delete(id) {
        return Lead_1.default.findByIdAndDelete(id);
    }
    async countByStatus(user) {
        const match = {};
        if (user.role === enums_1.UserRole.SALES) {
            match.$or = [{ assignedTo: user._id }, { createdBy: user._id }];
        }
        return Lead_1.default.aggregate([
            { $match: match },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
    }
}
exports.default = new LeadRepository();
