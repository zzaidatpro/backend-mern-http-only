import express from 'express';
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} from '../controllers/todoController.js';
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

// 1. Authentification globale : extrait le token httpOnly et définit req.user
router.use(authMiddleware);

// 2. Routes CRUD protégées 
router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;