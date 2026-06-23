'use strict';

const errorHandler = (err, req, res, next) => {
  console.error('💥 Erreur serveur :', err.stack);

  let statusCode = 400; // Erreur métier par défaut

  // Mapping pour préserver les contrats API sans toucher aux Services
  if (err.message === 'Email ou mot de passe incorrect') statusCode = 401;
  if (err.message === 'Ce compte a été désactivé, contactez BCX Finance') statusCode = 403;
  if (err.message === 'Compte introuvable' || err.message === 'Dépôt introuvable') statusCode = 404;

  if (err.name === 'SequelizeDatabaseError' || err.name === 'TypeError' || err.name === 'ReferenceError') {
    statusCode = 500;
  }

  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;
