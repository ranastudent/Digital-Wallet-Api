"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = exports.ensureWalletIsActive = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Apperror_1 = __importDefault(require("../../utils/Apperror"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("./transaction.model");
const user_model_1 = require("../user/user.model");
const Apperror_2 = __importDefault(require("../../utils/Apperror"));
const ensureWalletIsActive = (wallet) => {
    if (wallet.isBlocked) {
        throw new Apperror_1.default(http_status_1.default.FORBIDDEN, "Wallet is blocked");
    }
};
exports.ensureWalletIsActive = ensureWalletIsActive;
exports.TransactionService = {
    addMoney: async (userId, amount, overrideTargetWalletId) => {
        if (!amount || amount <= 0) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Invalid top-up amount");
        }
        const wallet = overrideTargetWalletId
            ? await wallet_model_1.Wallet.findById(overrideTargetWalletId)
            : await wallet_model_1.Wallet.findOne({ user: userId });
        if (!wallet)
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "Wallet not found");
        (0, exports.ensureWalletIsActive)(wallet); // ✅ Now this checks the correct wallet
        wallet.balance += amount;
        await wallet.save();
        const transaction = await transaction_model_1.Transaction.create({
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
    withdrawMoney: async (userId, amount) => {
        if (!amount || amount <= 0) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Invalid withdraw amount");
        }
        const wallet = await wallet_model_1.Wallet.findOne({ user: userId });
        if (!wallet)
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "Wallet not found");
        (0, exports.ensureWalletIsActive)(wallet); // 👈 Add this
        if (wallet.balance < amount) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
        }
        wallet.balance -= amount;
        await wallet.save();
        const transaction = await transaction_model_1.Transaction.create({
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
    sendMoney: async (senderId, recipientPhone, amount) => {
        if (!amount || amount <= 0) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Invalid amount");
        }
        if (!recipientPhone) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Recipient phone number is required");
        }
        const senderWallet = await wallet_model_1.Wallet.findOne({ user: senderId });
        if (!senderWallet)
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "Sender wallet not found");
        if (senderWallet.balance < amount) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
        }
        // Step 1: Find recipient user
        const recipientUser = await user_model_1.User.findOne({ phoneNumber: recipientPhone });
        if (!recipientUser) {
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "Recipient user not found");
        }
        // Step 2: Find recipient's wallet
        const recipientWallet = await wallet_model_1.Wallet.findOne({ user: recipientUser._id });
        if (!recipientWallet) {
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "Recipient wallet not found");
        }
        (0, exports.ensureWalletIsActive)(recipientWallet);
        (0, exports.ensureWalletIsActive)(senderWallet);
        // Deduct from sender
        senderWallet.balance -= amount;
        await senderWallet.save();
        // Add to recipient
        recipientWallet.balance += amount;
        await recipientWallet.save();
        const transaction = await transaction_model_1.Transaction.create({
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
    getTransactionHistory: async (userId, role) => {
        if (role === "admin") {
            return await transaction_model_1.Transaction.find()
                .populate("from")
                .populate("to")
                .sort({ createdAt: -1 });
        }
        // For user or agent
        const userWallet = await wallet_model_1.Wallet.findOne({ user: userId });
        if (!userWallet) {
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "Wallet not found");
        }
        const walletId = userWallet._id;
        return await transaction_model_1.Transaction.find({
            $or: [{ from: walletId }, { to: walletId }],
        })
            .populate("from")
            .populate("to")
            .sort({ createdAt: -1 });
    },
    // src/app/modules/transaction/transaction.service.ts
    cashInByAgent: async (agentId, recipientPhone, amount) => {
        const commission = amount * 0.01;
        if (amount <= 0)
            throw new Error("Amount must be greater than 0");
        const recipient = await user_model_1.User.findOne({ phoneNumber: recipientPhone });
        if (!recipient)
            throw new Error("Recipient user not found");
        const recipientWallet = await wallet_model_1.Wallet.findOne({ user: recipient._id });
        if (!recipientWallet)
            throw new Error("Recipient wallet not found");
        const agent = await user_model_1.User.findById(agentId);
        if (!agent || agent.role !== "agent") {
            throw new Apperror_2.default(http_status_1.default.NOT_FOUND, "Agent not found");
        }
        if (!agent.isAgentApproved) {
            throw new Apperror_2.default(http_status_1.default.FORBIDDEN, "Agent is not approved or has been suspended");
        }
        (0, exports.ensureWalletIsActive)(recipientWallet);
        // ✅ now safely used
        // Update balance
        recipientWallet.balance += amount;
        await recipientWallet.save();
        // Log transaction
        const transaction = await transaction_model_1.Transaction.create({
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
    cashOutByAgent: async (agentId, userPhone, amount) => {
        if (amount <= 0) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Invalid amount");
        }
        const recipient = await user_model_1.User.findOne({ phoneNumber: userPhone });
        if (!recipient)
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "User not found");
        const recipientWallet = await wallet_model_1.Wallet.findOne({ user: recipient._id });
        if (!recipientWallet)
            throw new Apperror_1.default(http_status_1.default.NOT_FOUND, "User wallet not found");
        (0, exports.ensureWalletIsActive)(recipientWallet); // ✅ now safe
        if (recipientWallet.balance < amount) {
            throw new Apperror_1.default(http_status_1.default.BAD_REQUEST, "Insufficient user balance");
        }
        const agent = await user_model_1.User.findById(agentId);
        if (!agent || agent.role !== "agent") {
            throw new Apperror_2.default(http_status_1.default.NOT_FOUND, "Agent not found");
        }
        if (!agent.isAgentApproved) {
            throw new Apperror_2.default(http_status_1.default.FORBIDDEN, "Agent is not approved or has been suspended");
        }
        // Deduct from user's wallet
        recipientWallet.balance -= amount;
        await recipientWallet.save();
        const commission = amount * 0.01;
        // Log transaction
        const transaction = await transaction_model_1.Transaction.create({
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
    getAgentCommissions: async (agentId) => {
        const commissionTransactions = await transaction_model_1.Transaction.find({
            agent: agentId,
            type: { $in: ["cash-in", "cash-out"] },
        }).sort({ createdAt: -1 });
        const totalCommission = commissionTransactions.reduce((sum, txn) => sum + (txn.commission || 0), 0);
        return {
            transactions: commissionTransactions,
            totalCommission,
        };
    },
};
