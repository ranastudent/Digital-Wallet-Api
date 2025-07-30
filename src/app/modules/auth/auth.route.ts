import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../utils/validateRequest';
import {
  loginUserSchema,
  registerUserSchema,
} from './auth.validation';

const router = Router();

router.post('/register', validateRequest(registerUserSchema), AuthController.register);
router.post('/login', validateRequest(loginUserSchema), AuthController.login);

export const AuthRoutes = router;
