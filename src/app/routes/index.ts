import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { WalletRoutes } from '../modules/wallet/wallet.route'; 
import { TransactionRoutes } from '../modules/transaction/transaction.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { SettingsRoutes } from '../modules/settings/settings.route';

export const router = express.Router();

// All route registrations
router.use('/auth', AuthRoutes);
router.use('/wallets', WalletRoutes); 
router.use('/transactions', TransactionRoutes);
router.use('/admin', AdminRoutes);
router.use('/settings', SettingsRoutes);

