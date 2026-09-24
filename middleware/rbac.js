export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // 1. Vérification de l'authentification
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    // 2. Vérification du rôle d'administrateur
    if (req.user.role === 'admin') {
      return next();
    }

    // 3. Vérification des permissions spécifiques
    if (Array.isArray(req.user.permissions) && req.user.permissions.includes(requiredPermission)) {
      return next();
    }

     return res.status(403).json({
      message: `Accès refusé : Droits insuffisants (${requiredPermission} requis).`,
    });
  };
};