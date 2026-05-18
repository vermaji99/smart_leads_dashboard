"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const enums_1 = require("../constants/enums");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.route('/').get(leadController_1.getLeads).post(leadController_1.createLead);
router
    .route('/:id')
    .get(leadController_1.getLeadById)
    .put(leadController_1.updateLead)
    .delete((0, authMiddleware_1.authorize)(enums_1.UserRole.ADMIN), leadController_1.deleteLead);
exports.default = router;
