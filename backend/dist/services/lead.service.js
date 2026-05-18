"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lead_repository_1 = __importDefault(require("../repositories/lead.repository"));
const enums_1 = require("../constants/enums");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const json2csv_1 = require("json2csv");
class LeadService {
    async getAllLeads(filter, sort, pagination, user) {
        return lead_repository_1.default.findAll(filter, sort, pagination, user);
    }
    async getLeadById(id, user) {
        const lead = await lead_repository_1.default.findById(id);
        if (!lead)
            throw new ApiError_1.default(404, 'Lead not found');
        // RBAC check
        if (user.role === enums_1.UserRole.SALES) {
            const isAssigned = lead.assignedTo?._id?.toString() === user._id.toString();
            const isCreator = lead.createdBy?._id?.toString() === user._id.toString();
            if (!isAssigned && isCreator) {
                throw new ApiError_1.default(403, 'You do not have permission to view this lead');
            }
        }
        return lead;
    }
    async createLead(data, user) {
        const leadData = {
            ...data,
            createdBy: user._id,
            assignedTo: data.assignedTo || user._id,
        };
        return lead_repository_1.default.create(leadData);
    }
    async updateLead(id, data, user) {
        const lead = await lead_repository_1.default.findById(id);
        if (!lead)
            throw new ApiError_1.default(404, 'Lead not found');
        // RBAC: Sales users can only update leads assigned to them or created by them
        if (user.role === enums_1.UserRole.SALES) {
            const isAssigned = lead.assignedTo?._id?.toString() === user._id.toString();
            const isCreator = lead.createdBy?._id?.toString() === user._id.toString();
            if (!isAssigned && !isCreator) {
                throw new ApiError_1.default(403, 'You do not have permission to update this lead');
            }
            // RBAC: Sales user cannot mark lead as Lost
            if (data.status === enums_1.LeadStatus.LOST && lead.status !== enums_1.LeadStatus.LOST) {
                throw new ApiError_1.default(403, 'Only administrators can mark a lead as Lost');
            }
        }
        return lead_repository_1.default.update(id, data);
    }
    async deleteLead(id, user) {
        // Only Admin can delete
        if (user.role !== enums_1.UserRole.ADMIN) {
            throw new ApiError_1.default(403, 'Only administrators can delete leads');
        }
        const lead = await lead_repository_1.default.findById(id);
        if (!lead)
            throw new ApiError_1.default(404, 'Lead not found');
        return lead_repository_1.default.delete(id);
    }
    async exportLeads(filter, user) {
        const { leads } = await lead_repository_1.default.findAll(filter, { sortBy: 'createdAt', order: 'desc' }, { page: 1, limit: 10000 }, user);
        const fields = ['name', 'email', 'phone', 'company', 'status', 'source', 'createdAt'];
        const opts = { fields };
        const parser = new json2csv_1.Parser(opts);
        return parser.parse(leads);
    }
}
exports.default = new LeadService();
