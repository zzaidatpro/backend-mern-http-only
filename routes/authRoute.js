import express from 'express';
import { 
  register, 
  login,
  logout, 
  getAllUsers, 
  deleteUser,
  updateUser,
  getUserById,
  addUser,
  homePage } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';


const router = express.Router();
router.get('/', (req, res) => {
  return res.status(200).json({ message: 'API Auth opérationnelle.' });
});


router.get('/test', (req, res) => {
  return res.status(200).json({ message: 'Test réussi.' });
});

router.get('/home', homePage);
router.post('/register', register);
router.post('/login', login);

router.post('/logout', authMiddleware, logout);
router.put('/user/updateUser/:id', authMiddleware, updateUser);
router.get('/user/getUserById/:id', authMiddleware, getUserById);
router.post('/user/addUser', authMiddleware, addUser);
router.get('/user/getAllUsers', authMiddleware, getAllUsers);
router.delete('/user/deleteAllUsers/:id', authMiddleware, deleteUser);


export default router;