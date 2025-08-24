import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from './user.model';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/Apperror';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcrypt";

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

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const loggedInUserId = (req.user as JwtPayload)?._id;
  const role = (req.user as JwtPayload)?.role;

  // Only allow if user is updating themselves OR admin is updating anyone
  if (id !== loggedInUserId && role !== "admin") {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this user");
  }

  const { name, phoneNumber, password } = req.body;

  const updateData: Partial<{ name: string; phoneNumber: string; password: string }> = {};
  if (name) updateData.name = name;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updateData.password = hashed;
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});
