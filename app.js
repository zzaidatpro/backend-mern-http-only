import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import todosRoute from './routes/todosRoute.js';

const app = express();

const choixServeur = ['http://localhost:5173', 'https://frontend-todo-zaidat.vercel.app'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origine (comme Postman) ou les origines autorisées
      if (!origin || choixServeur.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Non alloué par CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Middleware pour garantir la connexion DB sur Vercel Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Erreur de connexion à la base de données.' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API success on Vercel!' });
});

app.use('/api/auth', authRoute);
app.use('/api/todos', todosRoute);

export default app;