import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import todoRoutes from './routes/todosRoute.js';

const app = express();
app.use(cors({
  origin: 'https://frontend-mern-http-only.vercel.app',

  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

export default app;