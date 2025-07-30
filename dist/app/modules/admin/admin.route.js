"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
// src/app/modules/admin/admin.route.ts
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = express_1.default.Router();
// Admin-only access
router.get('/users', (0, checkAuth_1.checkAuth)([user_interface_1.Role.admin]), admin_controller_1.getAllUsers);
router.get('/agents', (0, checkAuth_1.checkAuth)([user_interface_1.Role.admin]), admin_controller_1.getAllAgents);
router.get('/wallets', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.getAllWallets);
router.get('/transactions', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.getAllTransactions);
router.patch('/wallets/:walletId/block', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.blockWallet);
router.patch('/wallets/:walletId/unblock', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.unblockWallet);
router.patch('/agents/:id/approve', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.approveAgent);
router.patch('/agents/:id/suspend', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.suspendAgent);
router.patch('/agents/:id/make-agent', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.promoteUserToAgent);
router.patch('/agents/:id/make-user-from-agent', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), admin_controller_1.demoteAgentToUser);
exports.AdminRoutes = router;
