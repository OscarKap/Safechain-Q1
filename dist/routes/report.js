"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGuard_1 = require("../middleware/authGuard");
const rbacGuard_1 = require("../middleware/rbacGuard");
const router = (0, express_1.Router)();
router.post('/', authGuard_1.authGuard, (req, res) => {
    res.json({ message: 'Create report' });
});
router.post('/:id/assign', authGuard_1.authGuard, (0, rbacGuard_1.roleGuard)([rbacGuard_1.ROLES.ADMIN, rbacGuard_1.ROLES.SUPER_ADMIN]), (req, res) => {
    res.json({ message: 'Report assigned' });
});
router.patch('/:id/status', authGuard_1.authGuard, (0, rbacGuard_1.roleGuard)([rbacGuard_1.ROLES.RESPONDER, rbacGuard_1.ROLES.ADMIN, rbacGuard_1.ROLES.SUPER_ADMIN]), (req, res) => {
    res.json({ message: 'Status updated' });
});
exports.default = router;
//# sourceMappingURL=report.js.map