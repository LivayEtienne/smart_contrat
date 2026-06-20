'use strict';
const { ethers } = require('ethers');
const { TauxConversion, Compte, Investisseur } = require('../models');

const TAUX_FCFA_USD = 600;

// ABI minimal du BCX Token — uniquement les fonctions utilisées
const BCX_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)"
];

const CONTRACT_ADDRESS = "0x309A26Fc44cF5DA36E5A5d3f43ACbC8ffDB73489";

const getContrat = () => {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, BCX_ABI, wallet);
};

const convertirEnUSD = (montant, devise) => {
  if (devise === 'USD') return { montant_usd: montant, taux_change_usd: 1 };
  if (devise === 'FCFA') return { montant_usd: montant / TAUX_FCFA_USD, taux_change_usd: TAUX_FCFA_USD };
  // CRYPTO — montant déjà en USD (valeur en ETH convertie côté frontend)
  return { montant_usd: montant, taux_change_usd: 1 };
};

const getNiveau = (total_usd) => {
  if (total_usd >= 10000) return 'Majeur';
  if (total_usd >= 5000) return 'Elite';
  if (total_usd >= 500) return 'Pionnier';
  return null; // En dessous du minimum
};

const getTauxConversion = async (niveau) => {
  const taux = await TauxConversion.findOne({
    where: { niveau, actif: true }
  });
  if (!taux) throw new Error(`Taux de conversion introuvable pour le niveau ${niveau}`);
  return taux;
};

const calculerTokens = async (montant_usd, niveau) => {
  const taux = await getTauxConversion(niveau);
  const tokens = montant_usd * taux.taux_bcx_par_usd;
  return { tokens, taux };
};

// Transfert réel de BCX tokens sur Sepolia vers le wallet de l'investisseur
const transfererTokensOnChain = async (wallet_address, tokens) => {
  try {
    const contrat = getContrat();
    const montant = ethers.parseUnits(tokens.toFixed(6), 18);
    const tx = await contrat.transfer(wallet_address, montant);
    await tx.wait();
    console.log(`✅ Transfert on-chain : ${tokens} BCX → ${wallet_address}`);
    console.log(`   Hash : ${tx.hash}`);
    return tx.hash;
  } catch (err) {
    console.error('❌ Erreur transfert on-chain :', err.message);
    throw new Error('Transfert blockchain échoué : ' + err.message);
  }
};

const mettreAJourCompte = async (investisseur_id, montant_usd, tokens) => {
  const compte = await Compte.findOne({ where: { investisseur_id } });
  if (!compte) throw new Error('Compte introuvable');

  compte.total_investi_usd = parseFloat((compte.total_investi_usd + montant_usd).toFixed(2));
  compte.total_bcx_tokens = parseFloat((compte.total_bcx_tokens + tokens).toFixed(6));
  await compte.save();

  return compte;
};

module.exports = {
  convertirEnUSD,
  getNiveau,
  calculerTokens,
  transfererTokensOnChain,
  mettreAJourCompte
};