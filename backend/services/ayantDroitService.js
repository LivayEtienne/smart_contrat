'use strict';
const { v4: uuidv4 } = require('uuid');
const { AyantDroit, Investisseur } = require('../models');

// ── AJOUTER UN AYANT DROIT (investisseur) ─────────────────────
const ajouterAyantDroit = async ({ investisseur_id, nom, prenom, email, lien_parente }) => {
  if (!nom || !prenom || !lien_parente) {
    throw new Error('Nom, prénom et lien de parenté sont obligatoires');
  }

  const ayantDroit = await AyantDroit.create({
    id: uuidv4(),
    investisseur_id,
    nom,
    prenom,
    email: email || null,
    lien_parente,
    statut: 'en_attente',
    created_at: new Date()
  });

  console.log(`👥 Ayant droit ajouté : ${prenom} ${nom} pour investisseur ${investisseur_id}`);

  return ayantDroit;
};

// ── MES AYANTS DROIT (investisseur) ───────────────────────────
const mesAyantsDroit = async (investisseur_id) => {
  return await AyantDroit.findAll({
    where: { investisseur_id },
    order: [['created_at', 'DESC']]
  });
};

// ── TOUS LES AYANTS DROIT (admin) ─────────────────────────────
const tousLesAyantsDroit = async (statut) => {
  const where = statut ? { statut } : {};

  return await AyantDroit.findAll({
    where,
    include: [{
      model: Investisseur,
      attributes: ['nom', 'prenom', 'email', 'niveau']
    }],
    order: [['created_at', 'DESC']]
  });
};

// ── VALIDER UN AYANT DROIT (admin) ────────────────────────────
const validerAyantDroit = async (ayant_droit_id, admin_id) => {
  const ayantDroit = await AyantDroit.findByPk(ayant_droit_id);
  if (!ayantDroit) throw new Error('Ayant droit introuvable');
  if (ayantDroit.statut !== 'en_attente') {
    throw new Error(`Cet ayant droit est déjà ${ayantDroit.statut}`);
  }

  ayantDroit.statut = 'valide';
  ayantDroit.valide_par = admin_id;
  ayantDroit.date_validation = new Date();
  await ayantDroit.save();

  console.log(`✅ Ayant droit ${ayant_droit_id} validé par admin ${admin_id}`);

  return ayantDroit;
};

// ── REFUSER UN AYANT DROIT (admin) ────────────────────────────
const refuserAyantDroit = async (ayant_droit_id, admin_id) => {
  const ayantDroit = await AyantDroit.findByPk(ayant_droit_id);
  if (!ayantDroit) throw new Error('Ayant droit introuvable');
  if (ayantDroit.statut !== 'en_attente') {
    throw new Error(`Cet ayant droit est déjà ${ayantDroit.statut}`);
  }

  ayantDroit.statut = 'refuse';
  ayantDroit.valide_par = admin_id;
  ayantDroit.date_validation = new Date();
  await ayantDroit.save();

  console.log(`❌ Ayant droit ${ayant_droit_id} refusé par admin ${admin_id}`);

  return ayantDroit;
};

module.exports = {
  ajouterAyantDroit,
  mesAyantsDroit,
  tousLesAyantsDroit,
  validerAyantDroit,
  refuserAyantDroit
};