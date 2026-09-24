import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  // 1. Récupération du token depuis les cookies
  const token = req.cookies?.token

  // 2. Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, jeton manquant' });
  }

  try {
    // 3.  Vérification du JWT avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Injecte les données décodées (ex: { id: "..." }) dans req.user
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('authMiddleware error:', err.message);
    return res.status(401).json({ message: 'Jeton invalide ou expiré' });
  }
}