'use strict';
const {
  ajouterAyantDroit,
  mesAyantsDroit,
  tousLesAyantsDroit,
  validerAyantDroit,
  refuserAyantDroit
} = require('../services/ayantDroitService');

// POST /api/ayants-droit — Ajouter un ayant droit (investisseur)
const ajouter = async (req, res) => {
  try {
    const { nom, prenom, email, lien_parente } = req.body;

    const ayantDroit = await ajouterAyantDroit({
      investisseur_id: req.investisseur.id,
      nom,
      prenom,
      email,
      lien_parente
    });

    res.status(201).json({
      message: 'Ayant droit ajouté avec succès, en attente de validation',
      ayantDroit
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/ayants-droit — Mes ayants droit (investisseur)
const mesList = async (req, res) => {
  try {
    const ayantsDroit = await mesAyantsDroit(req.investisseur.id);
    res.json(ayantsDroit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ayants-droit/admin/tous — Tous les ayants droit (admin)
const tousAdmin = async (req, res) => {
  try {
    const { statut } = req.query;
    const ayantsDroit = await tousLesAyantsDroit(statut);
    res.json(ayantsDroit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/ayants-droit/:id/valider — Valider (admin)
const valider = async (req, res) => {
  try {
    const { id } = req.params;
    const ayantDroit = await validerAyantDroit(id, req.investisseur.id);
    res.json({
      message: 'Ayant droit validé avec succès',
      ayantDroit
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/ayants-droit/:id/refuser — Refuser (admin)
const refuser = async (req, res) => {
  try {
    const { id } = req.params;
    const ayantDroit = await refuserAyantDroit(id, req.investisseur.id);
    res.json({
      message: 'Ayant droit refusé',
      ayantDroit
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  ajouter,
  mesList,
  tousAdmin,
  valider,
  refuser
};