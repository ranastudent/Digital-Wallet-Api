// src/app/modules/transaction/transaction.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";

export const TransactionController = {
  // ✅ Add Money
  addMoney: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const { amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.addMoney(userId, amount);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Money added successfully",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  // ✅ Withdraw Money
  withdrawMoney: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const { amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.withdrawMoney(userId, amount);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  // ✅ Send Money
  sendMoney: catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user?._id as string;
    const { recipientPhone, amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.sendMoney(
      senderId,
      recipientPhone,
      amount
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Money sent successfully",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  // ✅ Get Transaction History (Admin / User)
  getTransactionHistory: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const role = req.user?.role as string;

    const transactions = await TransactionService.getTransactionHistory(userId, role);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Transaction history retrieved successfully",
      data: transactions,
    });
  }),

  // ✅ Cash In (Agent)
  cashInByAgent: catchAsync(async (req: Request, res: Response) => {
    const agentId = req.user?._id as string;
    const { recipientPhone, amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.cashInByAgent(
      agentId,
      recipientPhone,
      amount
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Cash-in successful",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  // ✅ Cash Out (Agent)
  cashOutByAgent: catchAsync(async (req: Request, res: Response) => {
    const agentId = req.user?._id as string;
    const { recipientPhone, amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.cashOutByAgent(
      agentId,
      recipientPhone,
      amount
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Cash-out successful",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  // ✅ Agent Commission History
  getAgentCommissionHistory: catchAsync(async (req: Request, res: Response) => {
    const agentId = req.user?._id as string;

    const result = await TransactionService.getAgentCommissions(agentId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Agent commission history retrieved successfully",
      data: result,
    });
  }),

  // ✅ User's Own Transactions
  getUserTransactions: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;

    const transactions = await TransactionService.getTransactionsByUserId(userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "User transactions retrieved successfully",
      data: transactions,
    });
  }),

  // ✅ Latest Transaction of User
  getLatestUserTransaction: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;

    const latestTransaction = await TransactionService.getLatestTransactionByUserId(userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Latest transaction retrieved successfully",
      data: latestTransaction,
    });
  }),
};
