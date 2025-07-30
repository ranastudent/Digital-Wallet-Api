import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.get('/my-wallet', checkAuth(Role.user, Role.admin, Role.agent), WalletController.getMyWallet);
router.get('/:id', checkAuth(Role.admin), WalletController.getWalletById); // admin only

export const WalletRoutes = router;
