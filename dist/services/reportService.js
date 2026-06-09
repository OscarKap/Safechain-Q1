"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportStatus = exports.getReportById = exports.getReports = exports.createReport = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createReport = async (data) => {
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
exports.createReport = createReport;
const getReports = async (query) => {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const where = {};
    if (query.status)
        where.status = query.status;
    if (query.priority)
        where.priority = query.priority;
    if (query.province)
        where.province = query.province;
    if (query.district)
        where.district = query.district;
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
exports.getReports = getReports;
const getReportById = async (id) => {
    return prisma.report.findUnique({
        where: { id },
        include: { attachments: true, assignments: true },
    });
};
exports.getReportById = getReportById;
const updateReportStatus = async (id, status) => {
    return prisma.report.update({
        where: { id },
        data: { status },
    });
};
exports.updateReportStatus = updateReportStatus;
//# sourceMappingURL=reportService.js.map