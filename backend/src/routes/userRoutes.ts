import express, { Request, Response } from 'express';
import User from '../models/User';
import { protect } from '../middleware/authMiddleware';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select('name email role');
  return res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
}));

export default router;
