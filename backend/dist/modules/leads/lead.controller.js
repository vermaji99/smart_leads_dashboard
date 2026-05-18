"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lead_service_1 = __importDefault(require("../../services/lead.service"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
class LeadController {
    constructor() {
        this.getLeads = (0, asyncHandler_1.default)(async (req, res) => {
            const user = req.user;
            const { status, source, search, sortBy, order, page = 1, limit = 10, export: isExport, assignedTo, startDate, endDate } = req.query;
            const filter = {
                status: status,
                source: source,
                search: typeof search === 'string' ? search : '',
                assignedTo: typeof assignedTo === 'string' ? assignedTo : '',
                startDate: typeof startDate === 'string' ? startDate : '',
                endDate: typeof endDate === 'string' ? endDate : ''
            };
            const sort = {
                sortBy: typeof sortBy === 'string' ? sortBy : 'createdAt',
                order: order || 'desc'
            };
            const pagination = {
                page: parseInt(typeof page === 'string' ? page : '1'),
                limit: parseInt(typeof limit === 'string' ? limit : '10')
            };
            if (isExport === 'true') {
                const csv = await lead_service_1.default.exportLeads(filter, user);
                res.header('Content-Type', 'text/csv');
                res.attachment('leads.csv');
                return res.send(csv);
            }
            const { leads, total } = await lead_service_1.default.getAllLeads(filter, sort, pagination, user);
            return res.status(200).json(new ApiResponse_1.default(200, leads, 'Leads fetched successfully', {
                page: pagination.page,
                limit: pagination.limit,
                total,
                totalPages: Math.ceil(total / pagination.limit),
                hasNextPage: pagination.page < Math.ceil(total / pagination.limit),
                hasPrevPage: pagination.page > 1,
            }));
        });
        this.getLeadById = (0, asyncHandler_1.default)(async (req, res) => {
            const lead = await lead_service_1.default.getLeadById(req.params.id, req.user);
            return res.status(200).json(new ApiResponse_1.default(200, lead, 'Lead fetched successfully'));
        });
        this.createLead = (0, asyncHandler_1.default)(async (req, res) => {
            const lead = await lead_service_1.default.createLead(req.body, req.user);
            return res.status(201).json(new ApiResponse_1.default(201, lead, 'Lead created successfully'));
        });
        this.updateLead = (0, asyncHandler_1.default)(async (req, res) => {
            const lead = await lead_service_1.default.updateLead(req.params.id, req.body, req.user);
            return res.status(200).json(new ApiResponse_1.default(200, lead, 'Lead updated successfully'));
        });
        this.deleteLead = (0, asyncHandler_1.default)(async (req, res) => {
            await lead_service_1.default.deleteLead(req.params.id, req.user);
            return res.status(200).json(new ApiResponse_1.default(200, {}, 'Lead deleted successfully'));
        });
    }
}
exports.default = new LeadController();
