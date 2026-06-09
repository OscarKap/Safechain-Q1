"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacilities = exports.createFacility = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Create a new facility record.
 */
const createFacility = async (data) => {
    const facility = await prisma.facility.create({
        data: {
            name: data.name,
            type: data.type,
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
exports.createFacility = createFacility;
/**
 * Retrieve facilities with pagination and optional filters.
 * `query` may contain: page, limit, province, district, type.
 */
const getFacilities = async (query) => {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const where = {};
    if (query.province)
        where.province = query.province;
    if (query.district)
        where.district = query.district;
    if (query.type)
        where.type = query.type;
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
exports.getFacilities = getFacilities;
//# sourceMappingURL=facilityService.js.map