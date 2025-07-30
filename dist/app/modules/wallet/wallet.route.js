"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get('/my-wallet', (0, checkAuth_1.checkAuth)([user_interface_1.Role.user, user_interface_1.Role.admin, user_interface_1.Role.agent]), wallet_controller_1.WalletController.getMyWallet);
router.get('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.admin), wallet_controller_1.WalletController.getWalletById); // admin only
exports.WalletRoutes = router;
