"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const enums_1 = require("../constants/enums");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
exports.getDashboardStats = (0, asyncHandler_1.default)(async (req, res) => {
    const totalLeads = await Lead_1.default.countDocuments();
    const statusStats = await Lead_1.default.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);
    const sourceStats = await Lead_1.default.aggregate([
        {
            $group: {
                _id: '$source',
                count: { $sum: 1 },
            },
        },
    ]);
    const monthlyGrowth = await Lead_1.default.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const qualifiedLeads = statusStats.find(s => s._id === enums_1.LeadStatus.QUALIFIED)?.count || 0;
    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    return res.status(200).json(new ApiResponse_1.default(200, {
        totalLeads,
        statusStats,
        sourceStats,
        monthlyGrowth,
        conversionRate: conversionRate.toFixed(2),
    }, 'Dashboard stats fetched'));
});
