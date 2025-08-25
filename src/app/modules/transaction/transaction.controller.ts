import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";

export const TransactionController = {
  addMoney: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.addMoney(
      userId as string,
      amount
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Add money successful",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  withdrawMoney: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { amount } = req.body;

    const { transaction, currentBalance } =
      await TransactionService.withdrawMoney(userId as string, amount);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        ...transaction.toObject(),
        currentBalance,
      },
    });
  }),

  sendMoney: catchAsync(async (req: Request, res: Response) => {
    const senderId = req.user?._id;
    const { recipientPhone, amount } = req.body;

    const { transaction, currentBalance } = await TransactionService.sendMoney(
      senderId as string,
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

  getTransactionHistory: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const role = req.user?.role;

    const transactions = await TransactionService.getTransactionHistory(
      userId as string,
      role as string
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Transaction history retrieved successfully",
      data: transactions,
    });
  }),

  cashInByAgent: catchAsync(async (req: Request, res: Response) => {
    const agentId = req.user?._id;
    const { recipientPhone, amount } = req.body;

    const { transaction, currentBalance } =
      await TransactionService.cashInByAgent(
        agentId as string,
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

  cashOutByAgent: catchAsync(async (req: Request, res: Response) => {
    const agentId = req.user?._id;
    const { recipientPhone, amount } = req.body;

    const { transaction, currentBalance } =
      await TransactionService.cashOutByAgent(
        agentId as string,
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

  getAgentCommissionHistory: catchAsync(async (req, res) => {
    const agentId = req.user?._id;
    const result = await TransactionService.getAgentCommissions(
      agentId as string
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  // ✅ Updated: no longer uses req.params.id, uses req.user._id instead
  getUserTransactions: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const transactions = await TransactionService.getTransactionsByUserId(
      userId as string
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  }),
};
