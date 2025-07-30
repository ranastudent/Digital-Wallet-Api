import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import Apperror from '../utils/Apperror';

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new Apperror(httpStatus.FORBIDDEN, 'Forbidden access');
    }
    next();
  };
