"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authGuard_1 = require("../middleware/authGuard");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/logout', authGuard_1.authGuard, authController_1.logout);
router.post('/refresh', authController_1.refresh);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map