"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protect, (0, asyncHandler_1.default)(async (req, res) => {
    const users = await User_1.default.find().select('name email role');
    return res.status(200).json(new ApiResponse_1.default(200, users, 'Users fetched successfully'));
}));
exports.default = router;
