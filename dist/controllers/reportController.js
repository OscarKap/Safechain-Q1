"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusHandler = exports.assignReportHandler = exports.getReportByIdHandler = exports.getReportsHandler = exports.createReportHandler = void 0;
const reportService_1 = require("../services/reportService");
const assignmentService_1 = require("../services/assignmentService");
const notificationService_1 = require("../services/notificationService");
const logger_1 = __importDefault(require("../config/logger"));
const createReportHandler = async (req, res, next) => {
    try {
        const report = await (0, reportService_1.createReport)(req.body);
        // Notify all admins/responders about new report
        await (0, notificationService_1.createNotification)({
            recipient_id: 'system', // placeholder for system-wide notification
            message: `New report created: ${report.id}`,
            type: 'in_app',
        });
        logger_1.default.info('Report created', { id: report.id });
        res.status(201).json(report);
    }
    catch (e) {
        next(e);
    }
};
exports.createReportHandler = createReportHandler;
const getReportsHandler = async (req, res, next) => {
    try {
        const result = await (0, reportService_1.getReports)({
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            status: req.query.status,
            priority: req.query.priority,
            province: req.query.province,
            district: req.query.district,
        });
        res.json(result);
    }
    catch (e) {
        next(e);
    }
};
exports.getReportsHandler = getReportsHandler;
const getReportByIdHandler = async (req, res, next) => {
    try {
        const report = await (0, reportService_1.getReportById)(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    }
    catch (e) {
        next(e);
    }
};
exports.getReportByIdHandler = getReportByIdHandler;
const assignReportHandler = async (req, res, next) => {
    try {
        const { responderId } = req.body;
        const assignment = await (0, assignmentService_1.assignReport)(req.params.id, responderId, req.user.sub);
        // Notify responder
        await (0, notificationService_1.createNotification)({
            recipient_id: responderId,
            message: `You have been assigned report: ${req.params.id}`,
            type: 'in_app',
        });
        logger_1.default.info('Report assigned', { reportId: req.params.id, responderId });
        res.json(assignment);
    }
    catch (e) {
        next(e);
    }
};
exports.assignReportHandler = assignReportHandler;
const updateStatusHandler = async (req, res, next) => {
    try {
        const { status } = req.body;
        const report = await (0, reportService_1.updateReportStatus)(req.params.id, status);
        // Notify admins when status changes
        await (0, notificationService_1.createNotification)({
            recipient_id: 'system',
            message: `Report ${req.params.id} status updated to ${status}`,
            type: 'in_app',
        });
        logger_1.default.info('Report status updated', { id: req.params.id, status });
        res.json(report);
    }
    catch (e) {
        next(e);
    }
};
exports.updateStatusHandler = updateStatusHandler;
//# sourceMappingURL=reportController.js.map