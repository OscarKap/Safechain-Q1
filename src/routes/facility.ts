import { Router } from 'express';
import {
  createFacilityHandler,
  getFacilitiesHandler,
} from '../controllers/facilityController';

const router = Router();

router.post('/', createFacilityHandler);
router.get('/', getFacilitiesHandler);

export default router;