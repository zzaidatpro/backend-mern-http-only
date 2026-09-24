import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
import mongoose from 'mongoose';


const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
// Vérification des variables d'environnement critiques avant de démarrer l'application
if (missingEnvVars.length > 0) {
  console.error(`Erreur critique : Variable(s) d'environnement manquante(s) : ${missingEnvVars.join(', ')}`);
  console.error('Veuillez vérifier votre fichier .env à la racine du projet.');
  process.exit(1); // Arrêt propre du processus avec un message clair
}

// Importation de app.js uniquement APRÈS la vérification des variables
import app from './app.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  });