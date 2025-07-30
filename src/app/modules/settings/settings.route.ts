import express from 'express';
import { updateSystemSetting, getSystemSetting } from './settings.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.patch('/', checkAuth(Role.admin), updateSystemSetting); // body: { key, value }
router.get('/:key', getSystemSetting);

export const SettingsRoutes = router;
