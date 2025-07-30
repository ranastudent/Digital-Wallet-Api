import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from './user.model';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/Apperror';
import { JwtPayload } from 'jsonwebtoken';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.status(httpStatus.OK).json({ success: true, data: users });
});

export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Only allow if the user is accessing their own info
  const loggedInUserId = (req.user as JwtPayload)?._id;

  if (id !== loggedInUserId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this user');
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).json({ success: true, data: user });
});
