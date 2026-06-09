import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

export interface AuthenticatedRequest extends Request {{
  user?: {
    sub: string;
    role: string;
  };
}};

export interface UserRole {{ role: string;}}

export type Roles = 'super_admin' | 'provincial_admin' | 'district_admin' | 'responder';

export const roleGuard = (allowedRoles: Roles[]) => {{
  return (req: AuthenticatedRequest, _: Response, next: NextFunction) => {{
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {{
      return next({
        status: 403,
        message: 'Forbidden: Not authorized to access this endpoint'
      });
    }
    next();
  };
}};

export const getUserRole = async (req: Request, res: Response, next: NextFunction) => {{
  try {{
    if (!req.user) {{
      return res.status(401).json({
        error: 'Unauthorized: Missing authentication token'
      });
    }
    req.user = {
      sub: req.user.sub,
      role: req.user.role
    };
    next();
  }}
  catch (e) {{
    next({
      status: 500,
      message: 'Internal server error fetching user role'
    });
  }}
}};

// Admin validation middleware
const districtAdminGuard = async (req: Request, res: Response, next: NextFunction) => {{
  try {{
    if (!req.user) {{
      return res.status(401).json({
        error: 'Unauthorized: No user authenticated'
      });
    }}
    const user = await prisma.user.findUnique({
      where: {{
        id: req.user.sub
      }},
      select: {{
        district: true
      }}
    });
    if (!user?.district) {{
      return res.status(403).json({
        error: 'Forbidden: District-admin privileges required'
      });
    }}
    req.district = user.district;
    next();
  }}
  catch (e) {{
    next({
      status: 500,
      message: 'Internal server error validating admin privileges'
    });
  }}
}};