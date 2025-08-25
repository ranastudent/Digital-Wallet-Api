"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const wallet_model_1 = require("./wallet.model");
const mongoose_1 = require("mongoose");
exports.WalletService = {
    getMyWallet: async (userId) => {
        const wallet = await wallet_model_1.Wallet.findOne({ user: new mongoose_1.Types.ObjectId(userId) });
        if (!wallet)
            return null;
        return { balance: wallet.balance, isBlocked: wallet.isBlocked };
    },
    getWalletById: async (walletId) => {
        return await wallet_model_1.Wallet.findById(walletId).populate('user');
    },
};
