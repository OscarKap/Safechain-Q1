"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProvinces = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProvinces = async () => {
    return prisma.province.findMany();
};
exports.getAllProvinces = getAllProvinces;
//# sourceMappingURL=provinceService.js.map