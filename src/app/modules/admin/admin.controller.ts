// src/app/modules/admin/admin.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from '../transaction/transaction.model';
import AppError from '../../utils/Apperror';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");

  const usersWithBlock = users.map((u) => ({
    ...u.toObject(),
    isBlocked: u.isBlocked ?? false, // ensure boolean always returned
  }));

  res.status(httpStatus.OK).json({
    success: true,
    message: "All users fetched successfully",
    data: usersWithBlock,
  });
});


export const getAllAgents = catchAsync(async (req: Request, res: Response) => {
  const agents = await User.find({ role: 'agent'  }).select('-password');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'All agents fetched successfully',
    data: agents,
  });
});

export const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const wallets = await Wallet.find().populate('user', 'name phoneNumber role');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'All wallets fetched successfully',
    data: wallets,
  });
});

export const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await Transaction.find()
    .populate('from', 'user')
    .populate('to', 'user')
    .populate('agent', 'name phoneNumber') // optional, if agent field exists
    .sort({ createdAt: -1 });

  res.status(httpStatus.OK).json({
    success: true,
    message: 'All transactions fetched successfully',
    data: transactions,
  });
});

export const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wallet = await Wallet.findByIdAndUpdate(walletId, { isBlocked: true }, { new: true });

  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Wallet blocked successfully',
    data: wallet,
  });
});

export const unblockWallet = catchAsync(async (req: Request, res: Response) => {
  const { walletId } = req.params;
  const wallet = await Wallet.findByIdAndUpdate(walletId, { isBlocked: false }, { new: true });

  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Wallet unblocked successfully',
    data: wallet,
  });
});

// ✅ Approve Agent
export const approveAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const agent = await User.findOneAndUpdate(
    { _id: id, role: 'agent' },
    { isAgentApproved: true },
    { new: true }
  ).select('-password');

  if (!agent) throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Agent approved successfully',
    data: agent,
  });
});

// ✅ Suspend Agent
export const suspendAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const agent = await User.findOneAndUpdate(
    { _id: id, role: 'agent' },
    { isAgentApproved: false },
    { new: true }
  ).select('-password');

  if (!agent) throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Agent suspended successfully',
    data: agent,
  });
});

export const promoteUserToAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the user with role 'user' and update their role to 'agent'
  const user = await User.findOneAndUpdate(
    { _id: id, role: 'user' },
    { role: 'agent', isAgentApproved: true }, // Newly promoted agents probably need approval
    { new: true }
  ).select('-password');

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found or already an agent');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'User promoted to agent successfully',
    data: user,
  });
});

export const demoteAgentToUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the agent and update their role to user
  const agent = await User.findOneAndUpdate(
    { _id: id, role: 'agent' },
    { role: 'user', isAgentApproved: false },
    { new: true }
  ).select('-password');

  if (!agent) throw new AppError(httpStatus.NOT_FOUND, 'Agent not found or already a user');

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Agent demoted to user successfully',
    data: agent,
  });
});

// ✅ Block User
export const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  ).select("-password");

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  res.status(httpStatus.OK).json({
    success: true,
    message: "User blocked successfully",
    data: {
      ...user.toObject(),
      isBlocked: true, // ensure always included
    },
  });
});

// ✅ Unblock User
export const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  ).select("-password");

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  res.status(httpStatus.OK).json({
    success: true,
    message: "User unblocked successfully",
    data: {
      ...user.toObject(),
      isBlocked: false, // ensure always included
    },
  });
});








