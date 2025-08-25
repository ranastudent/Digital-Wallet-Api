"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const admin_route_1 = require("../modules/admin/admin.route");
const settings_route_1 = require("../modules/settings/settings.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = express_1.default.Router();
// All route registrations
exports.router.use('/auth', auth_route_1.AuthRoutes);
exports.router.use('/wallets', wallet_route_1.WalletRoutes);
exports.router.use('/transactions', transaction_route_1.TransactionRoutes);
exports.router.use('/admin', admin_route_1.AdminRoutes);
exports.router.use('/user', user_route_1.UserRoutes);
exports.router.use('/settings', settings_route_1.SettingsRoutes);
