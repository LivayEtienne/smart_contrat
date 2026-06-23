'use strict';

/**
 * Middleware d'authentification PME
 * Vérifie le JWT et injecte req.pme dans la requête
 */

const jwt = require('jsonwebtoken');
const { PME } = require('../models');

const authPME = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant — accès refusé' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'pme') {
      return res.status(403).json({ message: 'Accès réservé aux comptes PME' });
    }

    const pme = await PME.findByPk(decoded.id, {
      attributes: ['id', 'nom', 'secteur', 'email', 'statut']
    });

    if (!pme) return res.status(401).json({ message: 'Compte PME introuvable' });
    if (pme.statut === 'archive') return res.status(403).json({ message: 'Compte PME désactivé' });

    req.pme = pme;
    next();
  } catch (err) {
    console.error('❌ [authPME] :', err.message);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = authPME;
