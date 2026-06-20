'use strict';
const { inscrire, connecter } = require('../services/authService');

const inscription = async (req, res) => {
  try {
    const investisseur = await inscrire(req.body);
    res.status(201).json({ 
      message: 'Compte créé avec succès', 
      investisseur 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const connexion = async (req, res) => {
  try {
    const { token, investisseur } = await connecter(req.body);
    res.status(200).json({ token, investisseur });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { inscription, connexion };