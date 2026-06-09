import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authGuard';

/**
 * Middleware to ensure the authenticated user has one of the allowed roles.
 * Usage: router.get('/admin', authGuard, roleGuard(['admin','super_admin']), handler)
 */
export const roleGuard = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden – insufficient role' });
    }
    next();
  };
};