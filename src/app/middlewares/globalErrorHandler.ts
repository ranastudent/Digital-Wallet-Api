// src/app/middlewares/globalErrorHandler.ts

import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import AppError from '../utils/Apperror';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Default values
  let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong!';
  let errorDetails: unknown = {};

  // If it's an AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = {
      stack: err.stack,
    };
  } else if (err.name === 'ValidationError') {
    // Optional: for Mongoose validation errors
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
  } else if (err.name === 'CastError') {
    // Optional: invalid MongoDB ObjectId
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { errorDetails }),
  });
};
