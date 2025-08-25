import express from 'express';
import { DepositRequestController } from './deposit_request.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

// ✅ Users can create deposit request
router.post('/', checkAuth(Role.user), DepositRequestController.createRequest);

// ✅ Agents can view pending requests
router.get('/pending', checkAuth(Role.agent), DepositRequestController.getPendingRequests);

// ✅ Agents can approve a request (triggers cash-in)
router.post('/approve/:requestId', checkAuth(Role.agent), DepositRequestController.approveRequest);

// ✅ Agents can reject a request
router.post('/reject/:requestId', checkAuth(Role.agent), DepositRequestController.rejectRequest);

export const DepositRequestRoutes = router;
