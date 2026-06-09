import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Central error handling – all thrown errors should be forwarded via next(err)
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  logger.error('Error handler', { status, message, stack: err.stack });
  res.status(status).json({ error: message });
};