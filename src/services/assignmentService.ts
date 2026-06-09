import { PrismaClient } from '@prisma/client';
import { createNotification } from './notificationService';

const prisma = new PrismaClient();

/**
 * Assign a report to a responder
 * Creates a ReportAssignment record and sends a notification to the responder.
 * Only super_admin and admin roles should call this.
 */
export const assignReport = async (
  reportId: string,
  responderId: string,
  assignedById: string
) => {
  const assignment = await prisma.reportAssignment.create({
    data: {
      report_id: reportId,
      responder_id: responderId,
      assigned_by: assignedById,
    },
  });

  // Notify responder
  await createNotification({
    recipient_id: responderId,
    message: `You have been assigned a new report: ${reportId}`,
    type: 'in_app',
  });

  return assignment;
};

/**
 * Get assignments for a specific responder
 */
export const getAssignmentsByResponder = async (responderId: string) => {
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

/**
 * Get all assignments (admin view)
 */
export const getAllAssignments = async () => {
  return await prisma.reportAssignment.findMany({
    include: {
      report: true,
    },
    orderBy: {
      assigned_at: 'desc',
    },
  });
};