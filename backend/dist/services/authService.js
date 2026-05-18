"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class AuthService {
    generateTokens(userId) {
        const accessToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET || 'access_secret', { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret');
            const user = await User_1.default.findById(decoded.id);
            if (!user || user.refreshToken !== refreshToken) {
                throw new ApiError_1.default(401, 'Invalid refresh token');
            }
            const tokens = this.generateTokens(user._id.toString());
            user.refreshToken = tokens.refreshToken;
            await user.save();
            return tokens;
        }
        catch (error) {
            throw new ApiError_1.default(401, 'Invalid refresh token');
        }
    }
}
exports.default = new AuthService();
