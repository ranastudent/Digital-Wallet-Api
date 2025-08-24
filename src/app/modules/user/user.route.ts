import express from 'express';
import { getAllUsers, getSingleUser, updateUser } from './user.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from './user.interface';

const router = express.Router();

// ✅ Only admin can get all users
router.get('/', checkAuth(Role.admin), getAllUsers);

// ✅ All authenticated users can get their own user info
router.get('/:id', checkAuth(), getSingleUser);

router.patch("/:id", checkAuth(), updateUser);

export const UserRoutes = router;
