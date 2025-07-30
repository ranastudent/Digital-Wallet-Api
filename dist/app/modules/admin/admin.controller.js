"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoteAgentToUser = exports.promoteUserToAgent = exports.suspendAgent = exports.approveAgent = exports.unblockWallet = exports.blockWallet = exports.getAllTransactions = exports.getAllWallets = exports.getAllAgents = exports.getAllUsers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const Apperror_1 = __importDefault(require("../../utils/Apperror"));
exports.getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await user_model_1.User.find().select('-password'); // exclude password
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'All users fetched successfully',
        data: users,
    });
});
exports.getAllAgents = (0, catchAsync_1.default)(async (req, res) => {
    const agents = await user_model_1.User.find({ role: 'agent' }).select('-password');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'All agents fetched successfully',
        data: agents,
    });
});
exports.getAllWallets = (0, catchAsync_1.default)(async (req, res) => {
    const wallets = await wallet_model_1.Wallet.find().populate('user', 'name phoneNumber role');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'All wallets fetched successfully',
        data: wallets,
    });
});
exports.getAllTransactions = (0, catchAsync_1.default)(async (req, res) => {
    const transactions = await transaction_model_1.Transaction.find()
        .populate('from', 'user')
        .populate('to', 'user')
        .populate('agent', 'name phoneNumber') // optional, if agent field exists
        .sort({ createdAt: -1 });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'All transactions fetched successfully',
        data: transactions,
    });
});
exports.blockWallet = (0, catchAsync_1.default)(async (req, res) => {
    const { walletId } = req.params;
    const wallet = await wallet_model_1.Wallet.findByIdAndUpdate(walletId, { isBlocked: true }, { new: true });
    if (!wallet)
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'Wallet not found');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Wallet blocked successfully',
        data: wallet,
    });
});
exports.unblockWallet = (0, catchAsync_1.default)(async (req, res) => {
    const { walletId } = req.params;
    const wallet = await wallet_model_1.Wallet.findByIdAndUpdate(walletId, { isBlocked: false }, { new: true });
    if (!wallet)
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'Wallet not found');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Wallet unblocked successfully',
        data: wallet,
    });
});
// ✅ Approve Agent
exports.approveAgent = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const agent = await user_model_1.User.findOneAndUpdate({ _id: id, role: 'agent' }, { isAgentApproved: true }, { new: true }).select('-password');
    if (!agent)
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'Agent not found');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Agent approved successfully',
        data: agent,
    });
});
// ✅ Suspend Agent
exports.suspendAgent = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const agent = await user_model_1.User.findOneAndUpdate({ _id: id, role: 'agent' }, { isAgentApproved: false }, { new: true }).select('-password');
    if (!agent)
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'Agent not found');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Agent suspended successfully',
        data: agent,
    });
});
exports.promoteUserToAgent = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    // Find the user with role 'user' and update their role to 'agent'
    const user = await user_model_1.User.findOneAndUpdate({ _id: id, role: 'user' }, { role: 'agent', isAgentApproved: true }, // Newly promoted agents probably need approval
    { new: true }).select('-password');
    if (!user)
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'User not found or already an agent');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'User promoted to agent successfully',
        data: user,
    });
});
exports.demoteAgentToUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    // Find the agent and update their role to user
    const agent = await user_model_1.User.findOneAndUpdate({ _id: id, role: 'agent' }, { role: 'user', isAgentApproved: false }, { new: true }).select('-password');
    if (!agent)
        throw new Apperror_1.default(http_status_1.default.NOT_FOUND, 'Agent not found or already a user');
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Agent demoted to user successfully',
        data: agent,
    });
});
