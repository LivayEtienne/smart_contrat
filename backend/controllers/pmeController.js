'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PME } = require('../models');
const {
  inscrirePME,
  ajouterTransaction,
  getDashboard,
  calculerScoreBCX,
  getRapportMensuel
} = require('../services/pmeService');

// ── POST /api/pme/inscription ──────────────────────────────────
const inscription = async (req, res) => {
  try {
    const { nom, secteur, email, telephone, mot_de_passe } = req.body;
    if (!nom || !secteur || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Champs requis : nom, secteur, email, mot_de_passe' });
    }
    const pme = await inscrirePME({ nom, secteur, email, telephone, mot_de_passe });
    const token = jwt.sign(
      { id: pme.id, email: pme.email, role: 'pme' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'Compte PME créé avec succès',
      token,
      pme: { id: pme.id, nom: pme.nom, secteur: pme.secteur, email: pme.email }
    });
  } catch (err) {
    console.error('❌ [pmeController] inscription :', err.message);
    res.status(400).json({ message: err.message });
  }
};

// ── POST /api/pme/connexion ────────────────────────────────────
const connexion = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    const pme = await PME.findOne({ where: { email } });
    if (!pme) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const ok = await bcrypt.compare(mot_de_passe, pme.mot_de_passe_hash);
    if (!ok) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    if (pme.statut === 'archive') {
      return res.status(403).json({ message: 'Compte PME désactivé' });
    }

    const token = jwt.sign(
      { id: pme.id, email: pme.email, role: 'pme' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Connexion réussie',
      token,
      pme: { id: pme.id, nom: pme.nom, secteur: pme.secteur, email: pme.email }
    });
  } catch (err) {
    console.error('❌ [pmeController] connexion :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ── GET /api/pme/dashboard ─────────────────────────────────────
const dashboard = async (req, res) => {
  try {
    const data = await getDashboard(req.pme.id);
    res.json(data);
  } catch (err) {
    console.error('❌ [pmeController] dashboard :', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/pme/transactions ─────────────────────────────────
const nouvelleTransaction = async (req, res) => {
  try {
    const { type, montant, description, date } = req.body;
    if (!type || !montant) {
      return res.status(400).json({ message: 'Champs requis : type, montant' });
    }
    const transaction = await ajouterTransaction({
      pme_id: req.pme.id,
      type,
      montant,
      description,
      date
    });
    res.status(201).json({ message: 'Transaction enregistrée', transaction });
  } catch (err) {
    console.error('❌ [pmeController] nouvelleTransaction :', err.message);
    res.status(400).json({ message: err.message });
  }
};

// ── GET /api/pme/score ─────────────────────────────────────────
const scoreBCX = async (req, res) => {
  try {
    const score = await calculerScoreBCX(req.pme.id);
    res.json(score);
  } catch (err) {
    console.error('❌ [pmeController] scoreBCX :', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/pme/rapport-pdf ───────────────────────────────────
// Retourne les données JSON — le frontend (Mohamadou) génère le PDF avec jspdf
const rapportPDF = async (req, res) => {
  try {
    const annee = parseInt(req.query.annee) || new Date().getFullYear();
    const mois = parseInt(req.query.mois) || new Date().getMonth() + 1;
    const rapport = await getRapportMensuel(req.pme.id, annee, mois);
    res.json(rapport);
  } catch (err) {
    console.error('❌ [pmeController] rapportPDF :', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { inscription, connexion, dashboard, nouvelleTransaction, scoreBCX, rapportPDF };
