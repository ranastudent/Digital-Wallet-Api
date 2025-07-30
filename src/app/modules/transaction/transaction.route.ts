import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post('/add-money', checkAuth([Role.user, Role.admin, Role.agent]), TransactionController.addMoney);

router.post('/withdraw', checkAuth([Role.user, Role.admin, Role.agent]), TransactionController.withdrawMoney);

router.post('/send-money', checkAuth([Role.user, Role.admin, Role.agent]), TransactionController.sendMoney);

router.get(
  '/',
  checkAuth(['admin', 'user', 'agent']),
  TransactionController.getTransactionHistory
);

router.post(
  '/agent/cash-in',
  checkAuth(Role.agent),
  TransactionController.cashInByAgent
);

router.post(
  '/agent/cash-out',
  checkAuth(Role.agent),
  TransactionController.cashOutByAgent
);

router.get('/agent/commissions', checkAuth(Role.agent), TransactionController.getAgentCommissionHistory);





export const TransactionRoutes = router;
