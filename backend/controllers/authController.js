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
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    const result = await connecter({ email, mot_de_passe });
    res.json({
      message: 'Connexion réussie',
      token: result.token,
      user: result.user,           // ← unified, plus "investisseur"
    });
  } catch (err) {
    console.error('💥 Erreur serveur :', err);
    res.status(401).json({ message: err.message });
  }
};

module.exports = { inscription, connexion };