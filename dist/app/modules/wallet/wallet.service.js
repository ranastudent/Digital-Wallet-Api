"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const wallet_model_1 = require("./wallet.model");
exports.WalletService = {
    getMyWallet: async (userId) => {
        return await wallet_model_1.Wallet.findOne({ user: userId });
    },
    getWalletById: async (walletId) => {
        return await wallet_model_1.Wallet.findById(walletId).populate('user');
    },
};
