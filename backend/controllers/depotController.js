"use strict";
const {
  creerDepot,
  validerDepot,
  refuserDepot,
  mettreAJourWallet: mettreAJourWalletService,
} = require("../services/depotService");
const { Depot, Compte, ConversionToken, Investisseur } = require("../models");

// POST /api/depots — Créer un dépôt (investisseur connecté)
const nouveauDepot = async (req, res) => {
  try {
    const { montant, devise_origine, moyen_paiement, voie, tx_hash } = req.body;

    if (!montant || !devise_origine || !voie) {
      return res.status(400).json({
        message:
          "Champs obligatoires manquants : montant, devise_origine, voie",
      });
    }

    if (!["A", "B"].includes(voie)) {
      return res.status(400).json({
        message: "La voie doit être A (FCFA/virement) ou B (crypto)",
      });
    }

    if (!["FCFA", "USD", "CRYPTO"].includes(devise_origine)) {
      return res.status(400).json({
        message: "devise_origine doit être FCFA, USD ou CRYPTO",
      });
    }

    const depot = await creerDepot({
      investisseur_id: req.investisseur.id,
      montant: parseFloat(montant),
      devise_origine,
      moyen_paiement,
      voie,
      tx_hash,
  const { montant, devise_origine, moyen_paiement, voie, tx_hash } = req.body;

  if (!montant || !devise_origine || !voie) {
    return res.status(400).json({
      success: false,
      message: 'Champs obligatoires manquants : montant, devise_origine, voie'
    });
  }

    res.status(201).json({
      message: "Dépôt soumis avec succès, en attente de validation",
      depot,
  if (!['A', 'B'].includes(voie)) {
    return res.status(400).json({
      success: false,
      message: 'La voie doit être A (FCFA/virement) ou B (crypto)'
    });
  }

  if (!['FCFA', 'USD', 'CRYPTO'].includes(devise_origine)) {
    return res.status(400).json({
      success: false,
      message: 'devise_origine doit être FCFA, USD ou CRYPTO'
    });
  }

  const depot = await creerDepot({
    investisseur_id: req.investisseur.id,
    montant: parseFloat(montant),
    devise_origine,
    moyen_paiement,
    voie,
    tx_hash
  });

  res.status(201).json({
    message: 'Dépôt soumis avec succès, en attente de validation',
    depot
  });
};

// GET /api/depots — Mes dépôts (investisseur connecté)
const mesDepots = async (req, res) => {
  try {
    const depots = await Depot.findAll({
      where: { investisseur_id: req.investisseur.id },
      include: [
        {
          model: ConversionToken,
          required: false,
        },
      ],
      order: [["date_depot", "DESC"]],
    });

    res.json(depots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  const depots = await Depot.findAll({
    where: { investisseur_id: req.investisseur.id },
    include: [{
      model: ConversionToken,
      required: false
    }],
    order: [['date_depot', 'DESC']]
  });

  res.json(depots);
};

// GET /api/depots/compte — Mon compte + solde BCX
const monCompte = async (req, res) => {
  try {
    const compte = await Compte.findOne({
      where: { investisseur_id: req.investisseur.id },
    });

    if (!compte) {
      return res.status(404).json({ message: "Compte introuvable" });
    }

    const investisseur = await Investisseur.findByPk(req.investisseur.id, {
      attributes: [
        "id",
        "nom",
        "prenom",
        "email",
        "niveau",
        "wallet_address",
        "statut",
      ],
    });
  const compte = await Compte.findOne({
    where: { investisseur_id: req.investisseur.id }
  });

  if (!compte) {
    return res.status(404).json({ success: false, message: 'Compte introuvable' });
  }

  const investisseur = await Investisseur.findByPk(req.investisseur.id, {
    attributes: ['id', 'nom', 'prenom', 'email', 'niveau', 'wallet_address', 'statut']
  });

  res.json({ compte, investisseur });
};

// PUT /api/depots/:depot_id/valider — Valider un dépôt (admin)
const valider = async (req, res) => {
  const { depot_id } = req.params;

    // On récupère la voie depuis le dépôt en base — pas besoin de la passer en body
    const depot = await Depot.findByPk(depot_id);
    if (!depot) {
      return res.status(404).json({ message: "Dépôt introuvable" });
    }
  // On récupère la voie depuis le dépôt en base — pas besoin de la passer en body
  const depot = await Depot.findByPk(depot_id);
  if (!depot) {
    return res.status(404).json({ success: false, message: 'Dépôt introuvable' });
  }

  const result = await validerDepot(depot_id, req.investisseur.id);

    res.json({
      message: "Dépôt validé avec succès",
      ...result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  res.json({
    message: 'Dépôt validé avec succès',
    ...result
  });
};

// PUT /api/depots/:depot_id/refuser — Refuser un dépôt (admin)
const refuser = async (req, res) => {
  const { depot_id } = req.params;
  const { motif } = req.body;

    if (!motif) {
      return res
        .status(400)
        .json({ message: "Un motif de refus est obligatoire" });
    }
  if (!motif) {
    return res.status(400).json({ success: false, message: 'Un motif de refus est obligatoire' });
  }

  const depot = await refuserDepot(depot_id, req.investisseur.id, motif);

    res.json({
      message: "Dépôt refusé",
      depot,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  res.json({
    message: 'Dépôt refusé',
    depot
  });
};

// GET /api/depots/admin/tous — Tous les dépôts (admin)
const tousLesDepots = async (req, res) => {
  try {
    const { statut } = req.query;
    const where = statut ? { statut } : {};

    const depots = await Depot.findAll({
      where,
      include: [
        {
          model: Investisseur,
          attributes: ["nom", "prenom", "email", "niveau", "wallet_address"],
        },
        {
          model: ConversionToken,
          required: false,
        },
      ],
      order: [["date_depot", "DESC"]],
    });
  const { statut } = req.query;
  const where = statut ? { statut } : {};

  const depots = await Depot.findAll({
    where,
    include: [
      {
        model: Investisseur,
        attributes: ['nom', 'prenom', 'email', 'niveau', 'wallet_address']
      },
      {
        model: ConversionToken,
        required: false
      }
    ],
    order: [['date_depot', 'DESC']]
  });

  res.json(depots);
};

// PUT /api/depots/wallet — Mettre à jour le wallet address
const mettreAJourWallet = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address) {
      return res.status(400).json({ message: "wallet_address requis" });
    }
    const result = await mettreAJourWalletService(
      req.investisseur.id,
      wallet_address,
    );
    res.json({ message: "Wallet mis à jour avec succès", ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  const { wallet_address } = req.body;
  if (!wallet_address) {
    return res.status(400).json({ success: false, message: 'wallet_address requis' });
  }
  const result = await mettreAJourWalletService(req.investisseur.id, wallet_address);
  res.json({ message: 'Wallet mis à jour avec succès', ...result });
};

module.exports = {
  nouveauDepot,
  mesDepots,
  monCompte,
  valider,
  refuser,
  tousLesDepots,
  mettreAJourWallet,
};
