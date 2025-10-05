import { Request, Response, NextFunction } from 'express';
import { MongooseError } from 'mongoose';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError | MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
