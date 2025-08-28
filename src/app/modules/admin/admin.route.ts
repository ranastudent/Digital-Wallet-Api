// src/app/modules/admin/admin.route.ts
import express from 'express';
import { approveAgent, blockUser, blockWallet, demoteAgentToUser, getAllAgents, getAllTransactions, getAllUsers, getAllWallets, promoteUserToAgent, suspendAgent, unblockUser, unblockWallet } from './admin.controller';

import { Role } from '../user/user.interface';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

// Admin-only access
router.get('/users', checkAuth([Role.admin]), getAllUsers);

router.get('/agents', checkAuth([Role.admin]), getAllAgents);

router.get('/wallets', checkAuth([Role.admin]), getAllWallets);

router.get('/transactions', checkAuth([Role.admin], [Role.agent]), getAllTransactions);

router.patch('/wallets/:walletId/block', checkAuth(Role.admin), blockWallet);

router.patch('/wallets/:walletId/unblock', checkAuth(Role.admin), unblockWallet);

router.patch('/agents/:id/approve', checkAuth(Role.admin), approveAgent);

router.patch('/agents/:id/suspend', checkAuth(Role.admin), suspendAgent);

router.patch('/agents/:id/make-agent', checkAuth(Role.admin), promoteUserToAgent);

router.patch('/agents/:id/make-user-from-agent', checkAuth(Role.admin), demoteAgentToUser);

// Block / Unblock User
router.patch('/users/:id/block', checkAuth(Role.admin), blockUser);
router.patch('/users/:id/unblock', checkAuth(Role.admin), unblockUser);


export const AdminRoutes = router;
