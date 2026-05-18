import { Response } from 'express';
import { Parser } from 'json2csv';
import Lead, { ILead } from '../models/Lead';
import { AuthRequest } from '../middleware/authMiddleware';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private
export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, source, search, sort, page = 1, limit = 10, export: isExport, startDate, endDate } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (source) query.source = source;
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  // If export is requested
  if (isExport === 'true') {
    const leads = await Lead.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');
    
    const fields = ['name', 'email', 'phone', 'company', 'status', 'source', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  }

  // Pagination
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Sorting
  let sortOptions: any = { createdAt: -1 };
  if (sort === 'oldest') sortOptions = { createdAt: 1 };
  if (sort === 'alphabetical') sortOptions = { name: 1 };

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  return res.status(200).json(
    new ApiResponse(
      200,
      leads,
      'Leads fetched successfully',
      {
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        total,
        hasNextPage: pageNumber < Math.ceil(total / limitNumber),
        hasPrevPage: pageNumber > 1,
      }
    )
  );
});

// @desc    Get single lead
// @route   GET /api/v1/leads/:id
// @access  Private
export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  return res.status(200).json(new ApiResponse(200, lead, 'Lead fetched successfully'));
});

// @desc    Create lead
// @route   POST /api/v1/leads
// @access  Private
export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, phone, company, status, source, notes, assignedTo } = req.body;

  const lead = await Lead.create({
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

  return res.status(201).json(new ApiResponse(201, lead, 'Lead created successfully'));
});

// @desc    Update lead
// @route   PUT /api/v1/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse(200, updatedLead, 'Lead updated successfully'));
});

// @desc    Delete lead
// @route   DELETE /api/v1/leads/:id
// @access  Private (Admin only)
export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  await lead.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, 'Lead removed successfully'));
});
