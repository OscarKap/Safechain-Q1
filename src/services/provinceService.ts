import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProvinces = async () => {
  return prisma.province.findMany();
};