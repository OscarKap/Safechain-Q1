"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
/**
 * Middleware to ensure the authenticated user has one of the allowed roles.
 * Usage: router.get('/admin', authGuard, roleGuard(['admin','super_admin']), handler)
 */
const roleGuard = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden – insufficient role' });
        }
        next();
    };
};
exports.roleGuard = roleGuard;
//# sourceMappingURL=roleGuard.js.map