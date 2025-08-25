import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { WalletRoutes } from '../modules/wallet/wallet.route'; 
import { TransactionRoutes } from '../modules/transaction/transaction.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { SettingsRoutes } from '../modules/settings/settings.route';
import { UserRoutes } from '../modules/user/user.route';
import { DepositRequestRoutes } from '../modules/Deposite_Request/deposit_request.route';

export const router = express.Router();

// All route registrations
router.use('/auth', AuthRoutes);
router.use('/wallets', WalletRoutes); 
router.use('/transactions', TransactionRoutes);
router.use('/admin', AdminRoutes);
router.use('/user', UserRoutes)
router.use('/settings', SettingsRoutes);
router.use('/deposite-request', DepositRequestRoutes);

