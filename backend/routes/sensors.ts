import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const sensorRouter = Router();

// POST /api/sensors/telemetry - Record device sensor reading
sensorRouter.post('/telemetry', (req: Request, res: Response) => {
  const { latitude, longitude, altitude, accuracy, compassBearing, deviceId } = req.body;

  if (latitude === undefined || longitude === undefined || compassBearing === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Thiếu thông số latitude, longitude hoặc compassBearing',
    });
  }

  const log = db.saveTelemetryLog({
    deviceId,
    latitude: Number(latitude),
    longitude: Number(longitude),
    altitude: altitude !== undefined ? Number(altitude) : undefined,
    accuracy: accuracy !== undefined ? Number(accuracy) : undefined,
    compassBearing: Number(compassBearing),
  });

  res.json({
    success: true,
    message: 'Đã lưu dữ liệu cảm biến telemetry thành công',
    data: log,
  });
});

// GET /api/sensors/recent - Retrieve latest sensor recordings
sensorRouter.get('/recent', (_req: Request, res: Response) => {
  const logs = db.getRecentLogs(15);
  res.json({
    success: true,
    count: logs.length,
    data: logs,
  });
});
