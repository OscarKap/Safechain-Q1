"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistricts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/** Get districts, optionally filtered by provinceId */
const getDistricts = async (provinceId) => {
    const where = provinceId ? { province_id: provinceId } : {};
    return prisma.district.findMany({ where });
};
exports.getDistricts = getDistricts;
//# sourceMappingURL=districtService.js.map