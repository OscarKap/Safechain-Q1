import { PrismaClient, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createReport = async (data: {
  case_number?: string;
  category: string;
  description?: string;
  province?: string;
  district?: string;
  gps_location?: string;
  reporter_name?: string;
  reporter_phone?: string;
  status?: ReportStatus;
  priority?: string;
}) => {
  return prisma.report.create({
    data: {
      case_number: data.case_number,
      category: data.category,
      description: data.description,
      province: data.province,
      district: data.district,
      gps_location: data.gps_location,
      reporter_name: data.reporter_name,
      reporter_phone: data.reporter_phone,
      status: data.status || 'New',
      priority: data.priority || 'Low',
    },
  });
};

export const getReports = async (query: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  province?: string;
  district?: string;
}) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;

  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.province) where.province = query.province;
  if (query.district) where.district = query.district;

  const [total, data] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: { attachments: true },
    }),
  ]);

  return {
    data,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

export const getReportById = async (id: string) => {
  return prisma.report.findUnique({
    where: { id },
    include: { attachments: true, assignments: true },
  });
};

export const updateReportStatus = async (id: string, status: ReportStatus) => {
  return prisma.report.update({
    where: { id },
    data: { status },
  });
};