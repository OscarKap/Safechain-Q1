"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.districtAdminGuard = exports.getUserRole = exports.roleGuard = exports.ROLES = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    RESPONDER: 'responder',
    GBV_OFFICER: 'gbv_officer',
    COUNSELLOR: 'counsellor',
    DEVELOPER: 'developer',
};
const roleGuard = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Forbidden: Not authorized to access this endpoint',
            });
        }
        next();
    };
};
exports.roleGuard = roleGuard;
const getUserRole = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized: Missing authentication token',
            });
        }
        next();
    }
    catch (e) {
        next({
            status: 500,
            message: 'Internal server error fetching user role',
        });
    }
};
exports.getUserRole = getUserRole;
// District admin helper
const districtAdminGuard = async (req, res, next) => {
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
    }
    catch (e) {
        next({
            status: 500,
            message: 'Internal server error validating admin privileges',
        });
    }
};
exports.districtAdminGuard = districtAdminGuard;
//# sourceMappingURL=rbacGuard.js.map