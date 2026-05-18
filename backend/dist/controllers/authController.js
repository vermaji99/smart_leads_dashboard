"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const enums_1 = require("../constants/enums");
const authService_1 = __importDefault(require("../services/authService"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
exports.registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        throw new ApiError_1.default(400, 'User already exists');
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    const user = await User_1.default.create({
        name,
        email,
        password: hashedPassword,
        role: role || enums_1.UserRole.SALES,
    });
    const { accessToken, refreshToken } = authService_1.default.generateTokens(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(201).json(new ApiResponse_1.default(201, {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
    }, 'User registered successfully'));
});
exports.loginUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        throw new ApiError_1.default(401, 'Invalid email or password');
    }
    const { accessToken, refreshToken } = authService_1.default.generateTokens(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(new ApiResponse_1.default(200, {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
    }, 'User logged in successfully'));
});
exports.logoutUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await User_1.default.findById(req.body.userId);
    if (user) {
        user.refreshToken = undefined;
        await user.save();
    }
    res.clearCookie('refreshToken');
    return res.status(200).json(new ApiResponse_1.default(200, {}, 'User logged out successfully'));
});
exports.refreshAccessToken = (0, asyncHandler_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new ApiError_1.default(401, 'Refresh token missing');
    }
    const tokens = await authService_1.default.refreshAccessToken(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(new ApiResponse_1.default(200, { accessToken: tokens.accessToken }, 'Token refreshed successfully'));
});
exports.getMe = (0, asyncHandler_1.default)(async (req, res) => {
    return res.status(200).json(new ApiResponse_1.default(200, req.user, 'User profile fetched'));
});
