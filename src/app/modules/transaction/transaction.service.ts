import httpStatus from "http-status";
import Apperror from "../../utils/Apperror";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "./transaction.model";
import { User } from "../user/user.model";
import { IWallet } from "../wallet/wallet.interface";
import AppError from "../../utils/Apperror";

export const ensureWalletIsActive = (wallet: IWallet) => {
  if (wallet.isBlocked) {
    throw new Apperror(httpStatus.FORBIDDEN, "Wallet is blocked");
  }
};

export const TransactionService = {
  addMoney: async (
    userId: string,
    amount: number,
    overrideTargetWalletId?: string
  ) => {
    if (!amount || amount <= 0) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Invalid top-up amount");
    }

    const wallet = overrideTargetWalletId
      ? await Wallet.findById(overrideTargetWalletId)
      : await Wallet.findOne({ user: userId });

    if (!wallet) throw new Apperror(httpStatus.NOT_FOUND, "Wallet not found");

    ensureWalletIsActive(wallet); // ✅ Now this checks the correct wallet

    wallet.balance += amount;
    await wallet.save();

    const transaction = await Transaction.create({
      from: null,
      to: wallet._id,
      amount,
      type: "add-money",
      status: "success",
    });

    return {
      transaction,
      currentBalance: wallet.balance,
    };
  },

  withdrawMoney: async (userId: string, amount: number) => {
    if (!amount || amount <= 0) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Invalid withdraw amount");
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new Apperror(httpStatus.NOT_FOUND, "Wallet not found");
    ensureWalletIsActive(wallet); // 👈 Add this

    if (wallet.balance < amount) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    wallet.balance -= amount;
    await wallet.save();

    const transaction = await Transaction.create({
      from: wallet._id,
      to: null,
      amount,
      type: "withdraw",
      status: "success",
    });

    return {
      transaction,
      currentBalance: wallet.balance,
    };
  },
  sendMoney: async (
    senderId: string,
    recipientPhone: string,
    amount: number
  ) => {
    if (!amount || amount <= 0) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Invalid amount");
    }

    if (!recipientPhone) {
      throw new Apperror(
        httpStatus.BAD_REQUEST,
        "Recipient phone number is required"
      );
    }

    const senderWallet = await Wallet.findOne({ user: senderId });
    if (!senderWallet)
      throw new Apperror(httpStatus.NOT_FOUND, "Sender wallet not found");

    if (senderWallet.balance < amount) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Step 1: Find recipient user
    const recipientUser = await User.findOne({ phoneNumber: recipientPhone });
    if (!recipientUser) {
      throw new Apperror(httpStatus.NOT_FOUND, "Recipient user not found");
    }

    // Step 2: Find recipient's wallet
    const recipientWallet = await Wallet.findOne({ user: recipientUser._id });
    if (!recipientWallet) {
      throw new Apperror(httpStatus.NOT_FOUND, "Recipient wallet not found");
    }

    ensureWalletIsActive(recipientWallet);
    ensureWalletIsActive(senderWallet);

    // Deduct from sender
    senderWallet.balance -= amount;
    await senderWallet.save();

    // Add to recipient
    recipientWallet.balance += amount;
    await recipientWallet.save();

    const transaction = await Transaction.create({
      from: senderWallet._id,
      to: recipientWallet._id,
      amount,
      type: "send",
      status: "success",
    });

    return {
      transaction,
      currentBalance: senderWallet.balance,
    };
  },

  getTransactionHistory: async (userId: string, role: string) => {
    if (role === "admin") {
      return await Transaction.find()
        .populate("from")
        .populate("to")
        .sort({ createdAt: -1 });
    }

    // For user or agent
    const userWallet = await Wallet.findOne({ user: userId });
    if (!userWallet) {
      throw new Apperror(httpStatus.NOT_FOUND, "Wallet not found");
    }

    const walletId = userWallet._id;

    return await Transaction.find({
      $or: [{ from: walletId }, { to: walletId }],
    })
      .populate("from")
      .populate("to")
      .sort({ createdAt: -1 });
  },

  // src/app/modules/transaction/transaction.service.ts
  cashInByAgent: async (
    agentId: string,
    recipientPhone: string,
    amount: number
  ) => {
    const commission = amount * 0.01;
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const recipient = await User.findOne({ phoneNumber: recipientPhone });
    if (!recipient) throw new Error("Recipient user not found");

    const recipientWallet = await Wallet.findOne({ user: recipient._id });
    if (!recipientWallet) throw new Error("Recipient wallet not found");
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    if (!agent.isAgentApproved) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Agent is not approved or has been suspended"
      );
    }

    ensureWalletIsActive(recipientWallet);
    // ✅ now safely used

    // Update balance
    recipientWallet.balance += amount;
    await recipientWallet.save();

    // Log transaction
    const transaction = await Transaction.create({
      from: agentId,
      to: recipientWallet._id,
      amount,
      type: "cash-in",
      status: "success",
      agent: agentId,
      commission,
    });

    return { transaction, currentBalance: recipientWallet.balance };
  },

  cashOutByAgent: async (
    agentId: string,
    userPhone: string,
    amount: number
  ) => {
    if (amount <= 0) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Invalid amount");
    }

    const recipient = await User.findOne({ phoneNumber: userPhone });
    if (!recipient) throw new Apperror(httpStatus.NOT_FOUND, "User not found");

    const recipientWallet = await Wallet.findOne({ user: recipient._id });
    if (!recipientWallet)
      throw new Apperror(httpStatus.NOT_FOUND, "User wallet not found");

    ensureWalletIsActive(recipientWallet); // ✅ now safe

    if (recipientWallet.balance < amount) {
      throw new Apperror(httpStatus.BAD_REQUEST, "Insufficient user balance");
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    if (!agent.isAgentApproved) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Agent is not approved or has been suspended"
      );
    }

    // Deduct from user's wallet
    recipientWallet.balance -= amount;
    await recipientWallet.save();
    const commission = amount * 0.01;
    // Log transaction
    const transaction = await Transaction.create({
      from: recipientWallet._id,
      to: agentId,
      amount,
      type: "cash-out",
      status: "success",
      agent: agentId,
      commission,
    });

    return {
      transaction,
      currentBalance: recipientWallet.balance,
    };
  },

  getAgentCommissions: async (agentId: string) => {
    const commissionTransactions = await Transaction.find({
      agent: agentId,
      type: { $in: ["cash-in", "cash-out"] },
    }).sort({ createdAt: -1 });

    const totalCommission = commissionTransactions.reduce(
      (sum, txn) => sum + (txn.commission || 0),
      0
    );

    return {
      transactions: commissionTransactions,
      totalCommission,
    };
  },

  getTransactionsByUserId: async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  const walletId = wallet._id;

  return await Transaction.find({
    $or: [{ from: walletId }, { to: walletId }],
  })
    .populate("from")
    .populate("to")
    .sort({ createdAt: -1 });
},

  getLatestTransactionByUserId: async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

    const walletId = wallet._id;

    const latestTransaction = await Transaction.findOne({
      $or: [{ from: walletId }, { to: walletId }],
    })
      .sort({ createdAt: -1, _id: -1 }) // ✅ newest first
      .populate("from")
      .populate("to");

    if (!latestTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, "No transactions found");
    }

    return latestTransaction;
  },


};
