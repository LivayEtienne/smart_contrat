'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Investisseur, Compte, PME } = require('../models');

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

  const { mot_de_passe_hash: _, ...investisseurSafe } = investisseur.toJSON();
  return investisseurSafe;
};

const connecter = async ({ email, mot_de_passe }) => {
  // ── 1. Cherche dans la table investisseurs ──────────────────
  const investisseur = await Investisseur.findOne({ where: { email } });

  if (investisseur) {
    if (investisseur.statut === 'archive') {
      throw new Error('Ce compte a été désactivé, contactez BCX Finance');
    }
    const valide = await bcrypt.compare(mot_de_passe, investisseur.mot_de_passe_hash);
    if (!valide) throw new Error('Email ou mot de passe incorrect');

    const token = jwt.sign(
      { id: investisseur.id, email: investisseur.email, niveau: investisseur.niveau, role: investisseur.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { mot_de_passe_hash: _, ...safe } = investisseur.toJSON();
    return { token, user: { ...safe } };
  }

  // ── 2. Sinon cherche dans la table pme ──────────────────────
  const pme = await PME.findOne({ where: { email } });

  if (pme) {
    if (pme.statut === 'archive') {
      throw new Error('Ce compte PME a été désactivé, contactez BCX Finance');
    }
    const valide = await bcrypt.compare(mot_de_passe, pme.mot_de_passe_hash);
    if (!valide) throw new Error('Email ou mot de passe incorrect');

    const token = jwt.sign(
      { id: pme.id, email: pme.email, role: 'pme' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { mot_de_passe_hash: _, ...safe } = pme.toJSON();
    return { token, user: { ...safe, role: 'pme' } };
  }

  // ── 3. Aucun compte trouvé ───────────────────────────────────
  throw new Error('Email ou mot de passe incorrect');
};

module.exports = { inscrire, connecter };