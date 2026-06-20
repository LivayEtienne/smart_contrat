'use strict';
const { v4: uuidv4 } = require('uuid');
const { Depot, ConversionToken, Investisseur, Compte } = require('../models');
const {
  convertirEnUSD,
  getNiveau,
  calculerTokens,
  transfererTokensOnChain,
  mettreAJourCompte
} = require('./tokenService');

const MONTANT_MINIMUM_USD = 500;

// ── CRÉER UN DÉPÔT (en attente de validation) ─────────────────
const creerDepot = async ({
  investisseur_id,
  montant,
  devise_origine,
  moyen_paiement,
  voie,
  tx_hash
}) => {
  const { montant_usd, taux_change_usd } = convertirEnUSD(montant, devise_origine);

  if (montant_usd < MONTANT_MINIMUM_USD) {
    throw new Error(
      `Montant minimum d'investissement : 500 USD (vous avez soumis ${montant_usd.toFixed(2)} USD)`
    );
  }

  if (voie === 'B' && !tx_hash) {
    throw new Error('Le hash de transaction blockchain est obligatoire pour un dépôt crypto (Voie B)');
  }

  const depot = await Depot.create({
    id: uuidv4(),
    investisseur_id,
    montant,
    devise_origine,
    montant_usd: parseFloat(montant_usd.toFixed(2)),
    taux_change_usd,
    moyen_paiement: moyen_paiement || null,
    voie,
    statut: 'en_attente',
    tx_hash: tx_hash || null,
    date_depot: new Date()
  });

  console.log(`📥 Nouveau dépôt créé : ${montant} ${devise_origine} = ${montant_usd.toFixed(2)} USD [Voie ${voie}]`);

  return depot;
};

// ── VALIDER UN DÉPÔT (admin uniquement) ───────────────────────
const validerDepot = async (depot_id, admin_id) => {
  const depot = await Depot.findByPk(depot_id);
  if (!depot) throw new Error('Dépôt introuvable');
  if (depot.statut !== 'en_attente') {
    throw new Error(`Ce dépôt est déjà ${depot.statut}`);
  }

  const compte = await Compte.findOne({ where: { investisseur_id: depot.investisseur_id } });
  if (!compte) throw new Error('Compte investisseur introuvable');

  const nouveauTotal = compte.total_investi_usd + depot.montant_usd;
  const niveau = getNiveau(nouveauTotal);

  if (!niveau) {
    throw new Error(
      `Total après dépôt (${nouveauTotal.toFixed(2)} USD) insuffisant pour atteindre le niveau minimum (500 USD)`
    );
  }

  const { tokens, taux } = await calculerTokens(depot.montant_usd, niveau);

  const investisseur = await Investisseur.findByPk(depot.investisseur_id);
  let tx_hash_onchain = null;

  // ── Transfert on-chain si wallet renseigné ─────────────────
  if (investisseur.wallet_address) {
    if (depot.voie === 'B') {
      // Voie B — transfert obligatoire, on bloque si ça échoue
      tx_hash_onchain = await transfererTokensOnChain(investisseur.wallet_address, tokens);
    } else {
      // Voie A — transfert tenté mais non bloquant
      try {
        tx_hash_onchain = await transfererTokensOnChain(investisseur.wallet_address, tokens);
      } catch (err) {
        console.warn('⚠️ Transfert on-chain échoué pour Voie A, validation maintenue :', err.message);
      }
    }
  }

  // Enregistrer la conversion token
  await ConversionToken.create({
    id: uuidv4(),
    depot_id: depot.id,
    taux_id: taux.id,
    montant_usd: depot.montant_usd,
    taux_bcx_par_usd: taux.taux_bcx_par_usd,
    tokens_attribues: parseFloat(tokens.toFixed(6)),
    niveau_applique: niveau,
    created_at: new Date()
  });

  // Mettre à jour le compte
  const compteMAJ = await mettreAJourCompte(depot.investisseur_id, depot.montant_usd, tokens);

  // Mettre à jour le niveau investisseur
  await Investisseur.update(
    { niveau },
    { where: { id: depot.investisseur_id } }
  );

  // Valider le dépôt
  depot.statut = 'valide';
  depot.valide_par = admin_id;
  depot.date_validation = new Date();
  if (tx_hash_onchain) depot.tx_hash = tx_hash_onchain;
  await depot.save();

  console.log(`✅ Dépôt ${depot_id} validé — ${tokens.toFixed(2)} BCX attribués — Niveau : ${niveau}`);

  return {
    depot,
    tokens: parseFloat(tokens.toFixed(6)),
    niveau,
    compte: compteMAJ,
    tx_hash_onchain
  };
};

// ── REFUSER UN DÉPÔT (admin uniquement) ───────────────────────
const refuserDepot = async (depot_id, admin_id, motif) => {
  const depot = await Depot.findByPk(depot_id);
  if (!depot) throw new Error('Dépôt introuvable');
  if (depot.statut !== 'en_attente') {
    throw new Error(`Ce dépôt est déjà ${depot.statut}`);
  }

  depot.statut = 'refuse';
  depot.valide_par = admin_id;
  depot.date_validation = new Date();
  await depot.save();

  console.log(`❌ Dépôt ${depot_id} refusé par admin ${admin_id}. Motif : ${motif || 'non précisé'}`);

  return depot;
};

// ── METTRE À JOUR LE WALLET ADDRESS ───────────────────────────
const mettreAJourWallet = async (investisseur_id, wallet_address) => {
  const investisseur = await Investisseur.findByPk(investisseur_id);
  if (!investisseur) throw new Error('Investisseur introuvable');

  await investisseur.update({ wallet_address });

  console.log(`🦊 Wallet mis à jour pour ${investisseur.email} : ${wallet_address}`);

  return { wallet_address };
};

module.exports = { creerDepot, validerDepot, refuserDepot, mettreAJourWallet };