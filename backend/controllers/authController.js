'use strict';
const { inscrire, connecter } = require('../services/authService');

const inscription = async (req, res) => {
  const investisseur = await inscrire(req.body);
  res.status(201).json({ 
    message: 'Compte créé avec succès', 
    investisseur 
  });
};

const connexion = async (req, res) => {
  const { token, investisseur } = await connecter(req.body);
  res.status(200).json({ token, investisseur });
};

module.exports = { inscription, connexion };