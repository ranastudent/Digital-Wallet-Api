import httpStatus from "http-status";
import AppError from "../../utils/Apperror";
import { DepositRequest } from "./depositRequest.model";
import { User } from "../user/user.model";
import { TransactionService } from "../transaction/transaction.service";

export class DepositRequestService {
  // User creates a deposit request
  static async createRequest(userId: string, phoneNumber: string, amount: number) {
    const request = await DepositRequest.create({
      user: userId,
      phoneNumber,
      amount,
      status: "pending",
    });
    return request;
  }

  // Agent approves request and triggers cash-in automatically
  static async approveRequest(agentId: string, requestId: string) {
    const request = await DepositRequest.findById(requestId);
    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Deposit request not found");
    }

    if (request.status === "approved") {
      throw new AppError(httpStatus.BAD_REQUEST, "Request already approved");
    }

    // Find the user by phone number
    const user = await User.findOne({ phoneNumber: request.phoneNumber });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "Recipient user not found");
    }

    // Call existing cash-in service
    const cashInResult = await TransactionService.cashInByAgent(
      agentId,
      request.phoneNumber,
      request.amount
    );

    // Update the request status
    request.status = "approved";
    request.processedBy = agentId;
    request.processedAt = new Date();
    await request.save();

    return {
      request,
      cashInResult,
    };
  }

  // Agent views all pending deposit requests
  static async getPendingRequests() {
    return DepositRequest.find({ status: "pending" }).sort({ createdAt: -1 });
  }
}
