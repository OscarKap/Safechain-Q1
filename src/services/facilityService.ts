import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new facility record.
 */
export const createFacility = async (data: {
  name: string;
  type: 'clinic' | 'hospital' | 'shelter' | 'responder_hub';
  province: string;
  district: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  is_active?: boolean;
}) => {
  const facility = await prisma.facility.create({
    data: {
      name: data.name,
      type: data.type as any,
      province: data.province,
      district: data.district,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      is_active: data.is_active ?? true,
    },
  });
  return facility;
};

/**
 * Retrieve facilities with pagination and optional filters.
 * `query` may contain: page, limit, province, district, type.
 */
export const getFacilities = async (query: {
  page?: number;
  limit?: number;
  province?: string;
  district?: string;
  type?: string;
}) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;

  const where: any = {};
  if (query.province) where.province = query.province;
  if (query.district) where.district = query.district;
  if (query.type) where.type = query.type;

  const [total, data] = await Promise.all([
    prisma.facility.count({ where }),
    prisma.facility.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      totalPages,
      page,
      limit,
    },
  };
};
