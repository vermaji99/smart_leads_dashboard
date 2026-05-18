import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../interfaces/auth.interface';
import { UserRole } from '../constants/enums';

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || 'access_secret'
      ) as { id: string };

      req.user = (await User.findById(decoded.id).select('-password')) as IUser;
      if (!req.user) {
        throw new ApiError(401, 'User not found');
      }
      next();
    } catch (error) {
      throw new ApiError(401, 'Not authorized, token failed');
    }
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `User role ${req.user?.role} is not authorized to access this route`
      );
    }
    next();
  };
};
