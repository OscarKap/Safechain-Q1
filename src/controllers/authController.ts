import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

import {
  findUserByEmail,
  createUser,
  updateUserPassword,
  verifyUserEmail,
} from '../services/userService';

import {
  createRefreshToken,
  verifyRefreshToken,
  invalidateRefreshToken,
} from '../services/tokenService';

import { signAccessToken } from '../utils/jwt';

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/emailService';

import { validateDTO } from '../utils/validation';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

import logger from '../config/logger';
import { AuthenticatedRequest } from '../middleware/authGuard';

const prisma = new PrismaClient();

/* ---------- DTO ---------- */
class RegisterDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;
}

/* ---------- CONTROLLERS ---------- */

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto = await validateDTO(RegisterDTO, req.body);

    const existing = await findUserByEmail(dto.email);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const user = await createUser(dto);

    await sendVerificationEmail(dto.email, 'stub-token');

    // Fetch the newly created user with role for accurate JWT
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });
    if (!fullUser) {
      throw { status: 500, message: 'User not found after creation' };
    }
    const accessToken = signAccessToken({ sub: fullUser.id, role: fullUser.role.name });
    const { token: refreshToken } = await createRefreshToken(user.id);

    res.status(201).json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const bcrypt = await import('bcrypt');
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // After verifying credentials, fetch user with role
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });
    if (!userWithRole) {
      throw { status: 500, message: 'User record missing' };
    }
    const accessToken = signAccessToken({ sub: userWithRole.id, role: userWithRole.role.name });
    const { token: refreshToken } = await createRefreshToken(user.id);

    res.json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    await invalidateRefreshToken(req.user.sub);

    res.json({ message: 'Logged out' });
  } catch (e) {
    next(e);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const payload = await verifyRefreshToken(refresh_token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // After verifying credentials, fetch user with role
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });
    if (!userWithRole) {
      throw { status: 500, message: 'User record missing' };
    }
    const accessToken = signAccessToken({ sub: userWithRole.id, role: userWithRole.role.name });
    const { token: newRefreshToken } = await createRefreshToken(user.id);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    next(e);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (user) {
      await sendPasswordResetEmail(email, 'stub-reset-token');
    }

    res.json({ message: 'If email exists, reset link sent' });
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    res.json({ message: 'Password reset successful (stub)' });
  } catch (e) {
    next(e);
  }
};