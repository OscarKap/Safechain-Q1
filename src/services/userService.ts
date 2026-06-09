import { PrismaClient, RoleName } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import logger from '../config/logger';

const prisma = new PrismaClient();

/** Find a user by email */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

/** Create a new user with the default role (responder) */
export const createUser = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  province?: string;
  district?: string;
}) => {
  const password_hash = await hashPassword(data.password);
  // Find the responder role (fallback to first role if not present)
  const role = await prisma.role.findFirst({ where: { name: RoleName.responder } });
  if (!role) {
    throw { status: 500, message: 'Default role not found' };
  }
  const user = await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone ?? null,
      password_hash,
      role_id: role.id,
      province: data.province ?? null,
      district: data.district ?? null,
    },
  });
  logger.info('User registered', { userId: user.id, email: user.email });
  return user;
};

/** Validate password for login */
export const validateUserPassword = async (userId: string, plain: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  return comparePassword(plain, user.password_hash);
};

/** Update password (used for reset flow) */
export const updateUserPassword = async (userId: string, newPassword: string) => {
  const newHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: newHash },
  });
  logger.info('Password updated', { userId });
};

/** Mark email as verified */
export const verifyUserEmail = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { email_verified: true },
  });
  logger.info('Email verified', { userId });
};
