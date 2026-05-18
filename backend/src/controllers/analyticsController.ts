import { Response } from 'express';
import Lead, { LeadStatus } from '../models/Lead';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const getDashboardStats = asyncHandler(async (req: any, res: Response) => {
  const totalLeads = await Lead.countDocuments();
  
  const statusStats = await Lead.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const sourceStats = await Lead.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
  ]);

  const monthlyGrowth = await Lead.aggregate([
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

  const qualifiedLeads = statusStats.find(s => s._id === LeadStatus.QUALIFIED)?.count || 0;
  const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      totalLeads,
      statusStats,
      sourceStats,
      monthlyGrowth,
      conversionRate: conversionRate.toFixed(2),
    }, 'Dashboard stats fetched')
  );
});
