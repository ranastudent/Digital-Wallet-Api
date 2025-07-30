import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import catchAsync from '../../utils/catchAsync';

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.registerUser(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  }),

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthService.loginUser(req.body);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }),
};
