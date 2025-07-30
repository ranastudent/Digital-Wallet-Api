"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const wallet_service_1 = require("./wallet.service");
const mongoose_1 = __importDefault(require("mongoose"));
exports.WalletController = {
    getMyWallet: (0, catchAsync_1.default)(async (req, res) => {
        const userId = new mongoose_1.default.Types.ObjectId(req.user.userId);
        const wallet = await wallet_service_1.WalletService.getMyWallet(userId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Wallet fetched successfully",
            data: wallet,
        });
    }),
    getWalletById: (0, catchAsync_1.default)(async (req, res) => {
        const { id } = req.params;
        const wallet = await wallet_service_1.WalletService.getWalletById(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Wallet by ID fetched successfully",
            data: wallet,
        });
    }),
};
