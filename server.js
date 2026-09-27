import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';

// 1. Cache de connexion pour le Serverless (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false, // Désactive la mise en attente des requêtes si non connecté
      })
      .then((mongooseInstance) => {
        console.log('Connecté à MongoDB Atlas');
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // En cas d'échec, on réinitialise la promesse pour réessayer à la prochaine requête
    cached.promise = null;
    console.error('Erreur de connexion MongoDB Atlas:', e.message);
    throw e; // On propage l'erreur pour qu'elle soit interceptée par le middleware
  }

  return cached.conn;
}

// 2. Middleware sécurisé avec gestion d'erreur HTTP 500
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next(); // La BDD est connectée, on passe à la route suivante
  } catch (error) {
    // On intercepte l'erreur et on répond proprement au client
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur : impossible de se connecter à la base de données.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default app;