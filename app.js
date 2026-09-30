import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import todosRoute from './routes/todosRoute.js';

const app = express();

const choixServeur = [ 'http://localhost:5173', process.env.CLIENT_URL,]
app.use(cors({
  origin: (req, res) => {
    if (!req || choixServeur.includes(req)) {
      return res(null, true);
    } 
    return res(new Error('Non alloue par CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],

}));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API success on Vercel!' });
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/todos', todosRoute);

export default app;