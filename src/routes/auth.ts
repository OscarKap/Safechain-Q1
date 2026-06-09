import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authGuard, logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;