'use strict';
const jwt = require('jsonwebtoken');

module.exports = (roleRequis = null) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que le compte n'est pas archivé
    if (decoded.statut === 'archive') {
      return res.status(403).json({ success: false, message: 'Ce compte a été désactivé, contactez BCX Finance' });
    }

    // Si un rôle est requis, on vérifie
    if (roleRequis && decoded.role !== roleRequis) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    req.investisseur = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
};