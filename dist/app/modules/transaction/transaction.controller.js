"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const transaction_service_1 = require("./transaction.service");
exports.TransactionController = {
    addMoney: (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user?._id;
        const { amount } = req.body;
        const { transaction, currentBalance } = await transaction_service_1.TransactionService.addMoney(userId, amount);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Add money successful",
            data: {
                ...transaction.toObject(),
                currentBalance,
            },
        });
    }),
    withdrawMoney: (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user?._id;
        const { amount } = req.body;
        const { transaction, currentBalance } = await transaction_service_1.TransactionService.withdrawMoney(userId, amount);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Withdrawal successful",
            data: {
                ...transaction.toObject(),
                currentBalance,
            },
        });
    }),
    sendMoney: (0, catchAsync_1.default)(async (req, res) => {
        const senderId = req.user?._id;
        const { recipientPhone, amount } = req.body;
        const { transaction, currentBalance } = await transaction_service_1.TransactionService.sendMoney(senderId, recipientPhone, amount);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Money sent successfully",
            data: {
                ...transaction.toObject(),
                currentBalance,
            },
        });
    }),
    getTransactionHistory: (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user?._id;
        const role = req.user?.role;
        const transactions = await transaction_service_1.TransactionService.getTransactionHistory(userId, role);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Transaction history retrieved successfully",
            data: transactions,
        });
    }),
    cashInByAgent: (0, catchAsync_1.default)(async (req, res) => {
        const agentId = req.user?._id;
        const { recipientPhone, amount } = req.body;
        const { transaction, currentBalance } = await transaction_service_1.TransactionService.cashInByAgent(agentId, recipientPhone, amount);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Cash-in successful",
            data: {
                ...transaction.toObject(),
                currentBalance,
            },
        });
    }),
    cashOutByAgent: (0, catchAsync_1.default)(async (req, res) => {
        const agentId = req.user?._id;
        const { recipientPhone, amount } = req.body;
        const { transaction, currentBalance } = await transaction_service_1.TransactionService.cashOutByAgent(agentId, recipientPhone, amount);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Cash-out successful",
            data: {
                ...transaction.toObject(),
                currentBalance,
            },
        });
    }),
    getAgentCommissionHistory: (0, catchAsync_1.default)(async (req, res) => {
        const agentId = req.user?._id;
        const result = await transaction_service_1.TransactionService.getAgentCommissions(agentId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }),
    // ✅ Updated: no longer uses req.params.id, uses req.user._id instead
    getUserTransactions: (0, catchAsync_1.default)(async (req, res) => {
        const userId = req.user?._id;
        const transactions = await transaction_service_1.TransactionService.getTransactionsByUserId(userId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Transactions retrieved successfully",
            data: transactions,
        });
    }),
};
