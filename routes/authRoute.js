import express from 'express';
import { register, login, logout, getMe, getAllUsers, deleteUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { checkPermission } from '../middleware/rbac.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.get('/user/getAllUsers', authMiddleware, checkPermission('read:user'), getAllUsers);
router.delete('/user/deleteAllUsers/:id', authMiddleware, checkPermission('delete:user'), deleteUser);


export default router;