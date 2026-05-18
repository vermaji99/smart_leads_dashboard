import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/stats', protect, authorize(UserRole.ADMIN), getDashboardStats);

export default router;
