import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Get districts, optionally filtered by provinceId */
export const getDistricts = async (provinceId?: string) => {
  const where = provinceId ? { province_id: provinceId } : {};
  return prisma.district.findMany({ where });
};