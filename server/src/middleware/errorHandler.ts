import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack || 'No stack trace available');

  // Default error status and message
  const status = 500;
  const message = 'Internal Server Error';

  // Send error response
  res.status(status).json({
    error: {
      message,
      status,
    }
  });
};
