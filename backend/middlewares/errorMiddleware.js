'use strict';

const errorHandler = (err, req, res, next) => {
  console.error('💥 Erreur serveur :', err.stack);

  // Si l'erreur a un statusCode, on l'utilise. Sinon, on considère que c'est une erreur métier (400)
  // sauf si c'est une erreur critique de syntaxe/type (500).
  let statusCode = err.statusCode || 400;
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
