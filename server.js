import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';

// Cache de connexion pour le Serverless (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Export de connectDB pour réutilisation si besoin
export async function connectDB() {
  if (cached.conn) return cached.conn;

  // Utilise MONGODB_URI (fourni par Vercel Storage) ou MONGO_URI
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error("La variable d'environnement MONGODB_URI est introuvable.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false, // Désactive le buffering indéfini
        serverSelectionTimeoutMS: 5000, // Timeout rapide de 5s pour éviter le blocage Vercel (10s)
      })
      .then((mongooseInstance) => {
        console.log('Connecté à MongoDB Atlas via Vercel Storage');
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

// Middleware Express exécuté sur chaque requête
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Échec de la connexion BDD dans le middleware:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Impossible de se connecter à la base de données.',
      error: error.message
    });
  }
});

// N'exécuter app.listen() qu'en environnement local
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Serveur local démarré sur le port ${PORT}`));
  }).catch((err) => {
    console.error('Erreur lors du démarrage du serveur local:', err);
  });
}

export default app;