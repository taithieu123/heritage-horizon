import { Router } from 'express';
import { heritageRouter } from './routes/heritage';
import { sensorRouter } from './routes/sensors';

export const apiRouter = Router();

// Mount sub-routes
apiRouter.use('/', heritageRouter);
apiRouter.use('/sensors', sensorRouter);

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Heritage & Horizon Backend API',
    timestamp: new Date().toISOString(),
  });
});
