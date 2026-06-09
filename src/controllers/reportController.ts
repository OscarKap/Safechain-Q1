import { Request, Response, NextFunction } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
} from '../services/reportService';
import { assignReport } from '../services/assignmentService';
import { createNotification } from '../services/notificationService';
import logger from '../config/logger';

export const createReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = await createReport(req.body);
    // Notify all admins/responders about new report
    await createNotification({
      recipient_id: 'system', // placeholder for system-wide notification
      message: `New report created: ${report.id}`,
      type: 'in_app',
    });
    logger.info('Report created', { id: report.id });
    res.status(201).json(report);
  } catch (e) {
    next(e);
  }
};

export const getReportsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getReports({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      status: req.query.status as string,
      priority: req.query.priority as string,
      province: req.query.province as string,
      district: req.query.district as string,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getReportByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (e) {
    next(e);
  }
};

export const assignReportHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { responderId } = req.body;
    const assignment = await assignReport(
      req.params.id,
      responderId,
      req.user!.sub
    );
    // Notify responder
    await createNotification({
      recipient_id: responderId,
      message: `You have been assigned report: ${req.params.id}`,
      type: 'in_app',
    });
    logger.info('Report assigned', { reportId: req.params.id, responderId });
    res.json(assignment);
  } catch (e) {
    next(e);
  }
};

export const updateStatusHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const report = await updateReportStatus(req.params.id, status);
    // Notify admins when status changes
    await createNotification({
      recipient_id: 'system',
      message: `Report ${req.params.id} status updated to ${status}`,
      type: 'in_app',
    });
    logger.info('Report status updated', { id: req.params.id, status });
    res.json(report);
  } catch (e) {
    next(e);
  }
};

import { AuthenticatedRequest } from '../middleware/rbacGuard';