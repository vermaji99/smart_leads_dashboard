import { Router } from 'express';
import leadController from './lead.controller';
import { protect, authorize } from '../../middleware/authMiddleware';
import { UserRole } from '../../constants/enums';
import validate from '../../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema } from '../../validators/lead.validator';

const router = Router();

router.use(protect);

router.route('/')
  .get(leadController.getLeads)
  .post(validate(createLeadSchema), leadController.createLead);

router.route('/:id')
  .get(leadController.getLeadById)
  .put(validate(updateLeadSchema), leadController.updateLead)
  .delete(authorize(UserRole.ADMIN), leadController.deleteLead);

export default router;
