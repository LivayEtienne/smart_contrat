'use strict';
const { body, validationResult } = require('express-validator');

// Middleware pour vérifier s'il y a des erreurs de validation
const verifierValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn(`🚨 [SECURITY] Échec de validation des entrées sur ${req.url} - IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation des données',
      erreurs: errors.array()
    });
  }
  next();
};

const validateInscription = [
  body('nom').notEmpty().withMessage('Le nom est obligatoire').trim().escape(),
  body('prenom').notEmpty().withMessage('Le prénom est obligatoire').trim().escape(),
  body('email').isEmail().withMessage('Un email valide est obligatoire').normalizeEmail(),
  body('mot_de_passe').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères'),
  verifierValidation
];

const validateConnexion = [
  body('email').isEmail().withMessage('Un email valide est obligatoire').normalizeEmail(),
  body('mot_de_passe').notEmpty().withMessage('Le mot de passe est obligatoire'),
  verifierValidation
];

const validateNouveauDepot = [
  body('montant').isNumeric().withMessage('Le montant doit être un nombre valide'),
  body('devise_origine').isIn(['FCFA', 'USD', 'CRYPTO']).withMessage('Devise invalide'),
  body('voie').isIn(['A', 'B']).withMessage('La voie doit être A ou B'),
  verifierValidation
];

const validateAjoutAyantDroit = [
  body('nom').notEmpty().withMessage('Le nom est obligatoire').trim().escape(),
  body('prenom').notEmpty().withMessage('Le prénom est obligatoire').trim().escape(),
  body('email').isEmail().withMessage('Un email valide est obligatoire').normalizeEmail(),
  body('lien_parente').notEmpty().withMessage('Le lien de parenté est obligatoire').trim().escape(),
  verifierValidation
];

module.exports = {
  validateInscription,
  validateConnexion,
  validateNouveauDepot,
  validateAjoutAyantDroit
};
