"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
// Central error handling – all thrown errors should be forwarded via next(err)
const errorHandler = (err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.default.error('Error handler', { status, message, stack: err.stack });
    res.status(status).json({ error: message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map