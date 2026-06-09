import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import logger from '../config/logger';

export interface AuthenticatedRequest extends Request {
  user?: { sub: string; role: string };
}

export const authGuard = (
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
   const payload = jwt.verify(token, env.JWT_SECRET) as {
  sub: string;
  role: 'super_admin' | 'admin' | 'responder' | 'gbv_officer' | 'counsellor' | 'developer';
};
    req.user = payload;
    next();
  } catch (e) {
    logger.warn('Invalid JWT', { error: e });
    next({ status: 401, message: 'Invalid token' });
  }
};