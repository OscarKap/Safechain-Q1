import { Request, Response, NextFunction } from 'express';
import { createFacility, getFacilities } from '../services/facilityService';
import logger from '../config/logger';

/** POST /api/facilities */
export const createFacilityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const facility = await createFacility(req.body);
    logger.info('Facility created', { id: facility.id });
    res.status(201).json(facility);
  } catch (e) {
    next(e);
  }
};

/** GET /api/facilities */
export const getFacilitiesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getFacilities({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      province: req.query.province as string | undefined,
      district: req.query.district as string | undefined,
      type: req.query.type as string | undefined,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
};
