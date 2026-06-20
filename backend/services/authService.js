'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Investisseur, Compte } = require('../models');

const inscrire = async ({ nom, prenom, email, mot_de_passe, telephone, wallet_address, role }) => {
  const existant = await Investisseur.findOne({ where: { email } });
  if (existant) throw new Error('Email déjà utilisé');

  const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

  const investisseur = await Investisseur.create({
    id: uuidv4(),
    nom,
    prenom,
    email,
    mot_de_passe_hash,
    telephone,
    wallet_address,
    niveau: null,
    role: role || 'investisseur',
    statut: 'actif'
  });

  await Compte.create({
    id: uuidv4(),
    investisseur_id: investisseur.id,
    numero_compte: 'BCX-' + Date.now(),
    total_investi_usd: 0,
    total_bcx_tokens: 0
  });

  // Ne jamais retourner le hash du mot de passe
  const { mot_de_passe_hash: _, ...investisseurSafe } = investisseur.toJSON();
  return investisseurSafe;
};

const connecter = async ({ email, mot_de_passe }) => {
  const investisseur = await Investisseur.findOne({ where: { email } });
  if (!investisseur) throw new Error('Email ou mot de passe incorrect');

  // Vérifier le statut du compte
  if (investisseur.statut === 'archive') {
    throw new Error('Ce compte a été désactivé, contactez BCX Finance');
  }

  const valide = await bcrypt.compare(mot_de_passe, investisseur.mot_de_passe_hash);
  if (!valide) throw new Error('Email ou mot de passe incorrect');

  const token = jwt.sign(
    {
      id: investisseur.id,
      email: investisseur.email,
      niveau: investisseur.niveau,
      role: investisseur.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Ne jamais retourner le hash du mot de passe
  const { mot_de_passe_hash: _, ...investisseurSafe } = investisseur.toJSON();
  return { token, investisseur: investisseurSafe };
};

module.exports = { inscrire, connecter };