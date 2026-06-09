import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { signRefreshToken, verifyToken, type RefreshTokenPayload } from '../utils/jwt';
import logger from '../config/logger';

const prisma = new PrismaClient();

/**
 * Create a new refresh token and associate it with the user.
 * For simplicity, we'll store it in the user table as a string (could be a separate table for more control).
 */
export const createRefreshToken = async (userId: string) => {
  const tokenId = randomUUID();
  const token = signRefreshToken({ sub: userId, tokenId });

  // Store the token ID (not the full token) in the user table as a simple reference
  // In a production app, you might store a hash of the token and expiration date
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenId: tokenId },
  });

  logger.info('Refresh token created', { userId, tokenId });
  return { token, tokenId };
};

/**
 * Verify a refresh token and return the associated user.
 * Also checks if the stored token ID matches (basic revocation check).
 */
export const verifyRefreshToken = async (token: string) => {
  try {
    const payload = verifyToken<RefreshTokenPayload>(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.refreshTokenId !== payload.tokenId) {
      logger.warn('Invalid refresh token', { userId: payload.sub });
      return null;
    }
    return { userId: payload.sub, tokenId: payload.tokenId };
  } catch (e) {
    logger.warn('Invalid refresh token', { error: e });
    return null;
  }
};

/**
 * Invalidate a refresh token (used on logout).
 */
export const invalidateRefreshToken = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenId: null },
  });
  logger.info('Refresh token invalidated', { userId });
};
