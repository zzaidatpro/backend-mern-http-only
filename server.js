import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';

//probelem dns : utilisation de l'ia 

// 1. Gestion du cache de connexion pour le Serverless (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => {
      console.log('Connecté à MongoDB Atlas');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Erreur de connexion MongoDB:', e.message);
    throw e;
  }

  return cached.conn;
}

// 2. Middleware pour s'assurer de la connexion avant chaque requête sur Vercel
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// 3. N'exécuter app.listen() QUE si on est en local (hors Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Serveur local démarré sur le port ${PORT}`));
  });
}

export default app;