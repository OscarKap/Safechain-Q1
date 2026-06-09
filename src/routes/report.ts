import { Router } from 'express';
import { authGuard } from '../middleware/authGuard';
import { roleGuard, ROLES } from '../middleware/rbacGuard';

const router = Router();

router.post('/', authGuard, (req, res) => {
  res.json({ message: 'Create report' });
});

router.post(
  '/:id/assign',
  authGuard,
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  (req, res) => {
    res.json({ message: 'Report assigned' });
  }
);

router.patch(
  '/:id/status',
  authGuard,
  roleGuard([ROLES.RESPONDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  (req, res) => {
    res.json({ message: 'Status updated' });
  }
);

export default router;