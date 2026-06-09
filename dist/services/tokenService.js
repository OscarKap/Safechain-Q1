"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateRefreshToken = exports.verifyRefreshToken = exports.createRefreshToken = void 0;
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../config/logger"));
const prisma = new client_1.PrismaClient();
/**
 * Create a new refresh token and associate it with the user.
 * For simplicity, we'll store it in the user table as a string (could be a separate table for more control).
 */
const createRefreshToken = async (userId) => {
    const tokenId = (0, crypto_1.randomUUID)();
    const token = (0, jwt_1.signRefreshToken)({ sub: userId, tokenId });
    // Store the token ID (not the full token) in the user table as a simple reference
    // In a production app, you might store a hash of the token and expiration date
    await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenId: tokenId },
    });
    logger_1.default.info('Refresh token created', { userId, tokenId });
    return { token, tokenId };
};
exports.createRefreshToken = createRefreshToken;
/**
 * Verify a refresh token and return the associated user.
 * Also checks if the stored token ID matches (basic revocation check).
 */
const verifyRefreshToken = async (token) => {
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || user.refreshTokenId !== payload.tokenId) {
            logger_1.default.warn('Invalid refresh token', { userId: payload.sub });
            return null;
        }
        return { userId: payload.sub, tokenId: payload.tokenId };
    }
    catch (e) {
        logger_1.default.warn('Invalid refresh token', { error: e });
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Invalidate a refresh token (used on logout).
 */
const invalidateRefreshToken = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshTokenId: null },
    });
    logger_1.default.info('Refresh token invalidated', { userId });
};
exports.invalidateRefreshToken = invalidateRefreshToken;
//# sourceMappingURL=tokenService.js.map