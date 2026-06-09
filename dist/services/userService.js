"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserEmail = exports.updateUserPassword = exports.validateUserPassword = exports.createUser = exports.findUserByEmail = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("../utils/bcrypt");
const logger_1 = __importDefault(require("../config/logger"));
const prisma = new client_1.PrismaClient();
/** Find a user by email */
const findUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
/** Create a new user with the default role (responder) */
const createUser = async (data) => {
    const password_hash = await (0, bcrypt_1.hashPassword)(data.password);
    // Find the responder role (fallback to first role if not present)
    const role = await prisma.role.findFirst({ where: { name: client_1.RoleName.responder } });
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
    logger_1.default.info('User registered', { userId: user.id, email: user.email });
    return user;
};
exports.createUser = createUser;
/** Validate password for login */
const validateUserPassword = async (userId, plain) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return false;
    return (0, bcrypt_1.comparePassword)(plain, user.password_hash);
};
exports.validateUserPassword = validateUserPassword;
/** Update password (used for reset flow) */
const updateUserPassword = async (userId, newPassword) => {
    const newHash = await (0, bcrypt_1.hashPassword)(newPassword);
    await prisma.user.update({
        where: { id: userId },
        data: { password_hash: newHash },
    });
    logger_1.default.info('Password updated', { userId });
};
exports.updateUserPassword = updateUserPassword;
/** Mark email as verified */
const verifyUserEmail = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: { email_verified: true },
    });
    logger_1.default.info('Email verified', { userId });
};
exports.verifyUserEmail = verifyUserEmail;
//# sourceMappingURL=userService.js.map