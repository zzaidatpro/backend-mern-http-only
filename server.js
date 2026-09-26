import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

export default app;