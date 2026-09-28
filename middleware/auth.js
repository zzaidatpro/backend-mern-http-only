import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, jeton manquant' });
  }
  try {
   console.log("Cookies reçus :", req.cookies);
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('authMiddleware error:', err.message);
    return res.status(401).json({ message: 'Jeton invalide ou expiré' });
  }
}