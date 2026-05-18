import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../constants/enums';

const router = express.Router();

router.use(protect);

router.route('/').get(getLeads).post(createLead);
router
  .route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize(UserRole.ADMIN), deleteLead);

export default router;
