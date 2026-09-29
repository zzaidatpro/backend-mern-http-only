export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Vérification que req.user a bien été injecté par authMiddleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Accès non autorisé : profil non identifié.' });
    }

    // 2. Vérification si le rôle de l'utilisateur est autorisé
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé : privilèges insuffisants.' });
    }

    next();
  };
};