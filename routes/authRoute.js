import express from 'express';
//controller :
import { register, login, logout, getProfil
} from '../controllers/authController.js';
import { adminPage, getAllUsers, getUserById, addUser, updateUser, deleteUser
} from '../controllers/adminController.js';
// midleware : 
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js'; //rbac

const router = express.Router();
// Routes publiques
router.get('/', (req, res) => {
  return res.status(200).json({ message: 'reponse API Auth reussie ! ' });});
router.post('/register', register);
router.post('/login', login);

// Routes protégées pour utilisateurs connectés
router.post('/logout', authMiddleware, logout);

// Routes admin 
router.get('/adminPage', authMiddleware, checkRole('admin'),adminPage);
router.get('/me', authMiddleware, getProfil);
router.get('/user/getAllUsers', authMiddleware, checkRole('admin'), getAllUsers);
router.get('/user/getUserById/:id', authMiddleware, checkRole('admin'), getUserById);
router.post('/user/addUser', authMiddleware, checkRole('admin'), addUser);
router.put('/user/updateUser/:id', authMiddleware, checkRole('admin'), updateUser);
router.delete('/user/deleteUser/:id', authMiddleware, checkRole('admin'), deleteUser);

export default router;