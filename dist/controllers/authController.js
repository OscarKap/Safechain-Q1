"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const userService_1 = require("../services/userService");
const tokenService_1 = require("../services/tokenService");
const jwt_1 = require("../utils/jwt");
const emailService_1 = require("../services/emailService");
const validation_1 = require("../utils/validation");
const class_validator_1 = require("class-validator");
const prisma = new client_1.PrismaClient();
/* ---------- DTO ---------- */
class RegisterDTO {
    email;
    password;
    first_name;
    last_name;
    phone;
    province;
    district;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], RegisterDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDTO.prototype, "district", void 0);
/* ---------- CONTROLLERS ---------- */
const register = async (req, res, next) => {
    try {
        const dto = await (0, validation_1.validateDTO)(RegisterDTO, req.body);
        const existing = await (0, userService_1.findUserByEmail)(dto.email);
        if (existing) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const user = await (0, userService_1.createUser)(dto);
        await (0, emailService_1.sendVerificationEmail)(dto.email, 'stub-token');
        const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, role: 'user' });
        const { token: refreshToken } = await (0, tokenService_1.createRefreshToken)(user.id);
        res.status(201).json({ accessToken, refreshToken });
    }
    catch (e) {
        next(e);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await (0, userService_1.findUserByEmail)(email);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const bcrypt = await Promise.resolve().then(() => __importStar(require('bcrypt')));
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, role: 'user' });
        const { token: refreshToken } = await (0, tokenService_1.createRefreshToken)(user.id);
        res.json({ accessToken, refreshToken });
    }
    catch (e) {
        next(e);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthenticated' });
            return;
        }
        await (0, tokenService_1.invalidateRefreshToken)(req.user.sub);
        res.json({ message: 'Logged out' });
    }
    catch (e) {
        next(e);
    }
};
exports.logout = logout;
const refresh = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            res.status(400).json({ error: 'Refresh token required' });
            return;
        }
        const payload = await (0, tokenService_1.verifyRefreshToken)(refresh_token);
        if (!payload) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: { role: true },
        });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, role: 'user' });
        const { token: newRefreshToken } = await (0, tokenService_1.createRefreshToken)(user.id);
        res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (e) {
        next(e);
    }
};
exports.refresh = refresh;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await (0, userService_1.findUserByEmail)(email);
        if (user) {
            await (0, emailService_1.sendPasswordResetEmail)(email, 'stub-reset-token');
        }
        res.json({ message: 'If email exists, reset link sent' });
    }
    catch (e) {
        next(e);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { token, new_password } = req.body;
        if (!token || !new_password) {
            res.status(400).json({ error: 'Missing fields' });
            return;
        }
        res.json({ message: 'Password reset successful (stub)' });
    }
    catch (e) {
        next(e);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map