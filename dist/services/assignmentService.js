"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAssignments = exports.getAssignmentsByResponder = exports.assignReport = void 0;
const client_1 = require("@prisma/client");
const notificationService_1 = require("./notificationService");
const prisma = new client_1.PrismaClient();
/**
 * Assign a report to a responder
 * Creates a ReportAssignment record and sends a notification to the responder.
 * Only super_admin and admin roles should call this.
 */
const assignReport = async (reportId, responderId, assignedById) => {
    const assignment = await prisma.reportAssignment.create({
        data: {
            report_id: reportId,
            responder_id: responderId,
            assigned_by: assignedById,
        },
    });
    // Notify responder
    await (0, notificationService_1.createNotification)({
        recipient_id: responderId,
        message: `You have been assigned a new report: ${reportId}`,
        type: 'in_app',
    });
    return assignment;
};
exports.assignReport = assignReport;
/**
 * Get assignments for a specific responder
 */
const getAssignmentsByResponder = async (responderId) => {
    return await prisma.reportAssignment.findMany({
        where: {
            responder_id: responderId,
        },
        include: {
            report: true,
        },
        orderBy: {
            assigned_at: 'desc',
        },
    });
};
exports.getAssignmentsByResponder = getAssignmentsByResponder;
/**
 * Get all assignments (admin view)
 */
const getAllAssignments = async () => {
    return await prisma.reportAssignment.findMany({
        include: {
            report: true,
        },
        orderBy: {
            assigned_at: 'desc',
        },
    });
};
exports.getAllAssignments = getAllAssignments;
//# sourceMappingURL=assignmentService.js.map