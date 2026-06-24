'use strict';
const { Investisseur, Depot, Compte } = require('../models');

// GET /api/admin/stats
const getStats = async (req, res) => {
  const total_investisseurs = await Investisseur.count({ where: { role: 'investisseur' } });
  
  const total_depots = await Depot.count();

  const total_bcx_distribues = await Compte.sum('total_bcx_tokens') || 0;

  res.json({
    total_investisseurs,
    total_depots,
    total_bcx_distribues
  });
};

module.exports = { getStats };
