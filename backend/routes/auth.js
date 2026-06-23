'use strict';
const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { inscription, connexion } = require('../controllers/authController');

const connexionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: { message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/inscription', inscription);
router.post('/connexion', connexionLimiter, connexion);

module.exports = router;