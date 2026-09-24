import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import todoRoutes from './routes/todosRoute.js';


const app = express();
app.use(cors({
  origin: 'http://localhost:5173' || 'https://todo-jwt-mongo.vercel.app/', credentials: true                
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);


export default app;