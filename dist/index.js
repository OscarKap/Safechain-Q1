"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const securityHeaders_1 = __importDefault(require("./middleware/securityHeaders"));
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
const logger_1 = __importDefault(require("./config/logger"));
const auth_1 = __importDefault(require("./routes/auth"));
const facility_1 = __importDefault(require("./routes/facility"));
const report_1 = __importDefault(require("./routes/report"));
const errorHandler_1 = require("./middleware/errorHandler");
const env_1 = require("./config/env");
const client_1 = require("@prisma/client");
require("reflect-metadata");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'SafeChain is running',
        timestamp: new Date().toISOString(),
    });
});
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(securityHeaders_1.default);
app.use(rateLimiter_1.default);
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/facilities', facility_1.default);
app.use('/api/reports', report_1.default);
// Global error handler
app.use(errorHandler_1.errorHandler);
const port = parseInt(env_1.env.PORT, 10) || 3000;
app.listen(port, () => {
    logger_1.default.info(`🚀 Server listening on http://localhost:${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map