"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = __importDefault(require("./lead.controller"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const enums_1 = require("../../constants/enums");
const validate_middleware_1 = __importDefault(require("../../middleware/validate.middleware"));
const lead_validator_1 = require("../../validators/lead.validator");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.route('/')
    .get(lead_controller_1.default.getLeads)
    .post((0, validate_middleware_1.default)(lead_validator_1.createLeadSchema), lead_controller_1.default.createLead);
router.route('/:id')
    .get(lead_controller_1.default.getLeadById)
    .put((0, validate_middleware_1.default)(lead_validator_1.updateLeadSchema), lead_controller_1.default.updateLead)
    .delete((0, authMiddleware_1.authorize)(enums_1.UserRole.ADMIN), lead_controller_1.default.deleteLead);
exports.default = router;
