import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Démarrer le serveur HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });

    // 2. Tenter la connexion à la base de données
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI n'est pas définie dans le fichier .env !");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
  }
};

startServer();