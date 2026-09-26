import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import todoRoutes from './routes/todosRoute.js';

const app = express();
app.use(cors({
  origin: 'https://frontend-todo-zaidat.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// test sur vercel pour vérifier si le serveur backend fonctionne correctement :
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Le serveur Backend Todo fonctionne parfaitement !',
    status: 'OK'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

export default app;