"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
const authGuard = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next({ status: 401, message: 'Missing or malformed Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (e) {
        logger_1.default.warn('Invalid JWT', { error: e });
        next({ status: 401, message: 'Invalid token' });
    }
};
exports.authGuard = authGuard;
//# sourceMappingURL=authGuard.js.map