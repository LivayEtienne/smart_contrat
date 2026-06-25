'use strict';

/**
 * pmeService.js — Logique métier du module PME
 * Groupe 1 — Parfait Eric Yao — BCX Finance
 *
 * Score BCX : indicateur de crédibilité financière (0-100)
 * Basé sur : régularité des transactions, ratio revenus/dépenses, volume, ancienneté
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { PME, TransactionPME } = require('../models');
const { Op } = require('sequelize');

// ── INSCRIPTION PME ────────────────────────────────────────────
const inscrirePME = async ({ nom, secteur, email, telephone, mot_de_passe }) => {
  const existe = await PME.findOne({ where: { email } });
  if (existe) throw new Error('Un compte PME avec cet email existe déjà');

  const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

  const pme = await PME.create({
    id: uuidv4(),
    nom,
    secteur,
    email,
    telephone: telephone || null,
    mot_de_passe_hash,
    statut: 'actif',
    created_at: new Date()
  });

  console.log(`🏢 Nouvelle PME inscrite : ${nom} (${secteur}) — ${email}`);
  return pme;
};

// ── AJOUTER UNE TRANSACTION ────────────────────────────────────
const ajouterTransaction = async ({ pme_id, type, montant, description, date }) => {
  const pme = await PME.findByPk(pme_id);
  if (!pme) throw new Error('PME introuvable');
  if (!['revenu', 'depense'].includes(type)) throw new Error('Type invalide : revenu ou depense');
  if (montant <= 0) throw new Error('Le montant doit être positif');

  const transaction = await TransactionPME.create({
    id: uuidv4(),
    pme_id,
    type,
    montant: parseFloat(montant),
    description: description || null,
    date: date || new Date().toISOString().split('T')[0],
    created_at: new Date()
  });

  console.log(`💳 Transaction ${type} : ${montant} FCFA — PME ${pme_id}`);
  return transaction;
};

// ── DASHBOARD PME ──────────────────────────────────────────────
const getDashboard = async (pme_id) => {
  const pme = await PME.findByPk(pme_id, {
    attributes: ['id', 'nom', 'secteur', 'email', 'statut', 'created_at']
  });
  if (!pme) throw new Error('PME introuvable');

  const transactions = await TransactionPME.findAll({
    where: { pme_id },
    order: [['date', 'DESC']],
    limit: 50
  });

  const total_revenus = transactions
    .filter(t => t.type === 'revenu')
    .reduce((sum, t) => sum + t.montant, 0);

  const total_depenses = transactions
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.montant, 0);

  const solde = total_revenus - total_depenses;

  return {
    pme,
    resume: {
      total_revenus: parseFloat(total_revenus.toFixed(2)),
      total_depenses: parseFloat(total_depenses.toFixed(2)),
      solde: parseFloat(solde.toFixed(2)),
      nb_transactions: transactions.length
    },
    transactions
  };
};

// ── CALCUL SCORE BCX ───────────────────────────────────────────
/**
 * Algorithme Score BCX (0-100) :
 * - Ratio revenus/dépenses         (40 pts max) — santé financière
 * - Régularité des transactions    (30 pts max) — activité mensuelle
 * - Volume total traité            (20 pts max) — taille de l'activité
 * - Ancienneté du compte           (10 pts max) — stabilité dans le temps
 */
const calculerScoreBCX = async (pme_id) => {
  const pme = await PME.findByPk(pme_id);
  if (!pme) throw new Error('PME introuvable');

  const transactions = await TransactionPME.findAll({ where: { pme_id } });

  if (transactions.length === 0) {
    return {
      score: 0,
      niveau: 'Débutant',
      details: { ratio: 0, regularite: 0, volume: 0, anciennete: 0 },
      message: 'Aucune transaction enregistrée. Commencez à saisir vos opérations financières.'
    };
  }

  const revenus = transactions.filter(t => t.type === 'revenu').reduce((s, t) => s + t.montant, 0);
  const depenses = transactions.filter(t => t.type === 'depense').reduce((s, t) => s + t.montant, 0);

  // 1. Ratio revenus/dépenses (40 pts)
  let score_ratio = 0;
  if (depenses === 0) {
    score_ratio = revenus > 0 ? 40 : 0;
  } else {
    const ratio = revenus / depenses;
    if (ratio >= 2.0) score_ratio = 40;
    else if (ratio >= 1.5) score_ratio = 32;
    else if (ratio >= 1.2) score_ratio = 24;
    else if (ratio >= 1.0) score_ratio = 16;
    else if (ratio >= 0.7) score_ratio = 8;
    else score_ratio = 0;
  }

  // 2. Régularité — nb de mois distincts avec au moins 1 transaction (30 pts)
  const mois_actifs = new Set(transactions.map(t => t.date.toString().substring(0, 7))).size;
  const anciennete_mois = Math.max(1, Math.ceil(
    (new Date() - new Date(pme.created_at)) / (1000 * 60 * 60 * 24 * 30)
  ));
  const taux_regularite = Math.min(1, mois_actifs / anciennete_mois);
  const score_regularite = Math.round(taux_regularite * 30);

  // 3. Volume total (20 pts) — seuils en FCFA
  const volume_total = revenus + depenses;
  let score_volume = 0;
  if (volume_total >= 10_000_000) score_volume = 20;
  else if (volume_total >= 5_000_000) score_volume = 16;
  else if (volume_total >= 1_000_000) score_volume = 12;
  else if (volume_total >= 500_000) score_volume = 8;
  else if (volume_total >= 100_000) score_volume = 4;
  else score_volume = 2;

  // 4. Ancienneté (10 pts)
  let score_anciennete = 0;
  if (anciennete_mois >= 12) score_anciennete = 10;
  else if (anciennete_mois >= 6) score_anciennete = 7;
  else if (anciennete_mois >= 3) score_anciennete = 4;
  else score_anciennete = 1;

  const score_total = score_ratio + score_regularite + score_volume + score_anciennete;

  let niveau = 'Débutant';
  if (score_total >= 80) niveau = 'Excellent';
  else if (score_total >= 60) niveau = 'Bon';
  else if (score_total >= 40) niveau = 'Intermédiaire';
  else if (score_total >= 20) niveau = 'En progression';

  console.log(`📊 Score BCX calculé pour PME ${pme_id} : ${score_total}/100 — Niveau : ${niveau}`);

  return {
    score: score_total,
    niveau,
    details: {
      ratio: score_ratio,
      regularite: score_regularite,
      volume: score_volume,
      anciennete: score_anciennete
    },
    stats: {
      total_revenus: parseFloat(revenus.toFixed(2)),
      total_depenses: parseFloat(depenses.toFixed(2)),
      solde: parseFloat((revenus - depenses).toFixed(2)),
      nb_transactions: transactions.length,
      mois_actifs,
      anciennete_mois
    }
  };
};

// ── RAPPORT MENSUEL ────────────────────────────────────────────
const getRapportMensuel = async (pme_id, annee, mois) => {
  const pme = await PME.findByPk(pme_id, {
    attributes: ['id', 'nom', 'secteur', 'email']
  });
  if (!pme) throw new Error('PME introuvable');

  const debut = `${annee}-${String(mois).padStart(2, '0')}-01`;
  const fin = new Date(annee, mois, 0).toISOString().split('T')[0];

  const transactions = await TransactionPME.findAll({
    where: {
      pme_id,
      date: { [Op.between]: [debut, fin] }
    },
    order: [['date', 'ASC']]
  });

  const revenus = transactions.filter(t => t.type === 'revenu').reduce((s, t) => s + t.montant, 0);
  const depenses = transactions.filter(t => t.type === 'depense').reduce((s, t) => s + t.montant, 0);

  return {
    pme,
    periode: { annee, mois, debut, fin },
    resume: {
      total_revenus: parseFloat(revenus.toFixed(2)),
      total_depenses: parseFloat(depenses.toFixed(2)),
      solde: parseFloat((revenus - depenses).toFixed(2)),
      nb_transactions: transactions.length
    },
    transactions
  };
};

module.exports = {
  inscrirePME,
  ajouterTransaction,
  getDashboard,
  calculerScoreBCX,
  getRapportMensuel
};
