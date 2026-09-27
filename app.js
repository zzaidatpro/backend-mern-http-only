import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import todoRoutes from './routes/todosRoute.js';

const app = express();
app.use(express.json());

// Liste des origines autorisées (Local + Production)
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-todo-zaidat.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permet le fonctionnement avec Postman ou requêtes sans origine
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

export default app;