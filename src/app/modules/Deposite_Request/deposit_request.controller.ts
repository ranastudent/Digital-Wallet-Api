import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/Apperror';
import { DepositRequest } from './depositRequest.model';
import { TransactionService } from '../transaction/transaction.service';
import { User } from '../user/user.model';

export const DepositRequestController = {
  // ✅ User creates deposit request
  createRequest: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { amount, phoneNumber } = req.body;

    if (!amount || !phoneNumber) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Amount and phone number required');
    }

    const request = await DepositRequest.create({
      user: userId,
      amount,
      phoneNumber,
      status: 'pending',
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Deposit request submitted successfully',
      data: request,
    });
  }),

  // ✅ Agent views all pending requests
  getPendingRequests: catchAsync(async (req: Request, res: Response) => {
    const requests = await DepositRequest.find({ status: 'pending' }).populate('user', 'name phoneNumber');
    res.status(httpStatus.OK).json({
      success: true,
      data: requests,
    });
  }),

  // ✅ Agent approves request and triggers cash-in
approveRequest: catchAsync(async (req: Request, res: Response) => {
  // ✅ Ensure req.user exists
  if (!req.user?._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Agent not authenticated');
  }
  const agentId = req.user._id;

  const { requestId } = req.params;

  const request = await DepositRequest.findById(requestId);
  if (!request) throw new AppError(httpStatus.NOT_FOUND, 'Deposit request not found');

  const user = await User.findOne({ phoneNumber: request.phoneNumber });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  // Trigger cash-in
  const { transaction, currentBalance } = await TransactionService.cashInByAgent(
    agentId.toString(), // ✅ now safe
    request.phoneNumber,
    request.amount
  );

  // Mark request as approved
  request.status = 'approved';
  request.processedBy = agentId;
  request.processedAt = new Date();
  await request.save();

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Deposit request approved and cash-in completed',
    data: { request, transaction, currentBalance },
  });
}),


  // ✅ Agent rejects request
  rejectRequest: catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const request = await DepositRequest.findById(requestId);
    if (!request) throw new AppError(httpStatus.NOT_FOUND, 'Deposit request not found');

    request.status = 'rejected';
    request.processedAt = new Date();
    await request.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Deposit request rejected',
      data: request,
    });
  }),
};
