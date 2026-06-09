import express from 'express';
import cors from 'cors';
import helmet from './middleware/securityHeaders';
import rateLimiter from './middleware/rateLimiter';
import logger from './config/logger';
import authRoutes from './routes/auth';
import facilityRoutes from './routes/facility';
import reportRoutes from './routes/report';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';

export const prisma = new PrismaClient();

const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SafeChain is running',
    timestamp: new Date().toISOString(),
  });
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet);
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/reports', reportRoutes);

// Global error handler
app.use(errorHandler);

const port = parseInt(env.PORT, 10) || 3000;
app.listen(port, () => {
  logger.info(`🚀 Server listening on http://localhost:${port}`);
});

export default app;