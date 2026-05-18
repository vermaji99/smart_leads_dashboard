"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getLeads = void 0;
const json2csv_1 = require("json2csv");
const Lead_1 = __importDefault(require("../models/Lead"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private
exports.getLeads = (0, asyncHandler_1.default)(async (req, res) => {
    const { status, source, search, sort, page = 1, limit = 10, export: isExport, startDate, endDate } = req.query;
    const query = {};
    if (status)
        query.status = status;
    if (source)
        query.source = source;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    // If export is requested
    if (isExport === 'true') {
        const leads = await Lead_1.default.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');
        const fields = ['name', 'email', 'phone', 'company', 'status', 'source', 'createdAt'];
        const opts = { fields };
        const parser = new json2csv_1.Parser(opts);
        const csv = parser.parse(leads);
        res.header('Content-Type', 'text/csv');
        res.attachment('leads.csv');
        return res.send(csv);
    }
    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest')
        sortOptions = { createdAt: 1 };
    if (sort === 'alphabetical')
        sortOptions = { name: 1 };
    const total = await Lead_1.default.countDocuments(query);
    const leads = await Lead_1.default.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
    return res.status(200).json(new ApiResponse_1.default(200, leads, 'Leads fetched successfully', {
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        total,
        hasNextPage: pageNumber < Math.ceil(total / limitNumber),
        hasPrevPage: pageNumber > 1,
    }));
});
// @desc    Get single lead
// @route   GET /api/v1/leads/:id
// @access  Private
exports.getLeadById = (0, asyncHandler_1.default)(async (req, res) => {
    const lead = await Lead_1.default.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
    if (!lead) {
        throw new ApiError_1.default(404, 'Lead not found');
    }
    return res.status(200).json(new ApiResponse_1.default(200, lead, 'Lead fetched successfully'));
});
// @desc    Create lead
// @route   POST /api/v1/leads
// @access  Private
exports.createLead = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, phone, company, status, source, notes, assignedTo } = req.body;
    const lead = await Lead_1.default.create({
        name,
        email,
        phone,
        company,
        status,
        source,
        notes,
        assignedTo: assignedTo || req.user?._id,
        createdBy: req.user?._id,
    });
    return res.status(201).json(new ApiResponse_1.default(201, lead, 'Lead created successfully'));
});
// @desc    Update lead
// @route   PUT /api/v1/leads/:id
// @access  Private
exports.updateLead = (0, asyncHandler_1.default)(async (req, res) => {
    const lead = await Lead_1.default.findById(req.params.id);
    if (!lead) {
        throw new ApiError_1.default(404, 'Lead not found');
    }
    const updatedLead = await Lead_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    return res.status(200).json(new ApiResponse_1.default(200, updatedLead, 'Lead updated successfully'));
});
// @desc    Delete lead
// @route   DELETE /api/v1/leads/:id
// @access  Private (Admin only)
exports.deleteLead = (0, asyncHandler_1.default)(async (req, res) => {
    const lead = await Lead_1.default.findById(req.params.id);
    if (!lead) {
        throw new ApiError_1.default(404, 'Lead not found');
    }
    await lead.deleteOne();
    return res.status(200).json(new ApiResponse_1.default(200, {}, 'Lead removed successfully'));
});
