import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import logger from '../config/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: { sub: string; role: string };
}

export const authGuard = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next({ status: 401, message: 'Missing or malformed Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    // Fetch user and their role from database
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    if (!user) {
      return next({ status: 401, message: 'User not found' });
    }
    req.user = { sub: payload.sub, role: user.role.name };
    next();
  } catch (e) {
    logger.warn('Invalid JWT', { error: e });
    next({ status: 401, message: 'Invalid token' });
  }
};