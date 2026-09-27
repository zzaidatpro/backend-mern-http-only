import express from 'express';
import { register, login, logout, getMe, getAllUsers, deleteUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/rbac.js';


const router = express.Router();
router.get('/', (req, res) => {
  return res.status(200).json({ message: 'API Auth opérationnelle.' });
});

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.get('/user/getAllUsers', authMiddleware, checkRole('admin'), getAllUsers);
router.delete('/user/deleteAllUsers/:id', authMiddleware, checkRole('admin'), deleteUser);


export default router;