"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
exports.protect = (0, asyncHandler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access_secret');
            req.user = (await User_1.default.findById(decoded.id).select('-password'));
            if (!req.user) {
                throw new ApiError_1.default(401, 'User not found');
            }
            next();
        }
        catch (error) {
            throw new ApiError_1.default(401, 'Not authorized, token failed');
        }
    }
    if (!token) {
        throw new ApiError_1.default(401, 'Not authorized, no token');
    }
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError_1.default(403, `User role ${req.user?.role} is not authorized to access this route`);
        }
        next();
    };
};
exports.authorize = authorize;
