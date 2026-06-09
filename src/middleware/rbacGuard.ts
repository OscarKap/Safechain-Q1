import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    role: string;
  };
  district?: string;
}
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  RESPONDER: 'responder',
  GBV_OFFICER: 'gbv_officer',
  COUNSELLOR: 'counsellor',
  DEVELOPER: 'developer',
} as const;

export type Roles = typeof ROLES[keyof typeof ROLES];
export const roleGuard = (allowedRoles: Roles[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole as Roles)) {
      return res.status(403).json({
        error: 'Forbidden: Not authorized to access this endpoint',
      });
    }

    next();
  };
};

export const getUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized: Missing authentication token',
      });
    }

    next();
  } catch (e) {
    next({
      status: 500,
      message: 'Internal server error fetching user role',
    });
  }
};

// District admin helper
export const districtAdminGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized: No user authenticated',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { district: true },
    });

    if (!user?.district) {
      return res.status(403).json({
        error: 'Forbidden: District-admin privileges required',
      });
    }

    req.district = user.district;
    next();
  } catch (e) {
    next({
      status: 500,
      message: 'Internal server error validating admin privileges',
    });
  }
};