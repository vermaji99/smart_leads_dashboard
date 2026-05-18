import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import ApiError from '../utils/ApiError';

class AuthService {
  public generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SECRET || 'access_secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  public async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'
      ) as { id: string };

      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      const tokens = this.generateTokens((user._id as any).toString());
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }
}

export default new AuthService();
